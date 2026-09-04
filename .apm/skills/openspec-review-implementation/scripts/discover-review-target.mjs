#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import {
  closeSync,
  mkdtempSync,
  openSync,
  readFileSync,
  rmSync,
  statSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const CAPTURE_LIMIT_BYTES = 1024 * 1024;
const TRACKING_REF_FRESHNESS = 'local tracking state; no fetch performed';
const EXPLICIT_REF_FRESHNESS = 'explicit local ref; no fetch performed';

function readCapturedOutput(filePath, invocation, streamName) {
  if (statSync(filePath).size > CAPTURE_LIMIT_BYTES) {
    throw new Error(
      `${invocation}: ${streamName} exceeded ${CAPTURE_LIMIT_BYTES} bytes`,
    );
  }

  return readFileSync(filePath, 'utf8');
}

function run(command, args, cwd, { trim = true } = {}) {
  const captureDir = mkdtempSync(
    path.join(tmpdir(), 'openspec-review-target-'),
  );
  const invocation = [command, ...args].join(' ');
  const stdoutPath = path.join(captureDir, 'stdout');
  const stderrPath = path.join(captureDir, 'stderr');

  try {
    let result;
    let stdoutFd;
    let stderrFd;

    try {
      stdoutFd = openSync(stdoutPath, 'wx');
      stderrFd = openSync(stderrPath, 'wx');
      result = spawnSync(command, args, {
        cwd,
        stdio: ['ignore', stdoutFd, stderrFd],
      });
    } finally {
      try {
        if (stdoutFd !== undefined) closeSync(stdoutFd);
      } finally {
        if (stderrFd !== undefined) closeSync(stderrFd);
      }
    }

    const stdout = readCapturedOutput(stdoutPath, invocation, 'stdout');
    const stderr = readCapturedOutput(stderrPath, invocation, 'stderr');

    if (result.error) {
      throw new Error(`${command}: ${result.error.message}`);
    }
    if (result.status !== 0) {
      const detail = stderr.trim() || stdout.trim() || `exit ${result.status}`;
      throw new Error(`${invocation}: ${detail}`);
    }

    return trim ? stdout.trim() : stdout;
  } finally {
    rmSync(captureDir, { recursive: true, force: true });
  }
}

function git(cwd, ...args) {
  return run('git', args, cwd);
}

function gitRaw(cwd, ...args) {
  return run('git', args, cwd, { trim: false });
}

