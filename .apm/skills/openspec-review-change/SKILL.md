---
name: openspec-review-change
description: Audits and iteratively strengthens planning artifacts for an active OpenSpec change, preserving unresolved findings and human-accepted residual risks across broad re-audits. Use before implementation, after material planning revisions, or to resolve review findings; not for implementation review, code verification, or a narrow correction traced from code.
---

# OpenSpec Review Change

Review whether an OpenSpec change gives an implementer a coherent, verifiable
plan without leaving consequential requirements or decisions to guesswork.
Check both what the artifacts promise and what the affected system actually
requires. Keep unresolved findings and applicable human-accepted residual risks
in a concise current assessment at `<change-root>/review.md`.

The report is working review evidence. It is not an OpenSpec schema artifact, an
approval record, permission to run Apply, or authority to accept risk.

## Boundaries

- Review one active change at a time.
- During an audit, write only `<change-root>/review.md`. Finish the requested
  audit before addressing its findings so an early fix does not bias the rest
  of the review.
- When the user asks to address findings, use `openspec-update-change` for
  planning-artifact revisions and then re-audit the result. Never modify
  implementation code, invoke Apply, check off implementation tasks, or archive
  the change.
- Surface unsettled product, contract, architecture, data, security, privacy, or
  infrastructure-cost choices as findings. Ask when a requested resolution
  depends on such a choice; use decisions already supplied by the human or
  authoritative project artifacts without asking for approval again.
- Do not describe the change as approved, ready to Apply, or safe to continue.
  The human owns that decision after the review.

## Routing

Use this skill for a broad review of planning artifacts in one active change:
before Apply, after material replanning, or to coordinate resolution and re-audit
of its own findings. Treat "re-audit the change" as a broad review; "check the
fix" asks for a review of the remediation and its effects.

Use `openspec-update-change` directly for a narrow planning-artifact edit that
does not need a broad review.

Use `openspec-review-implementation` for committed implementation and pre-push
review. A narrow planning correction traced from an implementation finding stays
there. Return here only when intent, capability boundaries, or requirements
changed enough to warrant a broad planning re-audit.

## Resolve the Change and Its Evidence

1. Use the change named by the user. If none is named, inspect active changes and
   select the only plausible one; ask when several remain plausible.
2. Resolve the actual artifact graph from the change metadata and OpenSpec schema.
   Include custom artifacts such as ADRs instead of assuming only proposal,
   specs, design, and tasks.
3. Read repository instructions, every existing change artifact, relevant
   canonical specs and prior decisions, and any existing `review.md` completely.
4. Inspect affected code, callers, interfaces, data, configuration, tests, and
   deployment paths far enough to verify the change's claimed boundary and
   discover omitted impact.
5. Run `openspec validate <change>` when available. Separate artifact validation
   errors from an unavailable or failing tool. Record the outcome and any
   resulting review limitation; success does not establish semantic completeness.

Distinguish required artifacts from those legitimately omitted, skipped, or not
yet due. Review available evidence, disclose material gaps in coverage, and name
the continuation needed for missing artifacts. Do not create them during an audit.

## Review Breadth Before Depth

Use these five roles to understand the plan. They describe responsibilities of
information, not required filenames; one artifact may serve several roles.

| Role | Review question |
|---|---|
| Intent | What problem, outcome, scope, and non-goals justify the change? |
| Behavioral contract | What observable outcomes are promised, including relevant errors and permissions, and which capability owns each promise? |
| Decisions | Which consequential choices and constraints determine how the promises will be met? |
| Work | Does the planned work cover those promises and choices in an executable order? |
| Verification | What observable evidence will show that the promised outcomes hold? |

Trace commitments forward into work and verification, and work backward to its
justification. Check agreement across the actual schema graph and verify that
any omitted role is justified.

