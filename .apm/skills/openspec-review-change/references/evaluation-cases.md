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
- preserve existing findings until current artifact evidence shows that they were
  fixed, no longer apply, or were moved to accepted risks by an explicit human
  decision;
- keep human-accepted residual risks outside the active finding list under stable
  `AR<n>` identifiers, with explicit rationale, scope, and reopening conditions;
- re-audit the full change surface before reconciling fresh evidence with
  accepted risks, and reopen a finding when its acceptance boundary no longer
  holds;
- let the user address selected findings by their current report IDs without
  changing unselected findings;
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

> Address F1, then re-audit.

**Fixture**

- The initial broad audit is complete.
- `F1` requires proposal and task changes; `F2` still needs a human contract
  decision.

**Expected behavior**

- Resolve `F1` from the current `review.md` and keep `F2` out of scope, including
  its unresolved consequential decision.
- Use `openspec-update-change` to revise the existing planning artifacts rather
  than editing them directly under this skill.
- Pass the `F1` identifier, evidence, impact, required change, and settled
  decisions into that workflow.
- Re-audit affected roles and risk areas afterward.
- Remove `F1` only if it no longer applies, preserve `F2` and its identifier, and
  rewrite `review.md` to current truth without resolved-item history.

## Case 5: Adjacent Near Misses

**Prompts**

> Update one sentence in the proposal to reflect the decision we just made.

> Review the committed implementation before I push.

**Expected behavior**

- Route the narrow planning edit to `openspec-update-change` without starting a
  broad review.
- Route committed implementation review to `openspec-review-implementation`.
- Do not create or rewrite `review.md` for either near miss.

## Case 6: Re-Audit After Unrelated Planning Revisions

**Prompt**

> I materially revised the rollout plan. Re-audit the change.

**Fixture**

- The current report contains unresolved F1 and F2 in unaffected artifacts.
- The rollout revision introduces a new material problem, F3.

**Expected behavior**

- Re-test F1 and F2 against the current artifacts instead of limiting the review
  to the rollout edits.
- Preserve F1 and F2 with their identifiers when neither was fixed or made
  inapplicable, and assign the next available identifier to F3.
- Do not treat their absence from newly reviewed rollout content as resolution.

## Case 7: Accepted Planning Risk Remains Visible

**Prompt**

> Accept F2 as residual risk. Supporting this legacy deployment topology would
> double the migration paths, and we knowingly accept that it will require a
> manual rollback during the remaining deprecation window.

**Fixture**

- F2 is a supported medium-severity planning finding with concrete evidence and
  operational impact.
- The legacy topology and deprecation window give the acceptance a bounded scope.
- No existing accepted-risk entry covers the condition.
- Variant A: a later broad re-audit finds the same condition within that window
  and none of the reopening conditions has occurred.
- Variant B: the deprecation window is extended indefinitely, invalidating the
  recorded time boundary.

**Expected behavior**

- Recheck F2's evidence, potential impact, and remediation trade-off. If current
  evidence disproves F2, remove it without creating an accepted risk.
- Treat only this explicit human instruction as acceptance; an agent's
  recommendation or the remediation cost alone is insufficient.
- Remove F2 from `Findings` and create a collision-free `AR1` entry under
  `Accepted risks`, recording the supported condition, potential impact,
  rationale, scope and assumptions, reopening conditions, acceptance authority,
  and originating finding.
- Use `No unresolved findings` when no active finding remains, while naming AR1
  in the assessment and handoff. Do not imply that acceptance fixed or disproved
  the condition.
- In variant A, broadly re-audit without letting AR1 narrow the review, then
  retain AR1 and avoid a duplicate finding.
- In variant B, remove AR1 and return the condition to `Findings` because its
  acceptance boundary no longer holds.
- Reconcile an OpenSpec artifact through `openspec-update-change` only when the
  acceptance changes a product contract, architecture, or another source of
  truth. If the acceptance must outlive the change, require AR1 to reference a
  durable project decision record.

**Near miss**

If the reviewer recommends accepting F2 but the human has not explicitly done so,
keep F2 under `Findings` with a focused `Decision needed`; do not create an
accepted-risk entry.

## Deterministic Checks

Validate frontmatter, relative links, generated copies, focused repository diff,
and the absence of stale full-path or direct-remediation instructions. Behavioral
evaluation should cover all seven cases above.
