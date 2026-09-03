# Resolve Implementation Findings

Use this workflow only when the user asks to address selected findings. Resolve a
selected finding either by making OpenSpec planning own later remediation or by
recording the human's explicit acceptance of the residual risk. This workflow
does not implement corrective work.

## Hard Boundary

- Never edit implementation code or tests.
- Never invoke Apply or another implementation workflow.
- Never commit implementation, claim a finding is fixed, or re-audit in the same
  remediation run.
- Edit existing planning artifacts only through `openspec-update-change`.
- Never infer risk acceptance from rarity, remediation cost, or an agent's
  recommendation; only an explicit human decision authorizes it.
- Keep unselected findings, existing accepted risks, and unrelated cleanup out of
  scope.

## Choose the Resolution Path

For each selected finding:

1. Recheck its evidence, severity, dependencies, required outcome, and earliest
   source of truth.
2. Determine whether the user wants remediation or explicitly accepts the
   residual risk. A request such as `accept F2 as residual risk` is explicit; an
   agent recommendation to accept it is not.
3. For remediation, obtain any consequential human decision needed to define the
   correct outcome, then decide which of these states applies:
   - planning is wrong or incomplete and must be reconciled;
   - planning is correct, but no existing work item covers the required outcome;
   - planning and tracked work already cover the finding, so no planning edit is
     needed; or
   - the finding introduces materially different intent and belongs in a separate
     change.

## Record an Accepted Risk

When the human explicitly accepts a selected finding's residual risk:

1. Recheck that the evidence and potential impact remain supported, and make the
   remediation cost or technical trade-off concrete. If current evidence instead
   disproves the condition, remove the finding without creating an accepted risk.
2. Bound the acceptance with explicit scope and assumptions, define observable
   reopening conditions, and identify the human decision as its acceptance
   authority.
3. Remove the `F<n>` entry from `Findings` and create a collision-free `AR<n>`
   entry under `Accepted risks` using the report contract. Record the originating
   finding for traceability; never keep both entries active.
4. If the acceptance changes a product contract, architecture, or another
   OpenSpec source of truth, reconcile that artifact through
   `openspec-update-change`. Do not edit planning solely to duplicate a
   change-scoped accepted-risk entry.
5. If the acceptance must remain authoritative after the OpenSpec change is
   archived, require its entry to reference an appropriate durable project
   decision record.

Acceptance resolves the finding in the review state, not the underlying
condition. Do not claim that the risk was fixed or disproved, create corrective
tracked work for deliberately unplanned remediation, or include `AR<n>` entries
in the active finding count. Name the accepted risk in the handoff.

## Prepare the Planning Handoff

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

After handing selected findings to planning, including when current planning and
tracked work already provide the required ownership:

1. Run OpenSpec validation and report its result or limitation.
2. Remove a selected finding from `implementation-review.md` when its agreed
   remediation is durably captured in the appropriate sources of truth and any
   remaining implementation has a concrete tracked owner. Otherwise keep it as an
   active finding and retain `Decision needed` when a human choice remains.
3. Report the revised artifacts, the phase or work-item IDs that own later work,
   unresolved decisions, and the separate next action available to the user.

Implementation happens only in a later, separately invoked Apply workflow. Once
the planning handoff resolves a finding, its OpenSpec artifacts and tracked work
carry that context; do not keep a duplicate review entry as a reminder.
