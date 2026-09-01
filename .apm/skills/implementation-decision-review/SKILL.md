---
name: implementation-decision-review
description: Independently challenges whether implemented engineering decisions are a defensible way to achieve a supplied high-level intention. Use after a bounded implementation increment when the caller wants decision quality rather than task or specification conformance or merge approval; not for orchestration, durable finding management, or planning-artifact reconciliation.
---

# Implementation Decision Review

Independently assess the engineering decisions embodied in a bounded code target.
Ask whether the implementation is a defensible way to achieve its high-level
intent and whether repository evidence reveals a materially simpler, safer, or
more coherent alternative. Do not try to prove global optimality.

This is a read-only review. Return findings to the caller; do not modify code,
persist review state, issue a merge verdict, or decide which planning artifact
should change.

## Required Input

The caller supplies an intention brief containing:

- **Problem:** the undesirable state that motivated the work;
- **Desired outcome:** what should become possible or true in user, operator, or
  system terms;
- **Affected boundary:** the actor or system boundary whose outcome matters;
- **Binding constraints:** only externally imposed constraints that genuinely
  limit valid solutions;
- **Non-goals:** optional scope exclusions that prevent review drift; and
- **Review target:** the exact diff, commit range, or bounded file set to inspect.

The brief must describe outcomes rather than the selected mechanism. Treat files,
symbols, technologies, algorithms, patterns, module seams, and task steps as
implementation choices unless the caller explicitly identifies one as an
externally binding constraint and explains why.

Return `Incomplete` when the problem, outcome, boundary, exact target, or a
decision-relevant binding constraint is missing. State the smallest question that
would unblock review instead of reconstructing the answer from planning material.

## Preserve Independence

An independent result requires a fresh context that has not participated in the
implementation or seen its planning rationale. If the current context has already
seen that material, disclose the limitation and return `Incomplete`; an
instruction to forget known context does not restore independence.

Use only the supplied intention brief as framing context. Do not seek or read:

- tasks, specifications, designs, ADRs, proposals, or planning artifacts;
- commit or pull-request descriptions, Git log or blame output;
- the implementing agent's discussion or explanation; or
- earlier review findings and preferred remedies.

Use revision identifiers only to resolve the exact diff. Inspect the target,
tests, surrounding production code, callers, runtime boundaries, configuration,
and repository conventions as needed to understand actual behavior. Treat tests
as reviewable evidence, not as authoritative intent: they may encode the same
poor decision as the implementation.

A recorded, tested, or deliberate choice is not evidence that the choice is
sound.

## Review the Implemented Decisions

Concentrate on decisions with observable engineering consequences:

1. **Effectiveness:** Can the mechanism reliably achieve the stated outcome under
   the supplied constraints, including important edge and failure paths?
2. **Simplicity:** Does the implementation introduce avoidable concepts,
   branches, layers, dependencies, or configuration compared with a materially
   simpler available approach?
3. **Structure:** Are responsibilities, module boundaries, state ownership, and
   dependency direction coherent with the surrounding system?
4. **Risk:** Does the decision create security, privacy, reliability, data,
   concurrency, performance, operability, or recovery hazards?
5. **Alternatives:** Does repository evidence expose a materially better approach,
   rather than merely a different stylistic preference?

Judge the resulting system, not just changed lines. Follow affected callers and
boundaries far enough to substantiate a failure mode, but do not broaden the
review into unrelated cleanup.

Do not assess conformity to hidden tasks or specifications. Do not infer that a
requirement, design, or task is wrong; the caller may reconcile confirmed findings
against its own source-of-truth graph afterward.

## Return an Evidence-Backed Result

Use one result:

- `Changes needed` when at least one substantive decision finding exists;
- `No substantive findings` when the independent review completed without one;
  or
- `Incomplete` when intent, target, constraints, or independence are insufficient
  for a sound conclusion.

Use `critical`, `high`, `medium`, or `low` severity calibrated to plausible
impact. Report `low` only for concrete harm or material simplification. Omit nits,
preference-only alternatives, FYIs, mandatory praise, merge readiness, and
`APPROVE` or `REQUEST CHANGES` language.

Every finding includes:

- **Evidence:** specific code and repository facts;
- **Failure mode:** the failure, unnecessary complexity, or structural harm;
- **Why the decision is unsound:** reasoning under the supplied intent and
  constraints;
- **Required property:** the engineering outcome needed to close the finding
  without prescribing one implementation;
- **Possible alternatives:** only when examples clarify the solution space; and
- **Uncertainty:** a missing constraint or focused question when relevant.

Keep the required property separate from example remedies. Do not turn one
possible fix into a hidden specification when several approaches remain valid.

Use this shape:

```markdown
## Decision Review

**Result:** Changes needed | No substantive findings | Incomplete

### High — <decision problem>

- **Evidence:** <specific code and repository facts>
- **Failure mode:** <failure, unnecessary complexity, or structural harm>
- **Why the decision is unsound:** <reason under the intention and constraints>
- **Required property:** <engineering outcome without one prescribed fix>
- **Possible alternatives:** <omit when they would narrow the solution space>
- **Uncertainty:** <omit when none>

### Review coverage

<Code paths and decision-relevant areas examined, plus any limitation.>
```

When no finding remains, omit placeholder finding sections and state that no
substantive engineering-decision finding was found under the supplied intention
and constraints. This result makes no claim about task or specification
conformance, merge readiness, or the quality of context deliberately withheld.

## Completion Check

Before returning the result, confirm that:

- the intention brief did not prescribe the selected mechanism;
- the exact target was bounded without unrelated changes;
- no prohibited rationale or previous finding entered the review context;
- every finding has concrete evidence, a failure mode, and a required property;
- uncertainty is explicit rather than filled from hidden planning context; and
- the result contains no conformance, planning-artifact, or merge verdict.
