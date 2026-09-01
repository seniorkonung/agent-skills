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
- active changes from `openspec status --all --json`; and
- the one change whose reported `changeRoot` contains a changed path.

It excludes every active change's `implementation-review.md` from reviewable
paths. This allows review evidence to be committed without triggering an endless
report-only re-review loop.

The helper identifies the Git target and active change, not the tasks or
requirements implemented by that target. Resolve that semantic work increment
from the immutable diff and the complete change context during review; do not
infer it from changed filenames alone.

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
  implementation paths, and excluded paths.
- `no_outgoing_commits`: nothing committed is waiting for push.
- `no_reviewable_changes`: outgoing commits change only excluded review reports.
- `incomplete`: stop and report its reason. Request only the missing baseline or
  intentional change association.
- `diverged_upstream`: stop because the branch is both ahead and behind; it is not
  a normal push target.
- `multiple_change_matches`: stop and require a branch or checkout whose outgoing
  range contains one change. An explicit change name cannot make a mixed range
  safe.

`worktreeDirty` is disclosure only. Never add those paths to the committed target.

The CLI exits `0` for ready and no-op results, `2` for incomplete results, and
`64` for invalid helper arguments. It always emits resolved results as JSON.
