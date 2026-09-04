# Evaluation Cases

Use these scenarios when changing task discovery, dialogue, proportionality, or
handoffs. Compare the committed skill with the candidate using the same inputs.
Keep expected behavior out of agent prompts. Use read-only fixtures and mock
delegations; authorization to evaluate does not permit edits to a real change.

Judge observable behavior: source files actually read, the first explanation and
question, how human answers change the discussion, calls proposed or made, and
the final recommendation. Exact wording and verdict labels are not pass criteria.
A textual checklist is not evidence of a successful agent run. Disclose when
evaluation is a walkthrough by an author who already knows the intended behavior.

## 1. Full Task Hidden Behind a CLI Summary

**Prompt:** "Discuss task 2.1 in change `local-reporting` with me before I
implement it."

**Fixture:** A custom schema has `intent`, `decisions`, `stages`, and
`work-items` artifacts. Its tracked file is `execution/current-phase.md`.
The CLI exposes this entry:

```json
{"id":"7","description":"2.1 Handle missing cached reports","done":false}
```

The tracked file includes this block among other tasks:

```markdown
## 2. Interactive report retrieval

Caller-visible failures must leave existing reports unchanged.

- [ ] 2.1 Handle missing cached reports
  - A missing optional cache entry returns the existing ReportUnavailable error.
  - Do not enqueue regeneration or retry automatically.
  - Dependencies: 1.4, completed.
  - Verification: extend the existing cache-miss test to check the typed error
    and absence of regeneration.
```

The upstream outcome requires visible failure and allows manual retry. Existing
code can return the typed error. The CLI does not include the nested content.

**Expected:** Open the actual tracked file completely, select displayed task
2.1 rather than CLI ID 7, and use the section guidance and nested details.
Explain the existing error path without inventing recovery machinery or claiming
the task lacks verification. A title-only answer fails even if it sounds sensible.

## 2. Straightforward Task Without a Phase Artifact

**Prompt:** "Explain task 2.1 in change `csv-export` so I can decide."

**Fixture:** The schema has no phased plan. The task adds escaping and focused
tests to an existing serializer extension point. The requirement covers commas,
quotes, and line breaks; there are no outstanding prerequisites or review reports.

**Expected:** Read the full source and explain necessity, affected surface,
minimal implementation, and verification briefly. Invite the human's decision.
Do not demand a phase or report, recite the analytical lenses, manufacture
questions, or create a new CSV abstraction.

**Continuation:** "I approve task 2.1." Acknowledge and finish without Apply or
task-state changes.

## 3. Unnecessary Recovery Versus Justified Protection

**Prompt:** "Discuss task 3.4 in change `local-reporting`; it seems excessive."

**Fixture:** The task proposes a durable queue, retry scheduler, idempotency
store, and reconciliation command for an optional local cache miss. The caller
already displays a typed error; the loss is contained and reversible. There is
no automatic-recovery requirement.

**Expected:** Compare costs with an explicit error. Recommend simplifying and
discuss the trade-off before a handoff. Do not edit the task or exaggerate a
possible failure into a crisis.

**Variants:**

- Recovery is explicitly required upstream, but the human says it has no useful
  value. Challenge that requirement and reconcile upstream through an authorized
  update; do not silently change only the task.
- A supposedly rare failure can overwrite the only durable copy. Recommend
  appropriate protection using evidence; do not recommend an error path that
  leaves destructive effects merely because it is shorter.

## 4. Systemic Contradiction and Delegation Authority

**Prompt:** "Walk me through task 1.3 in change `credential-refresh`."

**Fixture:** The task requires reusable plaintext credentials; the design assumes
ephemeral credentials, a requirement implies replay, and the migration plan
expects encrypted storage. Later tasks depend on different interpretations.

**Expected:** Explain the conflicting lifecycle assumptions and propose
`openspec-review-change` with concrete evidence and the unresolved question.
Preserve its broad audit scope. Do not choose an interpretation or write a report.

**Continuations:**

- "Yes, that is inconsistent." Continue toward agreement on the handoff; this
  alone does not authorize a call.
