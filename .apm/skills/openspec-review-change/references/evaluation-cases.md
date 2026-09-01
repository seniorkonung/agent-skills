# Evaluation Cases

Use these cases when changing the skill's routing, schema handling, review
ordering, report format, or remediation boundary. Compare the candidate with the
previous committed version and judge observable decisions, report quality,
unnecessary work, and disclosed limitations rather than exact phrasing.

## Claims Under Test

The skill should:

- review the actual artifact graph without requiring conventional artifact names
  or roles that the selected schema legitimately omits;
- apply the capability and specification guidance when the change contains specs
  or changes a durable behavioral contract;
- verify that skipped behavioral-contract artifacts are justified instead of
  treating them as missing or inventing content for them;
- keep the current report at `<change-root>/review.md` outside the schema artifact
  graph;
- use `openspec-update-change` for planning-artifact edits and retain ownership of
  the subsequent re-audit; and
- route implementation review and unrelated narrow planning edits elsewhere.

## Case 1: Conventional Spec-Driven Change

**Prompt**

> Review the active change before implementation and record material gaps.

**Fixture**

- The schema contains proposal, delta specs, design, and tasks.
- The change modifies two capabilities and affects a production integration.

**Expected behavior**

- Review the complete artifact graph and relevant repository context.
- Apply the specification-boundary lens to both capabilities.
- Trace intent, behavioral contract, decisions, work, and verification in both
  directions.
- Activate integration, reliability, observability, and rollout guidance only
  where the evidence warrants it.
- Write only `<change-root>/review.md` during the initial audit.

## Case 2: Custom Schema Without Conventional Specs

**Prompt**

> Broadly review this research-first OpenSpec change before we continue.

**Fixture**

- The schema graph is research -> decision-record -> execution-plan.
- The change does not alter externally observable behavior.
- There are no artifacts named proposal, specs, design, or tasks.

**Expected behavior**

- Map the schema artifacts to their actual semantic roles.
- Review intent, consequential decisions, executable work, and verification
  without demanding conventional artifact names or inventing requirements.
- Do not activate the specification-boundary lens merely because the change is an
  OpenSpec change.
- Record cross-artifact gaps against the actual graph.

## Case 3: Legitimately Skipped Specification Stage

**Prompt**

> Review this internal refactor change before implementation.

**Fixture**

- The schema supports behavioral specifications, but the change legitimately
  skips them for an implementation-only refactor.
- The proposal claims that observable behavior remains unchanged.

**Expected behavior**

- Verify from repository and artifact evidence that skipping the behavioral
  contract is justified.
- Trace only the applicable roles in the actual schema graph.
- Report a finding if the refactor changes observable behavior without an owning
  specification; otherwise do not manufacture requirements.

## Case 4: Address Review Findings

**Prompt**

> Address all findings that do not need another product decision, then re-audit.

**Fixture**

- The initial broad audit is complete.
- One finding requires proposal and task changes; another still needs a human
  contract decision.

**Expected behavior**

- Ask only for the unresolved consequential decision.
- Use `openspec-update-change` to revise the existing planning artifacts rather
  than editing them directly under this skill.
- Pass the applicable findings and settled decisions into that workflow.
- Re-audit affected roles and risk areas afterward.
- Rewrite `review.md` to current truth without resolved-item history.

## Case 5: Adjacent Near Misses

**Prompts**

> Update one sentence in the proposal to reflect the decision we just made.

> Review the committed implementation before I push.

**Expected behavior**

- Route the narrow planning edit to `openspec-update-change` without starting a
  broad review.
- Route committed implementation review to `openspec-review-implementation`.
- Do not create or rewrite `review.md` for either near miss.

## Deterministic Checks

Validate frontmatter, relative links, generated copies, focused repository diff,
and the absence of stale full-path or direct-remediation instructions. Behavioral
evaluation should cover all five cases above.
