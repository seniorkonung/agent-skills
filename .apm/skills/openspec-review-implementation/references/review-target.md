# Pre-Push Review Target

Use the bundled helper to resolve which committed bytes and OpenSpec change the
review owns:

```sh
node "<skill-root>/scripts/discover-review-target.mjs"
```

## Contract

The helper requires Git, Node.js, and the `openspec` CLI. It is read-only: it
does not fetch, write repository files, or include staged, unstaged, or untracked
work.

It resolves:

- the current branch's configured upstream and full base SHA;
- the full `upstream..HEAD` commit list and changed paths;
- ahead and behind counts;
- active change names from `openspec list --json` and current metadata from
  `openspec status --change <name> --json`; and
- the one change whose reported `changeRoot` contains a changed path.

It excludes every active change's `implementation-review.md` from reviewable
paths. This allows review evidence to be committed without triggering an endless
report-only re-review loop.

The helper identifies the Git target and active change, not which paths are
implementation. `reviewablePaths` is the authoritative changed-file inventory.
`pathsOutsideChangeRoot` reports location only. Resolve path roles, tasks,
requirements, and review units from the immutable diff and complete change
context; do not infer them from location or filenames alone.

The helper reads Git's changed-path output with NUL delimiters so newlines and
other quoted characters in a path do not change the inventory boundary.

## Overrides

- Use `--upstream <ref>` only when the user supplies a different local baseline.
- Use `--change <name>` only to associate a range that changes no artifact under
  a change root. It cannot override changed-path evidence or hide another change
  touched by the range.
- Use `--openspec <path>` for a non-default CLI executable.

The helper never checks the live remote. A configured upstream reflects the last
local tracking update; an explicit baseline is another local ref. Do not fetch
without the user's request.

## Results

- `ready`: use the exact base, head, commits, reviewable paths, selected change,
  paths outside its change root, and excluded paths.
- `no_outgoing_commits`: nothing committed is waiting for push.
- `no_reviewable_changes`: outgoing commits change only excluded review reports.
- `incomplete`: stop and report its reason. Request only the specific missing
  baseline, intentional change association, or OpenSpec repair it identifies.
- `diverged_upstream`: stop because the branch is both ahead and behind; it is not
  a normal push target.
- `multiple_change_matches`: stop and require a branch or checkout whose outgoing
  range contains one change. An explicit change name cannot make a mixed range
  safe.

`worktreeDirty` is disclosure only. Never add those paths to the committed target.

The CLI exits `0` for ready and no-op results, `2` for incomplete results, and
`64` for invalid helper arguments. It always emits resolved results as JSON.
