# Committed Review Target

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

- the current branch's configured upstream, or the user-supplied local baseline,
  and full base SHA;
- the complete `base..HEAD` commit list and changed paths for that target;
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

An explicit baseline narrows this review target only. It does not establish that
findings outside the target were fixed, disproved, or handed off into tracked
remediation; preserve those findings according to the report contract.

## Results

- `ready`: use the exact base, head, commits, reviewable paths, selected change,
  paths outside its change root, and excluded paths.
- `no_outgoing_commits`: nothing committed is waiting for push.
- `no_reviewable_changes`: outgoing commits change only excluded review reports.
- `incomplete`: stop target discovery and report its `reason`. Request only the
  specific missing baseline, intentional change association, or OpenSpec repair
  it identifies. Two reasons need particular care:
  - `diverged_upstream`: the branch is both ahead and behind; it is not a normal
    push target.
  - `multiple_change_matches`: require a branch, checkout, or user-specified
    baseline whose target range contains one change. An explicit change name
    cannot hide another touched change.

`worktreeDirty` is disclosure only. Never add those paths to the committed target.

The CLI exits `0` for ready and no-op results, `2` for incomplete results, and
`64` for invalid helper arguments. Discovery results are JSON; argument errors
print usage and an error message instead. No-op results do not clear findings or
justify rewriting an existing report.

## Read the Recorded Snapshot

Discovery fixes the review's identity. After discovery, use its full `base` and
`head` IDs rather than ref names in every evidence command. From the repository
root, for example:

```sh
git --literal-pathspecs diff <base> <head> -- <path>
git show '<head>:<path>'
git show '<base>:<path>'
```

Read current content at the recorded head and previous or deleted content at the
base. Quote each argument and pass paths individually; literal pathspecs prevent
characters in filenames from changing the requested boundary. Apply the same
rule to unchanged callers, configuration, tests, and versioned planning sources.
An unchanged committed file can still have an uncommitted worktree edit.

OpenSpec status and instruction output locate artifacts and describe the current
workflow. They do not establish which artifact bytes were committed. If a
versioned planning file is dirty, use its committed content as review evidence
and disclose the difference. If only an uncommitted artifact supplies essential
intent, mark the dependent review incomplete. For unversioned external context,
identify its source and limit any conclusion that depends on uncertain currency.

The existing review report is the exception: read its current contents as review
state, even when it is uncommitted or excluded from the diff. Do this only in the
coordinator context after the independent passes return or are unavailable.

## Verification Must Match the Snapshot

Run project checks in an isolated checkout or disposable copy at the recorded
head when the worktree contains changes that could affect them. Keep generated
test and build files there; the audit's only authored repository change is the
review report. Do not stash, reset, or overwrite the user's work to obtain a
clean tree. Use local or fake services for checks that would otherwise change
external state.

A worktree test run may be useful, but it is not proof about the reviewed head
unless all inputs match that snapshot. Record commands, results, execution
location, and the revision tested. Mark required verification incomplete when
the environment or relevant inputs cannot be established.

`openspec validate` is structural evidence for the artifacts it actually reads.
If those are dirty worktree artifacts, disclose that boundary rather than
attributing the result to the committed planning snapshot.
