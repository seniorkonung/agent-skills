# Implementation Review Report Format

Use `<change-root>/implementation-review.md` as the durable statement of current
independent decision-review findings across bounded implementation targets. It is
a companion report, not an OpenSpec schema artifact, a conformance report, or a
history of review sessions. Read this reference before every report write.

## Keep Only Current Truth

- Rewrite the relevant target section after implementation, intent, or conclusions
  change.
- Remove a finding only when a fresh isolated review of an immutable target shows
  that it has been fixed, disproven, or made obsolete.
- Keep an accepted residual risk visible while the risky condition remains.
- Preserve applicable findings from other targets; reviewing a new increment must
  not overwrite them.
- Retain every target section with applicable findings, accepted risks,
  `Re-audit required`, or an incomplete review. Remove it only after a conclusive
  isolated review of the same decision boundary, or when repository evidence
  shows that boundary no longer exists in the current implementation.
- Retain only the most recent clean immutable-target section across the change so
  the latest clean scope survives context loss without becoming review history.
- Do not preserve resolved findings, old assessments, previous reviewer output,
  or remediation history.
- Do not duplicate findings in a summary table.

## Aggregate Result

Use one report-level result:

- `Open findings` when any retained target has an applicable finding, including
  an accepted residual risk or a finding awaiting re-audit;
- `Independent review incomplete` when no applicable finding remains but at least
  one retained target is incomplete; or
- `No substantive findings` only after a clean isolated review of an immutable
  target when no incomplete target remains.

The aggregate result describes the evidence still present, not whether the human
has chosen remediation. Express that choice through each finding's disposition.

## Suggested Shape

Adapt headings to project conventions when useful. Omit optional fields rather
than creating empty sections.

```markdown
# OpenSpec Implementation Decision Review: <change-name>

## Current assessment

**Result:** Open findings | No substantive findings | Independent review incomplete

<A short current assessment across retained targets. Do not claim conformity to
OpenSpec artifacts.>

Mention the dominant disposition and any additional incomplete targets without
turning this paragraph into a duplicate finding summary.

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
- **Binding constraints:** <only externally binding constraints, or "None known">
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
- **Disposition:** Open | Remediation planned | Accepted residual risk | Awaiting human decision | Re-audit required
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

Persist the independent assessment after the pre-reconciliation code-evidence
check allowed by the main workflow. During reconciliation, add affected layers,
earliest source of truth, disposition, and decision fields without rewriting the
evidence or result from planning rationale. Use `Re-audit required` when later
context may disprove or narrow a finding, and keep it until a fresh isolated
review decides the issue.

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