For example, if intent promises that cancelling an export stops delivery, check
that a contract defines cancellation, decisions handle an in-flight worker, work
covers that path, and verification observes that no delivery follows. A task to
"add a cancel button" does not by itself cover the promise.

Read the core guidance and scan the activation map in
[references/review-lenses.md](references/review-lenses.md). Build the change
surface before pursuing one finding deeply, following affected behavior, callers,
state, integrations, failure paths, and deployment. Read conditional guidance for
areas implicated by this evidence, including impacts omitted from the proposal.
Stop expanding when relevant consumers, contracts, and failure consequences are
accounted for. Unrelated existing defects are outside the review unless the change
relies on them; non-applicable lenses need no write-up.

## Record Material Findings

Check whether other artifacts or repository evidence already answer a concern.
Report a specific gap or contradiction with a plausible consequence and an
observable required outcome. Distinguish observed facts from inferred consequences.

Use one finding per root cause, with evidence, impact, severity, and a required
change. Add a focused human question only for an unsettled consequential choice.
The review-lenses reference provides severity calibration and examples.

Do not report cosmetic preferences, demand sections whose information is already
clear elsewhere, or prescribe an implementation when several valid designs
remain. Leave ordinary implementation details to the implementer. A finding must
explain more than "consider adding tests" or "think about monitoring."

## Write the Current Review

Read [references/review-format.md](references/review-format.md) before creating or
restructuring `review.md`.

Keep the report current using that reference's retention, identifier, and result
rules. Remove resolved findings, preserve applicable accepted risks, and distinguish
an incomplete review from one with no unresolved findings. Omit review history,
duplicate summaries, and empty sections.

A broad re-audit repeats the breadth review and re-tests every existing finding.
Review independently of prior acceptance, then reconcile accepted risks with the
current evidence. An old finding's absence from fresh output does not resolve it.

## Address Findings When Asked

For requests such as `fix F2` or `address F1 and F3`, resolve each requested ID
from the current `review.md`. Do not guess a missing ID or remediate unselected
findings. Recheck the selected findings and obtain only decisions still needed
to address them. Give the change identity, finding IDs, evidence, impact, required
outcomes, and settled decisions to `openspec-update-change`; do not edit planning
artifacts directly under this skill. If that workflow is unavailable, keep the
findings open and report the missing dependency without making planning writes.

Afterward, inspect the changed artifacts and review affected behavior, coherence,
work, verification, and risk areas. Repeat the broad audit when requested or when
edits materially change intent, capability boundaries, or requirements. Otherwise,
limit the follow-up to the remediation's effects.

Rewrite `review.md` from the evidence. Preserve unselected findings and risks
unless that evidence changes their status; record new problems without expanding
remediation. A vague task cannot resolve an upstream requirement or decision gap.

## Accept Residual Risk When Asked

For `accept F2 as residual risk`, resolve F2 and follow the acceptance procedure in
the report-format reference. Recheck its evidence and use the human's explicit
decision; ask for missing consequential terms rather than inventing consent.
Complete required artifact reconciliation before closing the finding, then review
any changed artifacts. If the condition is disproved, remove the finding without
creating an accepted risk.

Acceptance closes review state while the risk remains. Limit it to selected
findings, create no remediation the human deliberately declined, and name the
accepted risk in the handoff.

## Handoff

Report the result, highest-impact findings or their absence, accepted risks,
artifacts changed, decisions still needed, validation limits, and `review.md` path.

## Verification

Before reporting a clean review, confirm that:

- the actual artifact graph, capability boundaries, relevant repository context,
  and activated risk areas were reviewed, with omitted roles justified;
- commitments trace through applicable roles to planned work and verification;
- findings and accepted risks meet the report contract and reflect current evidence;
- validation results and material coverage limitations are explicit; and
- only authorized artifacts changed, with no implementation, Apply-state change,
  or implied approval to proceed.

When changing this skill, evaluate the realistic routing and workflow cases in
[references/evaluation-cases.md](references/evaluation-cases.md).
