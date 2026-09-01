---
name: openspec-review-change
description: Audits and iteratively strengthens an OpenSpec change proposal before implementation. Use when asked to review, challenge, continue reviewing, re-audit, or resolve recorded findings in an OpenSpec change before Apply; not for code review or post-implementation verification.
---

# OpenSpec Review Change

Review an OpenSpec change as one system of intent, requirements, decisions, and
implementation work. Look beyond the proposal's declared scope, find material
gaps before implementation, and keep a concise current assessment in
`openspec/changes/<change>/review.md`.

The report is working review evidence. It is not an OpenSpec schema artifact, an
approval record, or permission to run Apply.

## Boundaries

- Review one active change at a time.
- During the initial audit, write only `review.md`; finish a broad pass before
  revising planning artifacts so an early fix does not bias the remaining review.
- Revise proposal artifacts only when the user asks to address findings. Never
  modify implementation code, invoke Apply, check off implementation tasks, or
  archive the change.
- Read implementation code, canonical specs, project documentation, and history
  whenever they provide evidence about the proposed change.
- Ask the human before settling consequential product, contract, architecture,
  data, security, privacy, infrastructure-cost, or residual-risk decisions.
- Do not describe the change as approved or ready to Apply. The human owns that
  decision after the review.

## Routing

Use this skill for a full pre-Apply review, a continuation of that review, a
re-audit after proposal changes, or user-requested resolution of its findings.

Route narrower or later work elsewhere:

- syntax or structure validation alone -> `openspec validate`;
- a narrow requested artifact edit -> the OpenSpec update workflow;
- verification of implemented code against the change -> OpenSpec verification;
- independent review and reconciliation of engineering decisions in a completed
  Apply increment -> `openspec-review-implementation`;
- independent decision review that needs no OpenSpec orchestration ->
  `implementation-decision-review`;
- ordinary conformance, pull-request, or implementation review -> code review;
- creation of missing required artifacts -> the OpenSpec continuation workflow.

A full review may still identify structural errors or missing artifacts. Record
them as findings rather than silently expanding the task.

## Resolve the Change and Its Evidence

1. Use the change named by the user. If none is named, inspect active changes and
   select the only plausible one; ask when several remain plausible.
2. Resolve the actual artifact graph from the change metadata and OpenSpec schema.
   Include custom artifacts such as ADRs instead of assuming only proposal,
   specs, design, and tasks.
3. Read repository instructions, every change artifact, and relevant canonical
   specs or prior decisions completely.
4. Inspect affected code, callers, interfaces, data, configuration, tests, and
   deployment paths far enough to verify the proposal's claimed boundary and
   discover omitted impact.
5. Run `openspec validate <change>` when available. Treat it as structural
   evidence, not proof of semantic completeness. State the untested boundary when
   the command is unavailable or fails.

If a required artifact is missing, record what cannot yet be reviewed and direct
the user to the appropriate OpenSpec continuation. Do not create the artifact as
part of an audit.

## Audit the Specification Set Explicitly

Review the specs as their own behavioral architecture before treating them as one
link in the artifact chain. A change folder is a unit of work, not a capability
boundary: one change may add or modify several specs, and its title or primary
feature does not make one catch-all spec the correct owner of every scenario.

Reconstruct the intended behavioral contract independently of the current file
layout, then check:

- whether the proposal names every new or modified capability and every delta
  uses the correct new or canonical spec path;
- whether each spec has a coherent, stable capability purpose rather than merely
  mirroring the current change, implementation layer, or task grouping;
- whether each requirement states one observable product or system obligation and
  each scenario actually verifies that requirement;
- whether each requirement and scenario sits with the capability that owns its
  outcome, without duplicate ownership or unrelated behavior hidden in a
  convenient spec;
- whether important behavior is absent, repeated, or contradicted across specs,
  proposal, design, tasks, and verification.

Do not create a spec merely because implementation needs a database, queue,
library, class, or other mechanism. Put implementation choices and construction
work in design or tasks. Persistence, atomicity, compatibility, recovery, or
other technical-sounding properties belong in specs only when they are
externally verifiable product, downstream-system, or operator contracts. Give
such behavior a separate capability spec only when it has independent ownership
and purpose; otherwise keep it with the capability whose outcome it constrains.

If a scenario depends on another capability, keep that dependency as context
when it is only a precondition. Split or move behavior when the scenario creates
a separate normative outcome with a different owner or lifecycle. Record unclear
capability ownership, misplaced scenarios, implementation leakage, and
cross-artifact contradictions as findings rather than normalizing the existing
layout.

## Review Breadth Before Depth

Start with the five core questions:

1. Does the change define the real problem, intended outcome, scope, and
   non-goals?
2. Does the specification set use the right capability boundaries and place each
   requirement and scenario with its behavioral owner?
3. Are observable behavior, edge cases, errors, and permissions unambiguous?
4. Do intent, requirements, decisions, tasks, and verification agree in both
   directions?
5. Could an implementer complete and verify the work without inventing missing
   requirements or decisions?

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
- remove fixed or obsolete findings instead of preserving review history;
- do not add review-process bookkeeping, duplicate summaries, or empty sections;
- if no substantive finding remains, say so explicitly without placeholder
  concerns or resolved-item history.

When continuing an existing review, reread `review.md`, the current change
artifacts, and any repository evidence needed to test its conclusions. Re-evaluate
areas affected by material edits and rewrite the report to current truth. Exact
content tracking is unnecessary because current artifacts are reviewed again.

## Record Material Findings

A finding should help a human decide or an author improve the proposal. Include:

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

Resolve findings by impact and dependency. Correct the earliest source of truth,
then synchronize dependent requirements, design, tasks, and verification.

Before editing, ask the human for any unresolved consequential choice. Once the
choice is settled:

1. update only the planning artifacts inside the selected change;
2. run relevant structural validation;
3. recheck affected behavior, coherence, tasks, and specialist areas;
4. rewrite `review.md` to contain only the findings that still apply;
5. write the clean-review statement when none remain.

Do not close a design gap only by adding a vague task, let tasks become the source
of requirements, or silently broaden the change to make a finding disappear.

## Handoff

Report the current result, the highest-impact findings or the absence of findings,
artifacts changed during requested remediation, decisions still needed, the
validation boundary, and the `review.md` path. Keep the handoff concise and leave
the Apply decision to the human.

## Verification

Before reporting a clean review, confirm that:

- the actual artifact graph and relevant repository context were inspected;
- the capability set, spec boundaries, and placement of every changed requirement
  and scenario were reviewed at the behavioral-contract level;
- all five core questions and every activated risk area were reviewed;
- findings are evidence-backed and current;
- proposal outcomes trace through requirements, decisions, tasks, and
  verification;
- OpenSpec validation passed or its limitation is visible;
- `review.md` contains no stale history or implied findings;
- no implementation code or Apply state was changed.
