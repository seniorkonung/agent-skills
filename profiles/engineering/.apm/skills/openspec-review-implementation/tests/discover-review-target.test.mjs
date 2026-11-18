import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { chmod, mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  discoverReviewTarget,
  matchChangedPathsToChanges,
} from '../scripts/discover-review-target.mjs';

function git(cwd, ...args) {
  execFileSync('git', args, {
    cwd,
    stdio: ['ignore', 'ignore', 'inherit'],
  });
}

async function createRepository() {
  const repositoryRoot = await mkdtemp(
    path.join(tmpdir(), 'openspec-review-target-'),
  );

  git(repositoryRoot, 'init', '--quiet', '--initial-branch=main');
  git(repositoryRoot, 'config', 'user.name', 'Review Target Test');
  git(repositoryRoot, 'config', 'user.email', 'review-target@example.test');
  git(repositoryRoot, 'config', 'commit.gpgsign', 'false');

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

async function writeNodeFakeOpenSpec(
  openspecBin,
  statuses,
  { oversizedList = false } = {},
) {
  await writeFile(
    openspecBin,
    `#!/usr/bin/env node
import { fstatSync } from 'node:fs';

if (!fstatSync(1).isFile() || !fstatSync(2).isFile()) process.exit(70);

const statuses = ${JSON.stringify(statuses)};
const [command, ...args] = process.argv.slice(2);

if (command === 'list' && args[0] === '--json') {
  if (${oversizedList}) {
    console.log('x'.repeat(1024 * 1024 + 1));
  } else {
    console.log(JSON.stringify({
      changes: statuses.map(({ changeName }) => ({ name: changeName })),
    }));
  }
} else if (
  command === 'status' &&
  args[0] === '--change' &&
  args[2] === '--json'
) {
  const status = statuses.find(({ changeName }) => changeName === args[1]);
  if (status) console.log(JSON.stringify(status));
  else process.exitCode = 1;
} else {
  process.exitCode = 64;
}
`,
  );
  await chmod(openspecBin, 0o755);
}

test('discovers the one OpenSpec change touched by the supplied range', async () => {
  const { openspecBin, repositoryRoot } = await createRepository();

  const result = discoverReviewTarget({
    cwd: repositoryRoot,
    openspecBin,
    headRef: 'HEAD',
    baseRef: 'HEAD~1',
  });

  assert.equal(result.result, 'ready');
  assert.equal(result.commits.length, 1);
  assert.deepEqual(result.commits, [result.head]);
  assert.notEqual(result.base, result.head);
  assert.equal(result.change.name, 'add-value');
  assert.equal(result.change.schemaName, 'spec-driven');
  assert.deepEqual(result.changedPaths, [
    'openspec/changes/add-value/tasks.md',
    'src/app.js',
  ]);
  assert.deepEqual(result.pathsOutsideChangeRoot, ['src/app.js']);
  assert.equal('implementationPaths' in result, false);
  assert.equal(result.baseRef, 'HEAD~1');
  assert.equal(result.headRef, 'HEAD');
});

test('discovers changes without requiring batch status support', async () => {
  const { changeStatus, openspecBin, repositoryRoot } = await createRepository();
  await writeFakeOpenSpec(openspecBin, [changeStatus], { failBatch: true });

  const result = discoverReviewTarget({
    cwd: repositoryRoot,
    openspecBin,
    headRef: 'HEAD',
    baseRef: 'HEAD~1',
  });

  assert.equal(result.result, 'ready');
  assert.equal(result.change.name, 'add-value');
});

test('captures output from a Node OpenSpec CLI through regular files', async () => {
  const { changeStatus, openspecBin, repositoryRoot } = await createRepository();
  await writeNodeFakeOpenSpec(openspecBin, [changeStatus]);

  const result = discoverReviewTarget({
    cwd: repositoryRoot,
    openspecBin,
    headRef: 'HEAD',
    baseRef: 'HEAD~1',
  });

  assert.equal(result.result, 'ready', JSON.stringify(result, null, 2));
  assert.equal(result.change.name, 'add-value');
});

test('rejects command output above the previous pipe buffer limit', async () => {
  const { changeStatus, openspecBin, repositoryRoot } = await createRepository();
  await writeNodeFakeOpenSpec(openspecBin, [changeStatus], {
    oversizedList: true,
  });

  const result = discoverReviewTarget({
    cwd: repositoryRoot,
    openspecBin,
    headRef: 'HEAD',
    baseRef: 'HEAD~1',
  });

  assert.equal(result.result, 'incomplete');
  assert.equal(result.reason, 'openspec_status_failed');
  assert.match(
    result.message,
    /\/openspec list --json: stdout exceeded 1048576 bytes/,
  );
});

test('preserves Git paths that contain newlines', async () => {
  const { changeRoot, openspecBin, repositoryRoot } = await createRepository();
  const unusualPath = 'openspec/changes/add-value/line\nbreak.md';

  await writeFile(path.join(repositoryRoot, unusualPath), '# Unusual path\n');
  git(repositoryRoot, 'add', '.');
  git(repositoryRoot, 'commit', '--quiet', '-m', 'docs: add unusual path');

  const result = discoverReviewTarget({
    cwd: repositoryRoot,
    openspecBin,
    headRef: 'HEAD',
    baseRef: 'HEAD~1',
  });

  assert.equal(result.result, 'ready', JSON.stringify(result, null, 2));
  assert.deepEqual(result.changedPaths, [unusualPath]);
  assert.deepEqual(result.change.matchingPaths, [unusualPath]);
  assert.equal(result.change.changeRoot, changeRoot);
});

test('returns a no-op result when the supplied endpoints are equal', async () => {
  const { openspecBin, repositoryRoot } = await createRepository();

  const result = discoverReviewTarget({
    cwd: repositoryRoot,
    openspecBin,
    headRef: 'HEAD',
    baseRef: 'HEAD',
  });

  assert.equal(result.result, 'no_commits');
  assert.deepEqual(result.commits, []);
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
    headRef: 'HEAD',
    baseRef: 'HEAD~2',
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
    headRef: 'HEAD',
    baseRef: 'HEAD~1',
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

test('requires both endpoints even with a configured upstream', async () => {
  const { openspecBin, repositoryRoot } = await createRepository();
  git(repositoryRoot, 'branch', 'baseline', 'HEAD~1');
  git(repositoryRoot, 'branch', '--set-upstream-to=baseline');

  for (const endpoints of [{}, { baseRef: 'HEAD~1' }, { headRef: 'HEAD' }]) {
    const result = discoverReviewTarget({
      cwd: repositoryRoot,
      openspecBin,
      ...endpoints,
    });
    assert.equal(result.result, 'incomplete');
    assert.equal(result.reason, 'missing_commit_range');
  }
});

test('reviews a historical range on a detached checkout and excludes local work', async () => {
  const { openspecBin, repositoryRoot } = await createRepository();
  const base = execFileSync('git', ['rev-parse', 'HEAD~1'], {
    cwd: repositoryRoot, encoding: 'utf8',
  }).trim();
  const head = execFileSync('git', ['rev-parse', 'HEAD'], {
    cwd: repositoryRoot, encoding: 'utf8',
  }).trim();
  await writeFile(path.join(repositoryRoot, 'src/later.js'), 'export const later = true;\n');
  git(repositoryRoot, 'add', '.');
  git(repositoryRoot, 'commit', '--quiet', '-m', 'feat: add later work');
  git(repositoryRoot, 'checkout', '--quiet', '--detach');
  await writeFile(path.join(repositoryRoot, 'src/app.js'), 'uncommitted edit\n');
  await writeFile(path.join(repositoryRoot, 'staged.txt'), 'staged work\n');
  git(repositoryRoot, 'add', 'staged.txt');
  await writeFile(path.join(repositoryRoot, 'untracked.txt'), 'untracked work\n');

  const result = discoverReviewTarget({
    cwd: repositoryRoot,
    openspecBin,
    baseRef: base,
    headRef: head,
  });

  assert.equal(result.result, 'ready', JSON.stringify(result));
  assert.equal(result.base, base);
  assert.equal(result.head, head);
  assert.deepEqual(result.commits, [head]);
  assert.deepEqual(result.changedPaths, ['openspec/changes/add-value/tasks.md', 'src/app.js']);
  assert.equal(result.worktreeDirty, true);
});

test('rejects invalid revisions and non-ancestor ranges without selecting a replacement', async () => {
  const { openspecBin, repositoryRoot } = await createRepository();
  git(repositoryRoot, 'checkout', '--quiet', '-b', 'side', 'HEAD~1');
  git(repositoryRoot, 'commit', '--quiet', '--allow-empty', '-m', 'chore: diverge');

  for (const [baseRef, headRef, reason] of [
    ['missing', 'main', 'invalid_git_target'],
    ['main~1', 'missing', 'invalid_git_target'],
    ['main:src/app.js', 'main', 'invalid_git_target'],
    ['--all', 'main', 'invalid_git_target'],
    ['main', 'main~1', 'non_ancestor_range'],
    ['side', 'main', 'non_ancestor_range'],
  ]) {
    const result = discoverReviewTarget({ cwd: repositoryRoot, openspecBin, baseRef, headRef });
    assert.equal(result.result, 'incomplete');
    assert.equal(result.reason, reason, `${baseRef}..${headRef}: ${JSON.stringify(result)}`);
  }
});

test('CLI requires two endpoints and rejects the old upstream option', async () => {
  const { openspecBin, repositoryRoot } = await createRepository();
  const script = fileURLToPath(new URL('../scripts/discover-review-target.mjs', import.meta.url));
  const invoke = (...args) => spawnSync(process.execPath, [script, ...args], {
    cwd: repositoryRoot,
    encoding: 'utf8',
  });

  const missing = invoke('--base', 'HEAD~1');
  assert.equal(missing.status, 2);
  assert.equal(JSON.parse(missing.stdout).reason, 'missing_commit_range');
  for (const args of [['--upstream', 'HEAD~1'], ['--base'], ['--base', '--head', 'HEAD']]) {
    assert.equal(invoke(...args).status, 64);
  }
  const ready = invoke('--base', 'HEAD~1', '--head', 'HEAD', '--openspec', openspecBin);
  assert.equal(ready.status, 0, ready.stderr);
  assert.equal(JSON.parse(ready.stdout).result, 'ready');
});
