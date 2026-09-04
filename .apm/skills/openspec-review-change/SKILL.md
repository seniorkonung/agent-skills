---
name: openspec-review-change
description: Audits and iteratively strengthens planning artifacts for an active OpenSpec change, preserving unresolved findings and human-accepted residual risks across broad re-audits. Use before implementation, after material planning revisions, or to resolve review findings; not for implementation review, code verification, or a narrow correction traced from code.
---

# OpenSpec Review Change

Review an OpenSpec change as one system of intent, commitments, decisions, and
planned implementation work. Look beyond the change's declared scope, find
material gaps before implementation or before continuing after substantial
replanning, and keep unresolved findings and applicable accepted-risk decisions
in a concise current assessment at `<change-root>/review.md`.

The report is working review evidence. It is not an OpenSpec schema artifact, an
approval record, permission to run Apply, or authority to accept risk.

## Boundaries

- Review one active change at a time.
- During the initial audit, write only `<change-root>/review.md`; finish a broad
  pass before addressing findings so an early fix does not bias the remaining
  review.
- When the user asks to address findings, use `openspec-update-change` for
  planning-artifact revisions and then re-audit the result. Never modify
  implementation code, invoke Apply, check off implementation tasks, or archive
  the change.
- Read implementation code, canonical specs, project documentation, and history
  whenever they provide evidence about the proposed change.
- Ask the human before settling consequential product, contract, architecture,
  data, security, privacy, infrastructure-cost, or residual-risk decisions.
- Do not describe the change as approved, ready to Apply, or safe to continue.
  The human owns that decision after the review.

## Routing

Use this skill for a broad review of planning artifacts in one active change:
before Apply, after material replanning, or to coordinate resolution and re-audit
of its own findings.

Use `openspec-update-change` directly for a narrow planning-artifact edit that
does not need a broad review.

Use `openspec-review-implementation` for committed implementation and pre-push
review. A narrow planning correction traced from an implementation finding stays
there. Return here only when intent, capability boundaries, or requirements
changed enough to warrant a broad planning re-audit.

This review may report structural errors or missing artifacts, but it does not
create missing artifacts or implement the change.

## Resolve the Change and Its Evidence

1. Use the change named by the user. If none is named, inspect active changes and
   select the only plausible one; ask when several remain plausible.
2. Resolve the actual artifact graph from the change metadata and OpenSpec schema.
   Include custom artifacts such as ADRs instead of assuming only proposal,
   specs, design, and tasks.
3. Read repository instructions, every change artifact, and relevant canonical
   specs or prior decisions completely.
4. Inspect affected code, callers, interfaces, data, configuration, tests, and
   deployment paths far enough to verify the change's claimed boundary and
   discover omitted impact.
5. Run `openspec validate <change>` when available. Treat it as structural
   evidence, not proof of semantic completeness. State the untested boundary when
   the command is unavailable or fails.

If a required artifact is missing, record what cannot yet be reviewed and direct
the user to the appropriate OpenSpec continuation. Do not create the artifact as
part of an audit.

## Review Breadth Before Depth

Start with the five core questions:

1. Does the change define the real problem, intended outcome, scope, and
   non-goals?
2. Does every durable behavioral commitment have a coherent owner and contract,
   with any omitted or skipped behavioral-contract role justified?
3. Are observable behavior, edge cases, errors, and permissions unambiguous?
4. Do the applicable roles in the actual schema graph agree in both directions,
   without relying on conventional artifact names?
5. Could an implementer complete and verify the work without inventing missing
   commitments or decisions?

Then scan the activation map in
[references/review-lenses.md](references/review-lenses.md). Read the detailed
section for every area suggested by the change surface, including areas omitted
from the proposal but implied by the code or runtime path. Security,
observability, migrations, reliability, and rollout deserve depth when activated,
not generic boilerplate on every change.

Build the broad change surface before pursuing one finding deeply. Examine user
behavior, modules, interfaces, state, configuration, integrations, failure paths,
deployment, and operations. A small change may make most conditional lenses
irrelevant; there is no need to document every non-applicable lens.

## Write the Current Review

Read [references/review-format.md](references/review-format.md) before creating or
restructuring `review.md`.

