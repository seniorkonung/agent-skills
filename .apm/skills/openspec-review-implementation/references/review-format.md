# Implementation Review Report Format

Use `<change-root>/implementation-review.md` as the durable statement of current
independent decision-review findings across bounded implementation targets. It is
a companion report, not an OpenSpec schema artifact, a conformance report, or a
history of review sessions.

## Keep Only Current Truth

- Rewrite the relevant target section after implementation, intent, or conclusions
  change.
- Remove a finding only when a fresh isolated review of an immutable target shows
  that it has been fixed, disproven, or made obsolete.
- Keep an accepted residual risk visible while the risky condition remains.
- Preserve applicable findings from other targets; reviewing a new increment must
  not overwrite them.
- Retain every target section with applicable findings, accepted risks, or an
  incomplete review. An incomplete section may be removed only when a conclusive
  isolated review of the same stable target replaces it, or when repository
  evidence shows that target no longer exists in the current implementation.
- Retain the most recent clean immutable-target section. Remove older clean
  sections and superseded reviews of the same target.
- Do not preserve resolved findings, old assessments, previous reviewer output,
  or remediation history.
- Do not duplicate findings in a summary table.

## Suggested Shape

Adapt headings to project conventions when useful. Omit optional fields rather
than creating empty sections.

```markdown
# OpenSpec Implementation Decision Review: <change-name>

## Current assessment

**Result:** Changes needed | No substantive findings | Independent review incomplete

<A short current assessment across retained targets. Do not claim conformity to
OpenSpec artifacts.>

Use `Changes needed` whenever any retained target has an applicable finding,
including an accepted residual risk; mention any additional incomplete targets in
the assessment. Otherwise use `Independent review incomplete` when any retained
target is incomplete, and `No substantive findings` only after a clean isolated
review of an immutable target with no incomplete target remaining.

## Target: <stable target ID> — <task identifier or neutral increment label>

### Review target

- **Code baseline:** <base revision or other reproducible boundary>
- **Reviewed state:** <immutable head revision, or bounded uncommitted paths>
- **Included paths:** <exact reviewed path set>
- **Patch digest:** <SHA-256 for a transient diff; omit for an immutable target>
- **Reproducibility:** Immutable | Provisional transient snapshot

### Intention brief

- **Problem:** <undesirable state>
- **Desired outcome:** <state that should become possible or true>
- **Affected boundary:** <actor or system boundary>
- **Binding constraints:** <only externally binding constraints, or "None supplied">
- **Non-goals:** <scope exclusions; omit when none are needed>

### Independent assessment

**Result:** Changes needed | No substantive findings | Incomplete

<A short assessment of the engineering decisions in the bounded target. Do not
claim conformity to OpenSpec artifacts.>

**Isolation:** <fresh reviewer boundary, excluded context, and any limitation>

### Findings

#### High — <concise decision problem>

- **Evidence:** <specific code and repository facts>
- **Failure mode:** <failure, unnecessary complexity, or structural harm>
- **Why the decision is unsound:** <reason under the supplied intent and constraints>
- **Required property:** <engineering outcome needed without prescribing one fix>
- **Possible alternatives:** <illustrative options; omit when they would narrow the solution space>
- **Uncertainty:** <missing decision-relevant constraint or question; omit when none>
- **Affected layers:** <implementation, task/verification, design/ADR,
  requirement/proposal, workflow context, or separate change; add only after
  reconciliation>
- **Earliest source of truth:** <the first implementation or artifact source that
  must change; add only after reconciliation>
- **Disposition:** Open | Accepted residual risk | Awaiting human decision
- **Decision needed:** <human choice and why; omit when unnecessary>

### Review coverage

<A brief note naming the code paths and decision-relevant areas examined. This is
not an OpenSpec conformity matrix.>
```

Use `critical`, `high`, `medium`, and `low` severity according to plausible
impact. Do not create findings for preference-only alternatives without concrete
harm or material simplification.

Use one target section per bounded target. A provisional target or non-isolated
fallback must use `Incomplete`; it may retain concrete findings but cannot emit a
clean conclusion or clear an existing finding.

## A Clean Review

When no substantive problem remains, do not leave placeholder findings, resolved
items, or implied concerns. Write:

```markdown
### Findings

No substantive engineering-decision findings were found in the reviewed
implementation target under the supplied intention and binding constraints.
```

The current assessment, intention brief, target, isolation note, and coverage
should remain so the scope and limits of that conclusion survive context loss.
