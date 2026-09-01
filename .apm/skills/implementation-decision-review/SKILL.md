---
name: implementation-decision-review
description: Independently assesses whether engineering decisions in a bounded implementation are a defensible way to achieve a supplied high-level intent. Use in a fresh reviewer context after an implementation increment when the caller wants decision-quality findings rather than task or specification conformance or a merge verdict; not when review state or planning artifacts must be managed.
---

# Implementation Decision Review

Independently assess the engineering decisions embodied in a bounded code target.
Ask whether the implementation is a defensible way to achieve its high-level
intent and whether repository evidence reveals a materially simpler, safer, or
more coherent alternative. Do not try to prove global optimality.

This read-only review protocol must run in a fresh reviewer context. The caller
must establish isolation and supply a stable target. Return findings only; do not
modify code, persist review state, issue a merge verdict, or decide which planning
artifact should change.

## Required Input

The caller supplies an intention brief containing:

- **Problem:** the undesirable state that motivated the work;
- **Desired outcome:** what should become possible or true in user, operator, or
  system terms;
- **Affected boundary:** the actor or system boundary whose outcome matters;
- **Binding constraints:** only externally imposed constraints that genuinely
  limit valid solutions, or `none known` when none have been identified;
- **Non-goals:** optional scope exclusions that prevent review drift; and
- **Review target:** the repository root, immutable base and head revisions, and
  the complete changed-path list for this unit. The caller, not this reviewer,
  owns discovery and guarantees that the target is stable.

The brief must describe outcomes rather than the selected mechanism. Treat files,
symbols, technologies, algorithms, patterns, module seams, and task steps as
implementation choices unless the caller explicitly identifies one as an
externally binding constraint and explains why.

For example, a mechanism-neutral brief can say:

```text
Problem: Automation can receive success although no report exists.
Desired outcome: Reported success means the report can be retrieved.
Affected boundary: Calling automation and the report service.
Binding constraints: Existing exit codes are an external compatibility contract.
Non-goals: Changing report contents.
Review target: Repository <root>; exact <base>..<head>; paths <path list>.
```

Return `Incomplete` when the problem, outcome, boundary, binding constraints
field, or exact target is absent; when the target cannot be held stable; or when
repository evidence exposes a likely external constraint not covered by the
brief. State the smallest question that would unblock review. Do not invent an
unknown constraint or reconstruct the answer from planning material.

## Preserve Independence

An independent result requires a fresh context that has neither participated in
the implementation nor received its planning rationale or any framing material
prohibited below. If the current context has already received that material,
disclose the limitation and return `Incomplete`; an instruction to forget known
context does not restore independence.

Use only the supplied intention brief as framing context. Do not seek or read:

- tasks, specifications, designs, ADRs, proposals, or planning artifacts;
- commit or pull-request descriptions, Git log or blame output;
- the implementing agent's discussion or explanation; or
- earlier review findings and preferred remedies.

Reconstruct only `git diff <base>..<head> -- <target-paths>` from the supplied
target. Do not rerun a discovery helper, resolve the current upstream or `HEAD`,
read other changed paths, or widen the target yourself. If another changed path
is required for a coherent review, return `Incomplete` and name it so the caller
can correct the unit boundary.

Inspect unchanged surrounding production code, callers, runtime boundaries,
configuration, and repository conventions as needed to understand actual
behavior. Before opening a context path outside the target, use
`git diff --quiet <base> <head> -- <path>` only to confirm that it did not change.
Do not read it when that check reports a change; return `Incomplete` if the path
is necessary. Context files are not additional review targets: findings must
arise from decisions embodied in the bounded diff. Treat tests in the target as
reviewable evidence, not as authoritative intent; they may encode the same poor
decision as the implementation.

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

Do not assess conformity to hidden tasks or specifications or attribute a finding
to an unseen requirement, design, or task. Report the engineering problem and
required property; the caller can later decide which artifact should change.

## Return an Evidence-Backed Result

Use one result:

- `Changes needed` when at least one substantive decision finding exists;
- `No substantive findings` when the independent review completed without one;
  or
- `Incomplete` when intent, target, constraints, or independence are insufficient
  for a sound conclusion.

Use `critical`, `high`, `medium`, or `low` severity calibrated to plausible impact
and reach: `critical` means plausible catastrophic or system-wide harm; `high`, a
serious failure of the stated outcome; `medium`, a material but bounded failure or
risk; and `low`, concrete limited harm or material simplification. Omit nits,
preference-only alternatives, FYIs, mandatory praise, merge readiness, and
`APPROVE` or `REQUEST CHANGES` language.

Every finding includes:

- **Evidence:** specific code and repository facts;
- **Failure mode:** the failure, unnecessary complexity, or structural harm;
- **Why the decision is unsound:** reasoning under the supplied intent and
  constraints;
- **Required property:** the engineering outcome needed to close the finding
  without prescribing one implementation.

Add **Possible alternatives** only when examples clarify the solution space. Add
**Uncertainty** when a missing constraint or focused question affects the finding.

Keep the required property separate from example remedies. Do not turn one
possible fix into a hidden specification when several approaches remain valid.
For example, the distinction can look like this:

- **Required property:** A success response must correspond to durable completion
  or expose a caller-visible pending state.
- **Possible alternatives:** Wait for completion, or return a durable operation
  handle whose status exposes later failure.

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

<Target identity, code paths and decision-relevant areas examined, plus any
limitation.>
```

When no substantive finding exists, omit placeholder finding sections and state
that none was found under the supplied intention and constraints. This result
makes no claim about task or specification conformance, merge readiness, or the
quality of context deliberately withheld.

## Completion Check

Before returning the result, confirm that:

- the intention brief did not prescribe the selected mechanism;
- every mandatory input field was present, with `none known` accepted for binding
  constraints;
- the exact target was stable and bounded without unrelated changes;
- the reviewed diff used only the supplied base, head, and target paths, without
  rediscovery or scope expansion;
- every context path outside the target was confirmed unchanged before it was
  read;
- no prohibited framing material or previous finding entered the review context;
- every finding has concrete evidence, a failure mode, soundness reasoning, and a
  required property;
- uncertainty is explicit rather than filled from hidden planning context; and
- the result contains no conformance, planning-artifact, or merge verdict.
