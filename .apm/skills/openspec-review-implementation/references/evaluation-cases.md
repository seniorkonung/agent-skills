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
- derive the implemented work increment from both the immutable diff and the
  complete change context instead of treating the whole change as delivered;
- map material outgoing paths to work items and requirements in both directions;
- understand the complete planning context before reducing it to a neutral brief;
- expose only that brief and the immutable code target to a fresh decision
  reviewer;
- give each fresh reviewer the exact base, head, and assigned unit or overlap-group
  path list from Git discovery without letting it rediscover or widen the target;
- cover decision quality, OpenSpec conformance, and ordinary code quality;
- record each substantiated finding when it is verified instead of retaining it
  until all review passes finish;
- produce concise findings that identify the earliest source of truth;
- coordinate a planning handoff without editing implementation or invoking
  Apply;
- use `openspec-update-change` for confirmed, bidirectional planning
  reconciliation and corrective task updates; and
- keep phased plans at outcome granularity while recording detailed corrective
  work in the schema's task or tracked-work artifact.

## Case 1: Normal Pre-Push Review

**Prompt**

> Implementation is committed. Review everything that will be pushed and record
> anything I need to fix.

**Fixture**

- The branch tracks `origin/feature` and is three commits ahead, zero behind.
- The active change contains ten tasks; the range changes production code, tests,
  and completion state for two tasks that serve one outcome.
- The outcome, external compatibility constraint, and selected mechanism are
  explained across proposal, spec, and design rather than in one file.
- The worktree also contains an unrelated uncommitted note.

**Expected behavior**

- Resolve exactly `origin/feature..HEAD` and disclose local tracking freshness.
- Select the one change touched by the range.
- Exclude the uncommitted note.
- Map the two tasks and their affected requirements to one coherent review unit
  using code, test, and task-diff evidence.
- Treat the other eight tasks as change context, not missing implementation.
- Read the complete planning context, distinguish the compatibility contract from
  the selected mechanism, and prepare every required intention-brief field.
- Give the fresh decision reviewer the neutral brief and immutable code target,
  including the exact base, head, and unit path list, but no planning artifacts,
  design rationale, or synthesis notes.
- Have the reviewer reconstruct only that bounded Git diff. It may inspect
  unchanged surrounding code as context, but it must not rerun discovery, inspect
  other changed paths, or report unrelated findings.
- Run decision, conformance, and code-quality passes in that order.
- Write only the selected change's `implementation-review.md`.
- Record the reviewed unit and its work-item and requirement IDs in the report.
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

- Outgoing commits contain change artifacts plus a linked planning document
  outside the selected change root, but no implementation or delivery behavior.

**Expected behavior**

- Route to `openspec-review-change`.
- Treat `pathsOutsideChangeRoot` as a location hint, not proof of implementation.
- Do not issue a clean implementation result or create implementation-review
  findings.

## Case 5: No Isolated Reviewer

**Prompt**

> Run the review here; you cannot create a fresh context.

**Fixture**

- The current context participated in implementation and read the design.

**Expected behavior**

- Complete conformance and code-quality passes when possible.
- Mark the independent decision pass `Incomplete`.
- Use `Changes needed` when another pass finds a substantive issue; otherwise use
  aggregate result `Incomplete`. Never claim a clean result from the non-isolated
  pass.
- Preserve concrete findings and do not clear prior findings from a non-isolated
  pass.

## Case 6: Finding Changes Requirements

**Prompt**

> Fix F2. It turns out the requirement itself describes the wrong behavior.

**Fixture**

- The correction still serves the change's original intent.
- Requirement, design, tasks, code, and tests all need synchronization.

**Expected behavior**

- Keep remediation coordination in `openspec-review-implementation`: select F2,
  confirm its severity, dependencies, and earliest source, prepare the bounded
  plan, and obtain any consequential decision.
- Invoke `openspec-update-change` with the change name, F2, its evidence, impact,
  required outcome, settled decisions, and the expected affected artifacts. Do
  not edit a planning artifact directly under the review skill.
- Require the update workflow to refresh `openspec status`, resolve current
  artifact IDs and `existingOutputPaths`, read all related planning artifacts,
  and reconcile requirement, design, and tasks in any direction rather than
  treating dependency order as a write order.
- Show every proposed planning revision and obtain user confirmation before each
  write. The update workflow must not edit code or tests.
- Have the update workflow reopen an incorrectly completed task or add a
  corrective task for newly accepted work, with concrete acceptance criteria and
  verification evidence.
- If the schema contains a phased-planning artifact, revise it only when F2
  changes a phase outcome, boundary, direction, or readiness. Keep detailed
  corrective work in the task or tracked-work artifact rather than adding a
  checklist to the phased plan.
- Do not edit code or tests, invoke `openspec-apply-change`, commit implementation,
  or re-audit in this remediation run.
- Keep F2 in the report with disposition `Planned` only when a concrete work item
  now owns it. Hand that work item to the user for a separate later Apply.
- Remove F2 only after later implementation is committed and a complete new
  review verifies or disproves it.

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

## Case 8: Conflicting Intent Sources

**Prompt**

> Review the committed implementation. The proposal and design may not agree on
> compatibility, so do not paper over that discrepancy.

**Fixture**

- The proposal describes replacement behavior, while a canonical spec preserves
  backward compatibility and the design treats the break as intentional.
- The implementation follows the design.
- Resolving the conflict changes which solution space the reviewer should judge.

**Expected behavior**

- Read the complete artifact graph and identify the conflict before preparing the
  intention brief.
- Do not adopt the implementation-compatible interpretation or promote the design
  choice into an external constraint.
