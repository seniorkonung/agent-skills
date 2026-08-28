---
name: openspec-review-change
description: Audits and iteratively strengthens an OpenSpec change proposal before implementation. Use when asked to review, challenge, continue reviewing, re-audit, or resolve recorded findings in an OpenSpec change before Apply; not for code review or post-implementation verification.
---

# OpenSpec Review Change

Review an OpenSpec change as one system of intent, requirements, decisions, and
implementation work. Discover its real blast radius, persist findings in the
change directory, and improve the planning artifacts over as many sessions as
needed before a human decides whether to run Apply.

The durable output is `openspec/changes/<change>/review.md`. It is a companion
review ledger, not an OpenSpec schema artifact and not an approval record.

## Boundaries

- Process one active change per invocation.
- During audit, write only `review.md`. Do not remediate artifacts until the
  breadth-first audit is complete.
- During remediation, edit only `review.md` and planning artifacts inside the
  selected change directory.
- Read implementation code, canonical specs, project documentation, and version
  history when they provide evidence; never modify implementation code.
- Never invoke Apply, implement a task, check off implementation tasks, archive
  the change, or describe the change as approved.
- Never accept or defer a finding on the human's behalf.
- Do not add `review.md` to the project's OpenSpec schema. File existence cannot
  represent review completion.

If the user asks for implementation or Apply while this skill is active, finish
the review handoff and state that Apply requires a separate explicit human action.
Do not treat review completion as that action.

## Routing

Use this skill for requests such as:

- "Review `add-billing-retries` before Apply and record every problem."
- "Continue the OpenSpec review and resolve the next findings."
- "The design changed; re-audit the change before implementation."

Route adjacent work elsewhere:

- A syntax or structure check alone belongs to `openspec validate`.
- A narrow user-requested artifact revision or coherence-only pass belongs to
  `openspec-update-change` when available.
- Verifying completed code against a change belongs to
  `openspec-verify-change`.
- Reviewing a pull request or implementation belongs to code review.
- Creating missing planning artifacts belongs to the OpenSpec new/continue
  workflow.

This skill may record structural, coherence, or missing-artifact problems as part
of a full pre-Apply review. The exclusions above prevent a narrow adjacent request
from triggering the larger workflow unnecessarily.

## Load the Review Contracts

Read [references/review-ledger.md](references/review-ledger.md) completely before
creating, resuming, or restructuring `review.md`.

Read [references/review-lenses.md](references/review-lenses.md) completely before
creating or refreshing the coverage map. Revisit the relevant lens section during
deep audit or remediation rather than loading unrelated specialist guidance.

Project instructions and the resolved OpenSpec schema remain authoritative for
the target repository. The references define review behavior, not the target
system's architecture.

## Resolve the Target and Artifact Graph

1. Use an explicit change name or path from the user when provided.
2. Otherwise, prefer `openspec status --all --json` to discover active changes.
   A filesystem listing under `openspec/changes/` is the fallback.
3. If exactly one active change exists, select it. If several remain plausible,
   ask the user; do not batch them or guess from an old conversation.
4. Prefer `openspec status --change <name> --json`, the change's
   `.openspec.yaml`, and the resolved schema to identify artifact IDs, paths,
   dependencies, optional artifacts, and skipped artifacts.
5. Use `openspec schema which <schema> --json` when available to distinguish a
   project schema from a user or package schema. Fall back to the actual change
   contents and metadata when the CLI or command is unavailable.
6. Discover custom artifacts such as ADRs from the schema and change directory.
   Never assume the default proposal/specs/design/tasks set is complete.
7. Exclude `review.md` from the schema artifact graph while including it in
   session freshness checks.

If a required artifact is missing or incomplete, create or update the ledger,
record the blocker, and leave dependent coverage pending. Do not create the
missing artifact inside the audit; name the appropriate OpenSpec continuation as
the next action.

## Establish the Evidence Baseline

Before judging artifact quality:

1. Read applicable repository instructions and OpenSpec project configuration.
2. Read every discovered change artifact completely.
3. Read relevant canonical specs, domain glossaries, prior ADRs, and operational
   guidance.
4. Inspect the code, database schema, configuration, interfaces, callers, tests,
   and deployment mechanisms implied by the change.
5. Run `openspec validate <change>` when available. Record the result and its
   limits: structural validity is not semantic completeness.
6. Record a deterministic content fingerprint for each reviewed input as defined
   in the ledger contract.

When the CLI is unavailable, continue with read-only filesystem inspection and
record the untested validation boundary. Do not imply that structural validation
passed.

## Start or Resume From the Ledger

### No ledger exists

Create `review.md` using the ledger contract. Set the review state to `auditing`,
write the initial blast-radius and risk summary, inventory reviewed inputs, and
initialize coverage for all core and conditional lenses.

### A ledger exists

Read it completely before doing new review work. Recompute fingerprints and
discover added, removed, or renamed artifacts before trusting its state.

- If inputs changed, mark the inputs and affected lenses stale and return to
  `auditing`.
- If the state is `auditing`, resume the highest-risk unfinished lens without
  restarting completed current work.
- If the state is `remediating`, continue the highest-severity unblocked finding
  whose dependencies are settled.
- If the state is `blocked-on-human`, incorporate a new human decision when one
  was supplied; otherwise continue only independent safe work.
- If the state is `ready-for-human-decision`, perform freshness checks before
  repeating that assessment. Any material input change reopens audit.

An explicit re-audit request refreshes the evidence baseline and reopens every
lens plausibly affected by the stated or discovered changes. Preserve stable
finding IDs and prior human decisions unless the changed evidence invalidates
them.