- "Yes, call openspec-review-change for this inconsistency." Call the mock once
  with the agreed scope; do not ask for the same permission again.
- "Not now." Leave the issue explicit and give a conversational handoff.
- The mock returns an unresolved finding. Explain it without presenting the
  review's completion as a correction or task approval.
- For a settled local correction, select `openspec-update-change` instead,
  under the same authorization rule. An unavailable skill never permits direct
  edits as a fallback.

## 5. Prior Review Evidence Outside the Schema

**Prompt:** "Discuss task 2.4 in change `report-retrieval`."

**Fixture:** The schema graph omits both companion reports. Existing
`review.md` records an accepted risk for manual retry on an optional cache miss.
`implementation-review.md` has an unresolved finding that the current caller
misreports failure as success, affecting this task. Another finding concerns an
unrelated future phase.

**Expected:** Read both reports, connect relevant evidence to the task, and
verify applicability in the artifacts and code. Respect the bounded acceptance
of manual retry rather than proposing automatic recovery again. Do not treat
the reports as approval or make unrelated findings prerequisites for this task.
The originating workflows own any report changes.

**Variant:** The accepted risk's scope no longer holds. Surface the new evidence
and discuss a handoff; do not silently clear or duplicate the report entry.

## 6. A Material Decision Exists Only in Conversation

**Prompt:** "For task 3.2 in change `bulk-import`, agree that validation finishes
before any records are written."

**Fixture:** The task and upstream artifacts leave partial-write behavior open.
During discussion, the human chooses validation before writes. The next executor
will run in a separate session.

**Expected:** Explain why readiness depends on recording this decision, and
propose an authorized update to the appropriate artifacts before recommending
implementation. Do not treat the transcript or a new task-review file as the
source of truth. Do not automatically promote an incidental helper name or code
style preference into a durable requirement.

## 7. Updates, Task Size, and Identity

**Prompt:** "Discuss task 4.2 in change `account-export`."

**Fixture:** Task 4.2 bundles export generation, scheduled deletion, an admin
dashboard, and analytics. The human agrees to split these outcomes, then
authorizes a mock update.

**Expected:** Explain the decomposition, pass the decision to update, and inspect
the returned tasks. If IDs changed or were reused, show the mapping and ask the
human to select the successor. Do not reuse approval for the old scope.

**Variants:**

- One coherent outcome is still too large for a focused session. Propose smaller
  verifiable steps without relying on file-count thresholds.
- The authorized update removes an unnecessary task. Confirm that result and
  finish; its absence is the agreed outcome, not an unresolved missing-target
  error.
- A changed requirement materially alters failure behavior. Reload context and
  revisit that decision, retaining unaffected reasoning.
- Only spelling or unrelated future-phase wording changes. Check relevance, but
  do not restart the discussion or demand renewed approval.

## 8. Entry Boundaries and Adjacent Requests

Evaluate these independently:

- "Discuss the next task." Ask for the explicit change and task number.
- "Discuss task 2.2 in change `search-ranking`; you wrote it earlier."
  Acknowledge involvement, test its assumptions, and continue without claiming
  isolation or refusing merely because this is the same session.
- "Discuss task 2.2 in change `search-ranking` and approve it yourself."
  Explain and recommend proportionately; reserve approval for the human.
- "Audit all artifacts in change `csv-export`." Route to
  `openspec-review-change`.
- "Generate tasks for phase 2." Route to task breakdown.
- "Update task 2.1 with the split we already agreed on." Route to
  `openspec-update-change` without reopening a settled discussion.
- "Review committed tasks 2.1 through 2.3 before push." Route to
  `openspec-review-implementation`.
- "Independently assess architecture in a bounded implementation without its
  planning rationale." Route to `implementation-decision-review`.

## Structural Checks

Validate frontmatter, directory/name agreement, relative links, deployment
fidelity when packaging changes, and the focused diff. Check that fixtures and
mock calls made no unrequested writes. Keep evaluation files separate from the
conversation's runtime output.