- Ask the human for the smallest consequential decision needed to resolve the
  conflict.
- If it remains unresolved, mark the independent pass `Incomplete` while
  continuing conformance and code-quality review where useful. Use aggregate
  `Changes needed` if another pass finds a substantive issue; otherwise use
  `Incomplete`.
- Do not expose the planning artifacts or preferred implementation to the fresh
  reviewer.

## Case 9: Distinct Work Units in One Change

**Prompt**

> Review the three committed tasks from this change before push.

**Fixture**

- Two tasks implement one user-visible outcome in one subsystem.
- A third task implements a materially different operator outcome in a disjoint
  subsystem, but all three belong to the same active change.
- Variant A: their code and test paths are separable in the immutable outgoing
  diff.
- Variant B: one changed implementation path materially contributes to both
  outcomes.

**Expected behavior**

- Map all three tasks and every material outgoing implementation path.
- Group the first two tasks into one review unit and the third into another; do
  not flatten them into the active change's broad purpose.
- In variant A, prepare one mechanism-neutral brief and use one fresh decision
  reviewer per materially distinct unit. Give each reviewer only its exact path
  subset from the immutable diff; neither reviewer may inspect the other unit's
  changed paths.
- In variant B, keep the two units distinct in the increment map and report, but
  use one fresh reviewer with a combined neutral brief and the union of their
  complete path lists. Do not assign the shared path to only one unit or attempt
  hunk-level isolation.
- Apply conformance and code-quality review to the complete outgoing range and
  consolidate all findings into one current report.
- Record both units and disclose any unmatched path or uncertain task mapping.

## Case 10: Update Workflow Reaches a Boundary

**Prompt**

> Fix F4, including any planning correction it requires, but keep the work in
> the original change only if it still has the same intent.

**Fixture**

- Variant A: the required artifact or glob output does not yet exist.
- Variant B: the proposed correction introduces materially new intent.
- Variant C: an accepted planning revision implies code changes.

**Expected behavior**

- Stop when an artifact or glob output does not yet exist, name the separate
  planning action required to create it, and do not invoke a continuation
  workflow under this skill.
- Recommend a separate change when the correction introduces materially new
  intent rather than silently broadening the selected change.
- Record required code work in an existing task or tracked-work artifact through
  Update, then hand it to the user. Neither Update nor this coordinator edits code
  or invokes Apply.

## Case 11: Standard Update Skill Is Missing

**Prompt**

> Fix F3 now. The requirement and task both need changes, but this repository
> does not contain `openspec-update-change`.

**Expected behavior**

- Report an incomplete or incorrect OpenSpec workflow installation.
- Tell the user to run terminal `openspec update` to regenerate the standard
  workflows.
- Stop before planning-artifact writes. Do not silently fall back to direct
  editing, even if the proposed correction looks mechanical.

## Case 12: Reviewer Cannot Widen Its Unit

**Prompt**

> Review the committed implementation, but keep independent reviewers isolated
> to their assigned outcomes.

**Fixture**

- Git discovery records immutable base and head revisions and four reviewable
  paths.
- The orchestrator maps two paths to U1 and two paths to U2.
- U1 has an unchanged caller that is useful context, while one changed U2 path
  looks superficially related.

**Expected behavior**

- Give the U1 reviewer the repository root, recorded base and head, and only the
  two U1 paths.
- Have it reconstruct `git diff <base>..<head> -- <U1-paths>` rather than running
  target discovery or resolving the current branch state.
- Before opening the caller, have it run
  `git diff --quiet <base> <head> -- <caller>` to confirm that the path is
  unchanged. It may then use the caller as context without making it a target.
- Forbid it from inspecting the changed U2 path or reporting unrelated findings.
  If U1 cannot be reviewed coherently without that path, return `Incomplete` and
  ask the orchestrator to remap the units.
- Run the code-quality pass in the orchestrator context using
  `code-review-and-quality` only as a five-axis lens. Keep this skill's severity,
  result, and no-approval report protocol.

## Case 13: Findings Are Recorded When Substantiated

**Prompt**

> Review the committed implementation and keep the report limited to conclusions
> you can support with repository evidence.

**Fixture**

- The independent decision pass returns two substantiated engineering problems
  and one suspicion that lacks concrete impact.
- The conformance pass later finds another symptom of the first problem.
- The code-quality pass supplies repository evidence that disproves the second
  problem.

**Expected behavior**

- Verify each engineering problem's evidence, impact, required outcome, and
  earliest source, then write the supported findings to
  `implementation-review.md` without waiting for the remaining passes to finish.
- Do not create or rewrite the report merely because a pass completed, and do
  not record the unsupported suspicion, private notes, or reviewer transcript.
- When the conformance pass finds the same root cause, update the first finding
  instead of adding a duplicate.
- Remove the second finding when the later evidence disproves it so the report
  continues to state only the current supported conclusion.
- If all three passes complete without a substantive finding, write the clean
  report only when finalizing the review.

## Deterministic Checks

Run:

```sh
node --test tests/discover-review-target.test.mjs
```

The tests must cover a single matched change, discovery through list plus
per-change status, no outgoing commits, multiple matched changes, explicit-change
isolation, the location-only `pathsOutsideChangeRoot` field, unusual Git paths,
and a report-only commit. Also validate frontmatter, relative links, generated
copies, and the focused repository diff. Behavioral evaluation must cover exact
reviewer path boundaries, including overlapping unit paths, result precedence,
planning handoff, phased-plan versus task granularity, the prohibition on code
and Apply, the update workflow's boundary handoffs, and the missing-skill failure.
