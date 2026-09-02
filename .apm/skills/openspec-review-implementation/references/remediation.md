# Planning Handoff for Implementation Findings

Use this workflow only when the user asks to address selected findings. Its job
is to make the current OpenSpec planning artifacts accurately describe the
remaining work. It does not implement that work.

## Hard Boundary

- Never edit implementation code or tests.
- Never invoke Apply or another implementation workflow.
- Never commit implementation, claim a finding is fixed, or re-audit in the same
  remediation run.
- Edit existing planning artifacts only through `openspec-update-change`.
- Keep unselected findings and unrelated cleanup out of scope.

## Prepare the Handoff

For each selected finding:

1. Recheck its evidence, severity, dependencies, required outcome, and earliest
   source of truth.
2. Obtain any consequential human decision needed to define the correct outcome.
3. Decide which of these states applies:
   - planning is wrong or incomplete and must be reconciled;
   - planning is correct, but no existing work item covers the required outcome;
   - planning and tracked work already cover the finding, so no planning edit is
     needed; or
   - the finding introduces materially different intent and belongs in a separate
     change.

When an existing planning artifact needs revision, invoke
`openspec-update-change` with the change name, finding ID, evidence, impact,
required outcome, settled decisions, and the expected affected artifact roles.
Treat that artifact estimate as a starting point, not a resolved schema graph.
The update workflow owns current status discovery, concrete paths, coherence,
confirmation, and writes.

If `openspec-update-change` is unavailable, stop before any planning write and
report that the standard OpenSpec workflows need to be restored, for example by
running terminal `openspec update`. Do not fall back to direct editing.

## Keep Plans and Tasks Distinct

Use the artifact roles exposed by the active schema rather than hard-coded
filenames.

- A phased-planning artifact contains ordered outcome transitions. Revise an
  unfinished phase only when the finding changes that phase's outcome, boundary,
  direction, or readiness. Have the update workflow follow `phased-planning` for
  that revision. Do not add checkboxes, file-level actions, acceptance criteria,
  or implementation steps to a phased plan. Preserve completed phases unless the
  human explicitly decides how to handle a conflict with completed work.
- A task or tracked-work artifact contains implementable corrective work. Reopen
  an item when its claimed outcome was never delivered, or add a new item when a
  newly accepted planning correction creates work. Give it concrete acceptance
  criteria and verification evidence.

Do not hide a requirement or design gap in a vague task, and do not turn a
phase-level outcome into a task checklist.

If the required artifact does not exist, or a new file under a glob artifact is
needed, stop and name the separate planning action required to create it. This
skill does not invoke a continuation workflow or create the artifact itself.

## Finish With a Planning Handoff

After resolving the selected findings, including when current planning and
tracked work already provide the required ownership:

1. Run OpenSpec validation and report its result or limitation.
2. Remove a selected finding from `implementation-review.md` when its agreed
   remediation is durably captured in the appropriate sources of truth and any
   remaining implementation has a concrete tracked owner. Otherwise keep it with
   disposition `Awaiting decision`, `Open`, or `Accepted risk`.
3. Report the revised artifacts, the phase or work-item IDs that own later work,
   unresolved decisions, and the separate next action available to the user.

Implementation happens only in a later, separately invoked Apply workflow. Once
the planning handoff resolves a finding, its OpenSpec artifacts and tracked work
carry that context; do not keep a duplicate review entry as a reminder.