The report describes only the current review result:

- keep the assessment, findings, and coverage note consistent with the artifacts
  as they exist now;
- remove fixed or obsolete findings instead of preserving review history, while
  keeping accepted risks whose recorded boundary still applies;
- do not add review-process bookkeeping, duplicate summaries, or empty sections;
- if no active finding remains, say so explicitly without placeholder concerns
  or resolved-item history, and name any applicable accepted risks separately.

When continuing an existing review, reread `review.md`, the current change
artifacts, and any repository evidence needed to test its conclusions. Re-test
each existing finding under the report retention contract, re-evaluate areas
affected by material edits, and rewrite the report to current truth. Exact
content tracking is unnecessary because current artifacts and findings are
reviewed again. Prior acceptance must not narrow the broad re-audit; reconcile
accepted risks with current evidence afterward under the report contract.

## Record Material Findings

A finding should help a human decide or an author improve the change. Include:

- a severity calibrated to plausible impact;
- specific evidence from artifacts, code, configuration, or authoritative
  external sources;
- the concrete consequence if the gap remains;
- the observable outcome needed to close it;
- a focused human question only when resolution requires a consequential choice.

Do not report cosmetic preferences, demand sections whose information is already
clear elsewhere, or prescribe an implementation when several valid designs
remain. Do not hide a real gap behind vague language such as "consider adding
tests" or "think about monitoring."

## Address Findings When Asked

For requests such as `fix F2` or `address F1 and F3`, resolve each requested ID
from the current `review.md`. Do not guess a missing ID or include unselected
findings. Recheck the selected findings and ask only for consequential choices
needed to address them. Give their IDs, evidence, impact, required changes, and
settled decisions to `openspec-update-change`; do not edit planning artifacts
directly under this skill.

After that workflow completes, re-read the current artifacts, re-audit affected
behavior, coherence, planned work, verification, and specialist areas, then
rewrite `review.md` to contain only findings that still apply while preserving
their identifiers. Reject remediation that hides an upstream gap in vague work,
treats downstream artifacts as the source of truth, or silently broadens the
change.

## Accept Residual Risk When Asked

For a request such as `accept F2 as residual risk`, resolve the selected ID and
follow the accepted-risk contract in
[references/review-format.md](references/review-format.md). Only the human's
explicit instruction is acceptance; an agent recommendation, remediation cost,
or low likelihood is not.

Recheck the evidence, potential impact, and remediation trade-off. If evidence
disproves the condition, remove the finding without creating an accepted risk.
Otherwise move it from `F<n>` to a distinct `AR<n>` with the required acceptance
boundary and traceability. If acceptance changes an OpenSpec source of truth,
reconcile that artifact through `openspec-update-change` and re-audit; if it must
outlive the change, require a durable project decision record.

Acceptance resolves the finding in review state, not the underlying condition.
Do not create remediation work that the human deliberately declined, count
`AR<n>` entries as active findings, or imply that the risk was fixed. Keep
unselected findings and accepted risks unchanged, and name the accepted risk in
the handoff.

## Handoff

Report the current result, the highest-impact findings or their absence,
applicable accepted risks, artifacts changed during requested remediation,
decisions still needed, the validation boundary, and the `review.md` path. Keep
the handoff concise and leave Apply, continuation, and risk acceptance to the
human.

## Verification

Before reporting a clean review, confirm that:

- the actual artifact graph and relevant repository context were inspected;
- every applicable behavioral contract and capability boundary was reviewed, and
  every omitted or skipped role was justified;
- all five core questions and every activated risk area were reviewed;
- findings are evidence-backed and current;
- every accepted risk came from an explicit human decision, has a distinct
  `AR<n>` ID and bounded reopening criteria, and is not duplicated as an active
  finding;
- intended outcomes trace through every applicable role in the actual schema
  graph to planned work and verification;
- OpenSpec validation passed or its limitation is visible;
- `review.md` contains no stale history or implied findings;
- no implementation code or Apply state was changed; and
- no Apply, continuation, or risk-acceptance approval was implied.

When changing this skill, evaluate the realistic routing and workflow cases in
[references/evaluation-cases.md](references/evaluation-cases.md).