## Phase 1: Complete a Breadth-First Audit

Build the blast-radius map before deep review. Connect user-visible behavior,
modules, interfaces, data, configuration, integrations, runtime paths,
deployment, and operators. Use repository evidence, not the proposal's claims
alone.

For every lens in the lens reference:

1. Record `applicable` with concrete activation evidence, or `not-applicable`
   with a concise repository-grounded reason.
2. Review applicable lenses against all relevant artifacts and code.
3. Record every known problem immediately with a stable finding ID, severity,
   evidence, concrete impact, affected artifacts, and required outcome.
4. Update the ledger at each completed lens or new finding so another session can
   resume without reconstructing the work.
5. Keep remediation ideas inside the finding only when they clarify feasibility;
   do not edit planning artifacts yet.

Finish coverage breadth-first even when audit spans many sessions. Do not fix an
obvious early issue while later lenses remain pending: an architectural, product,
or migration finding may change the correct remediation order.

### Optional independent reviewers

When delegation is available, useful, and authorized, assign independent
read-only reviewers one bounded lens or subsystem each. Give them the change
path, relevant artifacts, review question, and required evidence format.

- Reviewers return candidate findings and applicability evidence only.
- Reviewers do not edit files or accept risk.
- The coordinator verifies their evidence, deduplicates findings, assigns IDs,
  and remains the sole writer of the ledger and artifacts.
- Sequential review is the complete fallback; lack of delegation is not a
  blocker.

Move to `remediating` only after every known lens is current and either `reviewed`
or `not-applicable`. If there are no findings, evaluate the readiness rules
directly.

## Phase 2: Remediate Findings

Resolve findings by severity and dependency, not document order. Prefer the
finding that removes the most uncertainty or unblocks the most downstream work.

For each finding:

1. Reconfirm that its evidence is current.
2. Research repository behavior and authoritative external sources as needed.
3. Ask the human before choosing or changing:
   - product meaning, success criteria, or scope;
   - public contracts or compatibility policy;
   - architecture or responsibility ownership;
   - data model, migration, retention, or destructive-data strategy;
   - security or privacy posture;
   - material infrastructure, dependency, or operational cost;
   - acceptance or deferral of residual risk.
4. Record the question and why the answer changes the plan. Set the finding to
   `blocked-on-human`, but continue unrelated safe work when possible.
5. Once decisions are settled, edit artifacts in dependency order. Correct the
   earliest source of truth first, then synchronize every dependent artifact and
   task.
6. Re-run relevant structural checks, refresh fingerprints, and re-audit the
   affected coherence, task, and specialist lenses.
7. Mark the finding `resolved` only when fresh evidence proves its required
   outcome. Summarize the evidence in the ledger.

Do not solve a design gap only by adding a vague task. Do not let tasks become the
source of requirements or decisions. Do not silently broaden the approved change
to make a finding disappear.

When the human explicitly accepts or defers a finding, record the decision date,
rationale, residual risk, and any follow-up owner or destination they supplied.
Never manufacture those details.

## Readiness and Handoff

Apply the exact transition rules in the ledger contract. The terminal review
state is `ready-for-human-decision`, never `approved` or `ready-to-apply`.

Before yielding a review session:

- persist every completed lens, finding, decision, artifact edit, resolution,
  and stale input;
- keep `Current Assessment`, summary counts, detailed findings, and `Next Action`
  synchronized;
- run `openspec validate <change>` when the CLI is available and artifacts changed;
- report the review state, coverage progress, finding counts by severity and
  status, artifacts changed, decisions needed, and the one next action;
- provide the ledger path;
- remind the user that only they may decide to run Apply, without inviting or
  initiating it.

## Common Failure Modes

| Shortcut | Why it fails |
|---|---|
| "OpenSpec validation passed, so the change is ready." | Structural validity does not prove correct scope, behavior, architecture, operations, or tasks. |
| "The proposal does not mention a database, so the data lens is irrelevant." | Missing impact may be the defect; inspect actual data flow and code. |
| "I will fix findings as I discover them." | Early edits can be invalidated by higher-leverage findings from later lenses. |
| "This low-severity risk is safe to accept." | Only the human owns risk acceptance and deferral. |
| "I updated tasks, so the gap is resolved." | Requirements and decisions must be corrected at their owning upstream artifact first. |
| "The previous session reviewed this file." | A review conclusion is valid only for the recorded content fingerprint. |
| "The review is green, so I can start Apply." | This skill never has Apply authority. |

## Verification

Before claiming `ready-for-human-decision`, confirm:

- [ ] The target and actual schema artifact graph were resolved without
      hardcoding the default workflow.
- [ ] Project instructions, every change artifact, relevant canonical truth, and
      affected code were inspected.
- [ ] OpenSpec validation passed, or the untested/failed boundary remains visible
      as a handled finding.
- [ ] Every core and conditional lens has evidence-backed current coverage.
- [ ] Breadth-first audit completed before any remediation edit.
- [ ] Every finding has a stable ID, calibrated severity, specific evidence,
      impact, affected artifacts, and required outcome.
- [ ] Consequential choices and every acceptance or deferral came from the human.
- [ ] Remediation updated the earliest source of truth and all affected downstream
      artifacts.
- [ ] Fingerprints and stale coverage were refreshed after the final edits.
- [ ] No implementation code, Apply state, task completion checkbox, archive, or
      schema was changed.
- [ ] The ledger is current and compact rather than a session transcript.
- [ ] The final state is described as awaiting human decision, not approval.
