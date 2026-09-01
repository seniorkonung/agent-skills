import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { chmod, mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  discoverReviewTarget,
  matchChangedPathsToChanges,
} from '../scripts/discover-review-target.mjs';

function git(cwd, ...args) {
  return execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
}

async function createRepository() {
  const repositoryRoot = await mkdtemp(
    path.join(tmpdir(), 'openspec-review-target-'),
  );

  git(repositoryRoot, 'init', '--quiet', '--initial-branch=main');
  git(repositoryRoot, 'config', 'user.name', 'Review Target Test');
  git(repositoryRoot, 'config', 'user.email', 'review-target@example.test');

  await mkdir(path.join(repositoryRoot, 'src'), { recursive: true });
  await writeFile(path.join(repositoryRoot, 'src/app.js'), 'export const value = 1;\n');
  git(repositoryRoot, 'add', '.');
  git(repositoryRoot, 'commit', '--quiet', '-m', 'chore: create fixture');

  const changeRoot = path.join(repositoryRoot, 'openspec/changes/add-value');
  await mkdir(changeRoot, { recursive: true });
  await writeFile(path.join(repositoryRoot, 'src/app.js'), 'export const value = 2;\n');
  await writeFile(path.join(changeRoot, 'tasks.md'), '- [x] 1.1 Change value\n');
  git(repositoryRoot, 'add', '.');
  git(repositoryRoot, 'commit', '--quiet', '-m', 'feat: change value');

  const openspecBin = path.join(
    await mkdtemp(path.join(tmpdir(), 'fake-openspec-')),
    'openspec',
  );
  const changeStatus = {
    changeName: 'add-value',
    schemaName: 'spec-driven',
    changeRoot,
    artifactPaths: {
      tasks: {
        outputPath: 'tasks.md',
        resolvedOutputPath: path.join(changeRoot, 'tasks.md'),
        existingOutputPaths: [path.join(changeRoot, 'tasks.md')],
      },
    },
    actionContext: { mode: 'repo-local' },
    artifacts: [],
  };

  await writeFakeOpenSpec(openspecBin, [changeStatus]);

  return { changeRoot, changeStatus, openspecBin, repositoryRoot };
}

async function writeFakeOpenSpec(
  openspecBin,
  statuses,
  { failBatch = false } = {},
) {
  const listPayload = {
    changes: statuses.map((status) => ({ name: status.changeName })),
  };
  const cases = statuses
    .map(
      (status) =>
        `    ${status.changeName}) printf '%s\\n' '${JSON.stringify(status)}' ;;`,
    )
    .join('\n');

  await writeFile(
    openspecBin,
    `#!/bin/sh
if [ "$1" = "list" ]; then
  printf '%s\\n' '${JSON.stringify(listPayload)}'
  exit 0
fi
if [ "$1" = "status" ] && [ "$2" = "--change" ]; then
  case "$3" in
${cases}
    *) exit 1 ;;
  esac
  exit 0
fi
if [ "$1" = "status" ] && [ "$2" = "--all" ]; then
  ${failBatch ? "printf '%s\\n' 'unknown option --all' >&2; exit 1" : `printf '%s\\n' '${JSON.stringify({ changes: statuses })}'; exit 0`}
fi
exit 64
`,
  );
  await chmod(openspecBin, 0o755);
}

test('discovers the one OpenSpec change touched by outgoing commits', async () => {
  const { openspecBin, repositoryRoot } = await createRepository();

  const result = discoverReviewTarget({
    cwd: repositoryRoot,
    openspecBin,
    upstreamRef: 'HEAD~1',
  });

  assert.equal(result.result, 'ready');
  assert.equal(result.ahead, 1);
  assert.equal(result.behind, 0);
  assert.equal(result.change.name, 'add-value');
  assert.equal(result.change.schemaName, 'spec-driven');
  assert.deepEqual(result.changedPaths, [
    'openspec/changes/add-value/tasks.md',
    'src/app.js',
  ]);
  assert.deepEqual(result.pathsOutsideChangeRoot, ['src/app.js']);
  assert.equal('implementationPaths' in result, false);
  assert.equal(result.upstreamFreshness, 'explicit local ref; no fetch performed');
});