function isInside(candidatePath, parentPath) {
  const relative = path.relative(parentPath, candidatePath);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

function normalizedChange(status, repositoryRoot, matchingPaths) {
  const changeRoot = path.resolve(repositoryRoot, status.changeRoot);

  return {
    name: status.changeName,
    schemaName: status.schemaName,
    changeRoot,
    reportPath: path.join(changeRoot, 'implementation-review.md'),
    matchingPaths,
    artifactPaths: status.artifactPaths ?? {},
    actionContext: status.actionContext ?? {},
    artifacts: status.artifacts ?? [],
  };
}

export function matchChangedPathsToChanges({
  changedPaths,
  repositoryRoot,
  statuses,
}) {
  const matches = [];

  for (const status of statuses) {
    if (!status?.changeName || !status?.changeRoot) continue;

    const changeRoot = path.resolve(repositoryRoot, status.changeRoot);
    const matchingPaths = changedPaths.filter((changedPath) =>
      isInside(path.resolve(repositoryRoot, changedPath), changeRoot),
    );

    if (matchingPaths.length > 0) {
      matches.push(normalizedChange(status, repositoryRoot, matchingPaths));
    }
  }

  return matches.sort((left, right) => left.name.localeCompare(right.name));
}

function parseJson(command, args, cwd) {
  const output = run(command, args, cwd);

  try {
    return JSON.parse(output);
  } catch (error) {
    throw new Error(`${command} returned invalid JSON: ${error.message}`);
  }
}

function listActiveChangeNames(openspecBin, repositoryRoot) {
  const result = parseJson(openspecBin, ['list', '--json'], repositoryRoot);
  const changes = Array.isArray(result) ? result : result?.changes;
  if (!Array.isArray(changes)) {
    throw new Error('OpenSpec list JSON did not contain a changes array.');
  }

  const names = changes.map((change) =>
    typeof change === 'string' ? change : change?.name,
  );
  if (names.some((name) => typeof name !== 'string' || name.length === 0)) {
    throw new Error('OpenSpec list JSON contained a change without a name.');
  }

  return [...new Set(names)].sort((left, right) => left.localeCompare(right));
}

function loadActiveChanges(openspecBin, repositoryRoot) {
  const names = listActiveChangeNames(openspecBin, repositoryRoot);
  return names.map((name) => {
    const status = parseJson(
      openspecBin,
      ['status', '--change', name, '--json'],
      repositoryRoot,
    );
    if (status?.changeName !== name || !status?.changeRoot) {
      throw new Error(`OpenSpec status JSON was invalid for change ${name}.`);
    }
    return status;
  });
}

function incomplete(reason, message, context = {}) {
  return {
    result: 'incomplete',
    reason,
    message,
    ...context,
  };
}

export function discoverReviewTarget({
  changeName,
  cwd = process.cwd(),
  openspecBin = process.env.OPENSPEC_BIN || 'openspec',
  upstreamRef,
} = {}) {
  let repositoryRoot;
  try {
    repositoryRoot = git(cwd, 'rev-parse', '--show-toplevel');
  } catch (error) {
    return incomplete('not_git_repository', error.message);
  }

  const upstreamWasExplicit = Boolean(upstreamRef);
  let upstream = upstreamRef;
  if (!upstream) {
    try {
      upstream = git(
        repositoryRoot,
        'rev-parse',
        '--abbrev-ref',
        '--symbolic-full-name',
        '@{upstream}',
      );
    } catch (error) {
      return incomplete(
        'no_upstream',
        'The current branch has no upstream tracking ref. Supply --upstream <ref>.',
        { repositoryRoot },
      );
    }
  }

  let base;
  let head;
  let behind;
  let ahead;
  try {
    base = git(repositoryRoot, 'rev-parse', `${upstream}^{commit}`);
    head = git(repositoryRoot, 'rev-parse', 'HEAD^{commit}');
    [behind, ahead] = git(
      repositoryRoot,
      'rev-list',
      '--left-right',
      '--count',
      `${upstream}...HEAD`,
    )
      .split(/\s+/)
      .map(Number);
  } catch (error) {
    return incomplete('invalid_git_target', error.message, {
      repositoryRoot,
      upstream,
    });
  }

  const common = {
    repositoryRoot,
    upstream,
    upstreamFreshness: upstreamWasExplicit
      ? EXPLICIT_REF_FRESHNESS
      : TRACKING_REF_FRESHNESS,
    base,
    head,
    behind,
    ahead,
  };

  if (ahead === 0) {
    return {
      result: 'no_outgoing_commits',
      ...common,
      commits: [],
      changedPaths: [],
      worktreeDirty: git(repositoryRoot, 'status', '--porcelain').length > 0,
    };
  }

  const commits = git(
    repositoryRoot,
    'rev-list',
    '--reverse',
    `${upstream}..HEAD`,
  ).split('\n');
  const changedOutput = gitRaw(
    repositoryRoot,
    'diff',
    '--name-only',
    '-z',
    '--diff-filter=ACDMRTUXB',
    `${upstream}..HEAD`,
  );
  const changedPaths = changedOutput
    ? changedOutput.split('\0').filter(Boolean).sort()
    : [];
  const targetContext = {
    ...common,
    commits,
    changedPaths,
    worktreeDirty: git(repositoryRoot, 'status', '--porcelain').length > 0,
  };

  if (behind > 0) {
    return incomplete(
      'diverged_upstream',
      'The branch has outgoing commits but is also behind its upstream. Reconcile the branch or supply an explicit non-diverged baseline.',
      targetContext,
    );
  }

  let statuses;
  try {
    statuses = loadActiveChanges(openspecBin, repositoryRoot);
  } catch (error) {
    return incomplete('openspec_status_failed', error.message, targetContext);
  }

  const reportPaths = new Set(
    statuses
      .filter((status) => status?.changeRoot)
      .map((status) =>
        path.resolve(
          repositoryRoot,
          status.changeRoot,
          'implementation-review.md',
        ),
      ),
  );
  const excludedPaths = changedPaths.filter((changedPath) =>
    reportPaths.has(path.resolve(repositoryRoot, changedPath)),
  );
  const reviewablePaths = changedPaths.filter(
    (changedPath) =>
      !reportPaths.has(path.resolve(repositoryRoot, changedPath)),
  );

  if (reviewablePaths.length === 0) {
    return {
      result: 'no_reviewable_changes',
      ...targetContext,
      excludedPaths,
      reviewablePaths,
    };
  }

  const matches = matchChangedPathsToChanges({
    changedPaths: reviewablePaths,
    repositoryRoot,
    statuses,
  });

  if (matches.length > 1) {
    return incomplete(
      'multiple_change_matches',
      'Outgoing commits touch more than one active OpenSpec change. Use a separate non-overlapping branch or baseline for each change.',
      { ...targetContext, candidates: matches },
    );
  }

  let change;
  if (changeName) {
    const selected = statuses.find(
      (status) => status.changeName === changeName,
    );
    if (!selected?.changeRoot) {
      return incomplete(
        'unknown_change',
        `OpenSpec status did not contain an active change named ${changeName}.`,
        { ...targetContext, candidates: matches },
      );
    }
    if (matches.length === 1 && matches[0].name !== changeName) {
      return incomplete(
        'explicit_change_conflict',
        `Outgoing paths match ${matches[0].name}, not the explicitly selected ${changeName}.`,
        { ...targetContext, candidates: matches },
      );
    }
    change =
      matches[0] ?? normalizedChange(selected, repositoryRoot, []);
  } else if (matches.length === 0) {
    return incomplete(
      'no_change_match',
      'No active OpenSpec change contains a path changed by the outgoing commits. Supply --change <name> if the association is intentional.',
      { ...targetContext, candidates: [] },
    );
  } else {
    [change] = matches;
  }

  const pathsOutsideChangeRoot = reviewablePaths.filter(
    (changedPath) =>
      !isInside(
        path.resolve(repositoryRoot, changedPath),
        change.changeRoot,
      ),
  );

  return {
    result: 'ready',
    ...targetContext,
    change,
    excludedPaths,
    reviewablePaths,
    pathsOutsideChangeRoot,
  };
}

function usage() {
  return `Usage: discover-review-target.mjs [options]

Resolve committed changes that are ahead of the current branch's upstream and
associate them with one active OpenSpec change.

Options:
  --change <name>       Associate an otherwise unmatched range with this change
  --upstream <ref>      Override the branch's configured upstream
  --openspec <path>     Override the openspec executable
  --help                Show this help

The script never fetches, writes repository files, or includes uncommitted work.
It excludes implementation-review.md so committing a report cannot trigger an
endless review loop. It prints JSON. An incomplete result exits 2; ready and no-op
results exit 0.`;
}

function parseArgs(argv) {
  const options = {};

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--help') return { help: true };

    if (['--change', '--upstream', '--openspec'].includes(argument)) {
      const value = argv[index + 1];
      if (!value) throw new Error(`${argument} requires a value`);
      index += 1;
      if (argument === '--change') options.changeName = value;
      if (argument === '--upstream') options.upstreamRef = value;
      if (argument === '--openspec') options.openspecBin = value;
      continue;
    }

    throw new Error(`Unknown argument: ${argument}`);
  }

  return options;
}

function main() {
  let options;
  try {
    options = parseArgs(process.argv.slice(2));
  } catch (error) {
    process.stderr.write(`${error.message}\n${usage()}\n`);
    process.exitCode = 64;
    return;
  }

  if (options.help) {
    process.stdout.write(`${usage()}\n`);
    return;
  }

  const result = discoverReviewTarget(options);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (result.result === 'incomplete') process.exitCode = 2;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
) {
  main();
}
