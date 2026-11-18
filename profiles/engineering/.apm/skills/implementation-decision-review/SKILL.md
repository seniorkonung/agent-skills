---
name: implementation-decision-review
description: Independently assesses whether engineering decisions in a bounded implementation are a defensible way to achieve a supplied high-level intent. Use in a fresh reviewer context after an implementation increment when the caller wants decision-quality findings rather than task or specification conformance or a merge verdict; not when review state or planning artifacts must be managed.
---

# Implementation Decision Review

Independently assess the engineering decisions embodied in a bounded code target.
Ask whether the implementation is a defensible way to achieve its high-level
intent and whether repository evidence reveals a materially simpler, safer, or
more coherent alternative. Do not try to prove global optimality.

The useful result is a supported explanation of a consequential decision, not a
list of ways you would have written the code differently. Trace what the code
does, establish why that matters, and state the property a correction must keep.

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

Check the input before reviewing. If a required field is absent, the brief
prescribes an unexplained mechanism, or the supplied commits cannot be read,
return `Incomplete` and name the missing input. Do not reconstruct intent from
the implementation or planning material.

A constraint discovered during review may limit only one conclusion. Explain the
repository evidence for it, identify the affected area, and ask the caller for
the smallest clarification. Continue independent areas and preserve findings
that do not depend on the answer. A merely imaginable constraint is not a reason
to stop or to excuse a demonstrated problem.

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

## Inspect the Committed Target

Reconstruct the diff using the supplied full commit IDs and exact path list:

```sh
git --literal-pathspecs diff <base> <head> -- <target-paths>
git show '<head>:<path>'
```

Run from the repository root. Pass each path as a separate, quoted argument;
`<target-paths>` is a placeholder, not one space-joined argument. Read full files
from the recorded head, and deleted or previous content from the base. Ordinary
filesystem reads can include uncommitted edits even when the diff is pinned.

Do not rerun discovery, resolve the current upstream or `HEAD`, or widen your
target. Moving branch refs do not change the supplied commits; the caller owns
the check that this snapshot still answers the user's request.

Inspect unchanged surrounding production code, callers, runtime boundaries,
configuration, and repository conventions as needed to understand actual
behavior. Before reading or searching a path outside the target, check:

```sh
git --literal-pathspecs diff --quiet <base> <head> -- <path>
```

Exit `0` permits reading that path from the recorded head; `1` means it changed
and is outside your boundary; any other result is a failed check, not permission
to read. If a changed path is necessary, name it and mark coverage incomplete so
the caller can regroup the units. Avoid repository-wide content searches that
would read other changed paths or prohibited planning material before this check.

Context files are not additional review targets: findings must arise from
decisions embodied in the bounded diff. Tests and code comments can help explain
behavior, but their assertions and rationale do not establish authoritative
intent or prove that a decision is sound.

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

For each candidate finding, trace a concrete chain: **trigger or workload → code
path → consequence → conflict with the desired outcome or constraint**. For a
structural finding, identify the unnecessary concept or coupling and its actual
maintenance cost. Check relevant guards, callers, and failure handling for
counter-evidence before reporting. Do not report an unchanged defect unless a
decision in this diff introduces, exposes, or materially worsens it.

A simpler alternative earns a finding only when it preserves the supplied
outcome and constraints and removes a concrete cost or hazard. Fewer lines, a
familiar pattern, or a preferred library alone do not establish that. Conversely,
a concrete failure mode does not require a fully designed replacement to be
reportable.

Do not assess conformity to hidden tasks or specifications or attribute a finding
to an unseen requirement, design, or task. Report the engineering problem and
required property; the caller can later decide which artifact should change.

## Return an Evidence-Backed Result

After checking input and isolation, use the first matching result:

| Condition | Result |
|---|---|
| At least one supported substantive finding exists | `Changes needed` |
| No supported finding exists, but required review coverage is missing | `Incomplete` |
| The independent review completed without a substantive finding | `No substantive findings` |

Report **Coverage: Complete or Incomplete** separately. A finding and a coverage
gap can coexist: keep the supported finding, describe the gap, and do not imply
that the rest of the target was cleared. If isolation failed, return
`Incomplete` without presenting a dependent assessment as independent findings.

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
**Coverage:** Complete | Incomplete

### High — <decision problem>

- **Evidence:** <specific code and repository facts>
- **Failure mode:** <failure, unnecessary complexity, or structural harm>
- **Why the decision is unsound:** <reason under the intention and constraints>
- **Required property:** <engineering outcome without one prescribed fix>
- **Possible alternatives:** <omit when they would narrow the solution space>
- **Uncertainty:** <omit when none>

### Review coverage

<Full base and head IDs, exact assigned paths, areas examined, and any limitation.
For incomplete coverage, name the missing evidence or path and the smallest
caller action needed.>
```

Omit placeholder finding sections. When a complete review finds no substantive
issue, state that conclusion under the supplied intention and constraints. When
review is incomplete, describe the missing coverage without implying that the
target is sound. Neither result establishes task or specification conformance,
merge readiness, or the quality of context deliberately withheld.

## Completion Check

Before returning, check that the result can be trusted:

- **Independence:** the brief supplied intent without prohibited solution or
  review framing, and this context was fresh.
- **Evidence:** files came from the supplied commits; every context path was
  checked before reading, and no other changed paths entered the review.
- **Judgment:** each finding connects a decision to concrete harm and a required
  property, after checking relevant counter-evidence.
- **Limits:** incomplete coverage remains explicit, and the result makes no
  conformance, planning-artifact, or merge claim.

When changing this skill, evaluate the scenarios in
[references/evaluation-cases.md](references/evaluation-cases.md).