test('discovers changes without requiring batch status support', async () => {
  const { changeStatus, openspecBin, repositoryRoot } = await createRepository();
  await writeFakeOpenSpec(openspecBin, [changeStatus], { failBatch: true });

  const result = discoverReviewTarget({
    cwd: repositoryRoot,
    openspecBin,
    upstreamRef: 'HEAD~1',
  });

  assert.equal(result.result, 'ready');
  assert.equal(result.change.name, 'add-value');
});

test('returns a no-op result when there are no outgoing commits', async () => {
  const { openspecBin, repositoryRoot } = await createRepository();

  const result = discoverReviewTarget({
    cwd: repositoryRoot,
    openspecBin,
    upstreamRef: 'HEAD',
  });

  assert.equal(result.result, 'no_outgoing_commits');
  assert.equal(result.ahead, 0);
  assert.deepEqual(result.changedPaths, []);
});

test('keeps multiple touched changes explicit instead of guessing', () => {
  const repositoryRoot = '/workspace';
  const statuses = [
    {
      changeName: 'add-search',
      changeRoot: '/workspace/openspec/changes/add-search',
    },
    {
      changeName: 'add-export',
      changeRoot: '/workspace/openspec/changes/add-export',
    },
  ];

  const matches = matchChangedPathsToChanges({
    changedPaths: [
      'openspec/changes/add-search/tasks.md',
      'openspec/changes/add-export/tasks.md',
      'src/shared.js',
    ],
    repositoryRoot,
    statuses,
  });

  assert.deepEqual(
    matches.map(({ name }) => name),
    ['add-export', 'add-search'],
  );
});

test('an explicit change cannot hide another change in the same range', async () => {
  const { changeRoot, openspecBin, repositoryRoot } = await createRepository();
  const secondChangeRoot = path.join(
    repositoryRoot,
    'openspec/changes/add-export',
  );
  await mkdir(secondChangeRoot, { recursive: true });
  await writeFile(
    path.join(secondChangeRoot, 'tasks.md'),
    '- [x] 1.1 Add export\n',
  );
  git(repositoryRoot, 'add', '.');
  git(repositoryRoot, 'commit', '--quiet', '-m', 'feat: add export');

  const statuses = [
    {
      changeName: 'add-value',
      schemaName: 'spec-driven',
      changeRoot,
      artifactPaths: {},
      artifacts: [],
    },
    {
      changeName: 'add-export',
      schemaName: 'spec-driven',
      changeRoot: secondChangeRoot,
      artifactPaths: {},
      artifacts: [],
    },
  ];
  await writeFakeOpenSpec(openspecBin, statuses);

  const result = discoverReviewTarget({
    changeName: 'add-value',
    cwd: repositoryRoot,
    openspecBin,
    upstreamRef: 'HEAD~2',
  });

  assert.equal(result.result, 'incomplete');
  assert.equal(result.reason, 'multiple_change_matches');
  assert.deepEqual(
    result.candidates.map(({ name }) => name),
    ['add-export', 'add-value'],
  );
});

test('a report-only commit does not create an endless review target', async () => {
  const { changeRoot, openspecBin, repositoryRoot } = await createRepository();
  const reportPath = path.join(changeRoot, 'implementation-review.md');
  await writeFile(reportPath, '# Implementation review\n');
  git(repositoryRoot, 'add', '.');
  git(repositoryRoot, 'commit', '--quiet', '-m', 'docs: record review');

  const result = discoverReviewTarget({
    cwd: repositoryRoot,
    openspecBin,
    upstreamRef: 'HEAD~1',
  });

  assert.equal(
    result.result,
    'no_reviewable_changes',
    JSON.stringify(result, null, 2),
  );
  assert.deepEqual(result.changedPaths, [
    'openspec/changes/add-value/implementation-review.md',
  ]);
  assert.deepEqual(result.excludedPaths, [
    'openspec/changes/add-value/implementation-review.md',
  ]);
});
