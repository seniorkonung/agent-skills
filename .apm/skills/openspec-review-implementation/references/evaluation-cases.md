# Evaluation Cases

Use these cases when changing the skill's routing, target discovery, review
ordering, report format, or remediation behavior. Compare the candidate skill
with the repository's previous committed version. Review observable decisions,
writes, report quality, unnecessary work, and disclosed limitations rather than
matching exact phrases.

## Claims Under Test

The skill should:

- review the complete committed range ahead of upstream without including the
  worktree;
- select one active OpenSpec change from changed-path evidence;
- preserve an independent decision pass before opening full planning rationale;
- cover decision quality, OpenSpec conformance, and ordinary code quality;
- produce concise findings that identify the earliest source of truth; and
- keep remediation and schema-aware task updates unambiguous.

## Case 1: Normal Pre-Push Review

**Prompt**

> Implementation is committed. Review everything that will be pushed and record
> anything I need to fix.

**Fixture**

- The branch tracks `origin/feature` and is three commits ahead, zero behind.
- The range changes production code, tests, and one active change's tracked task
  artifact.
- The worktree also contains an unrelated uncommitted note.

**Expected behavior**

- Resolve exactly `origin/feature..HEAD` and disclose local tracking freshness.
- Select the one change touched by the range.
- Exclude the uncommitted note.
- Run decision, conformance, and code-quality passes in that order.
- Write only the selected change's `implementation-review.md`.
- Consolidate duplicate symptoms into root-cause findings with evidence, impact,
  required outcome, earliest source, affected artifacts, and disposition.

## Case 2: Two Changes in One Outgoing Range

**Prompt**

> Review my branch before I push. Do not ask unnecessary questions.

**Fixture**

- The outgoing range changes tracking artifacts under two active change roots.

**Expected behavior**

- Return an incomplete result naming both candidates.
- Do not choose the most recently modified or alphabetically first change.
- Do not write either report until the caller isolates one change target.
- Require a branch or checkout with a non-overlapping outgoing range; an explicit
  change name must not hide the other touched change.

## Case 3: Re-Audit After Corrective Commits

**Prompt**

> I committed fixes for every open finding. Re-review before push.

**Fixture**

- The upstream has not moved.
- Corrective commits change code and tests but the original task update remains in
  the full outgoing range.
- An earlier `implementation-review.md` contains open findings.

**Expected behavior**

- Review the new complete `upstream..HEAD` range, not only corrective commits.
- Use a fresh isolated decision reviewer with no earlier findings.
- Rewrite the report to current truth and remove findings only when the complete
  evidence supports removal.
- Do not retain an old-target ledger or remediation history.

## Case 4: Planning-Only Near Miss

**Prompt**

> I edited the proposal and tasks but have not implemented anything. Review it.

**Fixture**

- Outgoing commits contain only files under the selected change root.

**Expected behavior**

- Route to `openspec-review-change`.
- Do not issue a clean implementation result or create implementation-review
  findings.

## Case 5: No Isolated Reviewer

**Prompt**

> Run the review here; you cannot create a fresh context.

**Fixture**

- The current context participated in implementation and read the design.

**Expected behavior**

- Complete conformance and code-quality passes when possible.
- Mark the independent decision pass and aggregate result `Incomplete`.
- Preserve concrete findings, but do not clear prior findings or claim a clean
  result from the non-isolated pass.

## Case 6: Finding Changes Requirements

**Prompt**

> Fix F2. It turns out the requirement itself describes the wrong behavior.

**Fixture**

- The correction still serves the change's original intent.
- Requirement, design, tasks, code, and tests all need synchronization.

**Expected behavior**

- Keep remediation in `openspec-review-implementation`.
- Load current instructions for every planning artifact before editing it.
- Correct the requirement first, update dependent artifacts in schema order, and
  add or reopen tracked work with concrete verification.
- Use `openspec-review-change` afterward only if the planning revision materially
  changed intent, capability boundaries, or the requirement set enough to need a
  broad re-audit.

## Case 7: Report-Only Commit

**Prompt**

> I committed the clean implementation review. Check again before push.

**Fixture**

- The only commit ahead of upstream changes
  `<change-root>/implementation-review.md`.

**Expected behavior**

- Return `no_reviewable_changes`.
- Do not treat the report as implementation or planning input.
- Do not rewrite and recommit the report in an endless loop.

## Deterministic Checks

Run:

```sh
node --test tests/discover-review-target.test.mjs
```

The tests must cover a single matched change, no outgoing commits, multiple
matched changes, explicit-change isolation, and a report-only commit. Also
validate frontmatter, relative links, generated copies, and the focused
repository diff.
