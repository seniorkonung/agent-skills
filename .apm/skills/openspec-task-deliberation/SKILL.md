---
name: openspec-task-deliberation
description: Discuss one explicitly named OpenSpec task with the human before implementation. Explain its upstream purpose, test its necessity, scope, and likely implementation, and agree on its disposition. Use for collaborative task scrutiny, not broad change audits, task generation, artifact editing, or implementation review.
---

# OpenSpec Task Deliberation

Help the human understand and decide whether one task is worth implementing and
how much engineering it warrants. Success is an informed decision, which may
include simplifying, splitting, removing, or deferring the task or revisiting the
requirements behind it. Do not argue for implementation by default.

## Scope and Authority

Require an explicit change name and task number. Ask for missing or ambiguous
input; never choose the next task. Prefer a fresh discussion session. If you
helped author the task, acknowledge that involvement and examine its assumptions
afresh without claiming independent review.

The conversation is the deliverable. Read artifacts and code, but create no
report, edit no files, mark no tasks complete, and do not invoke Apply. Only the
human approves the task. Acknowledging that approval ends this workflow before
implementation. Authorized delegation below uses the called skill's own write
boundaries.

## Read the Complete Task and Its Context

Read repository instructions and obtain current OpenSpec context:

```sh
openspec status --change "<name>" --json
openspec instructions apply --change "<name>" --json
```

These commands discover state and paths; they do not execute Apply. Apply
relevant project context, but do not follow returned instructions to implement.
Resolve the actual schema and tracked task artifact from its metadata, artifact
paths, and `contextFiles`; inspect `apply.tracks` when needed. If discovery fails,
use local metadata and files where unambiguous, and disclose remaining gaps.

Open the tracked task file directly and read it completely. CLI task entries are
an index and progress view, not the full task contract. Locate the human's task
number in the file; do not assume a CLI ID is its displayed number. Include all
nested explanations, criteria, verification, dependencies, and applicable section
or file-wide guidance. Do not infer missing details from the checkbox title.

Read the containing phase or equivalent planning boundary when present, the
plan-wide direction, and relevant upstream requirements, decisions, scenarios,
and canonical specs. Inspect affected code, callers, tests, and configuration to
ground the likely implementation. Follow dependencies and downstream effects as
needed for this task; keep later phases at planning granularity.

Also read existing `review.md` and `implementation-review.md` in the change root;
they may sit outside the schema graph. Identify findings and accepted risks that
affect this task. Treat them as evidence and recorded human choices, not approval
or unquestionable requirements. Recheck their applicability; do not reopen an
accepted trade-off without changed evidence or a human request. Their originating
review workflow owns any report changes. Do not require these reports to exist.

## Evaluate Before Asking

Use these lenses for your own analysis, not as a questionnaire:

- **Purpose:** Trace the task back to the actual problem and intended outcome. What
  fails if it is omitted? Is it needed now, redundant, or based on an upstream
  requirement that should itself change?
- **Implementation:** Explain the simplest plausible approach and what it
  touches. Distinguish external constraints, recorded design choices, task
  choices, and remaining implementer discretion. A documented mechanism is still
  open to challenge. Surface consequential choices about contracts, state,
  recovery, compatibility, or maintenance; leave ordinary coding details open.
- **Proportionality:** Compare the proposed machinery with reuse, doing nothing,
  narrowing supported behavior, or returning an explicit, contained error.
  Consider plausible impact, exposure, reversibility, and total maintenance cost.
  Identify which alternatives require changing a commitment rather than silently
  treating them as conforming implementations.
- **Size and readiness:** Assess coherence, effort, dependencies, and whether the
  verification would demonstrate the intended result. Suggest testable smaller
  steps for a task too large to reason about or implement in one focused session,
  even if its overall outcome is coherent. Crossing layers alone is not a reason
  to split it.

Support concerns with concrete evidence and distinguish facts from inference.
Do not invent likelihood estimates or inflate a merely imaginable failure into
a mandatory recovery mechanism. A rare but plausible irreversible or serious
security failure may still warrant protection. Prefer the least complex approach
that meets the agreed outcome and quality bar; avoid unrelated cleanup and a
search for global optimality.

## Discuss in Small Steps

Start with a compact explanation of the task's purpose, upstream reason, affected
surface, and likely implementation. Use a concrete example when helpful and cite
sources where they support the explanation. The human should not need to follow
every cross-reference to understand the argument.

Then raise the most consequential open question, explain your recommendation
and its trade-offs, and wait for the answer. Ask one material question at a time.
Let the human's priorities and corrections reshape the analysis; look up
discoverable facts yourself. If the explanation is unclear, reframe it rather
than testing the human's comprehension.

Scale the discussion to what remains uncertain. A straightforward task may need
only a short explanation and an invitation to approve. Stop exploring when
further questions would not change the decision; do not invent issues to prolong
the conversation. Silence or agreement with one explanation is not task approval.

## Agree on the Outcome and Follow Through

State the current recommendation and the reason: proceed, revise, split, remove,
defer, investigate a wider inconsistency, or leave a named question unresolved.
The human decides. Use ordinary language and only enough recap to make that
choice understandable.

If readiness depends on a newly agreed requirement or material implementation
boundary, it must be captured in existing OpenSpec artifacts through an update
before recommending implementation. An executor in another session cannot rely
on this conversation. Explanations and incidental coding preferences do not need
to become new commitments.

Explain a proposed handoff and obtain explicit human authorization for that
workflow and scope. Agreement on a technical choice alone is insufficient, but
do not request authorization again when it already covers the handoff.

- Use `openspec-update-change` when the correction is understood and the intended
  outcome is settled. Pass the change, task, evidence, agreed decision, and
  affected upstream and downstream artifacts.
- Use `openspec-review-change` when the root or extent is unclear, or a correction
  could invalidate the wider change. Pass the triggering evidence and unresolved
  question while preserving that skill's broad audit contract.

If delegation is unavailable or declined, explain what remains unresolved and
give a short handoff in the conversation. Do not substitute direct edits. After
delegation, discuss the result: a review finding is not a correction. Relevant
findings remain unresolved until addressed, disproved, or explicitly accepted
under the originating review's rules.

Refresh the task and affected context after updates or reported external changes.
Revisit materially changed purpose, scope, dependencies, implementation choices,
or verification and seek renewed approval; retain unaffected reasoning. Cosmetic
or unrelated edits do not require restarting the discussion. If the agreed
removal occurred, acknowledge it and finish. If splitting or renumbering changed
task identity, show the mapping and let the human select the successor before
continuing.

Broad audits belong to `openspec-review-change`, already-settled edits to
`openspec-update-change`, and task generation to a task-breakdown workflow.
For completed code, use `openspec-review-implementation`, or
`implementation-decision-review` for an isolated assessment of implemented
engineering decisions.

When maintaining this skill, use
[references/evaluation-cases.md](references/evaluation-cases.md).
