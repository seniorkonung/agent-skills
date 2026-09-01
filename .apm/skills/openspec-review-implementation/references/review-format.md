# Implementation Review Report Format

Use `<change-root>/implementation-review.md` for the current pre-push review.
The report describes one immutable `upstream..HEAD` range and one active OpenSpec
change. It is not review history or approval to push, merge, archive, or accept
risk.

## Keep Only Current Truth

- Rewrite the report after the outgoing head, implementation, planning artifacts,
  or conclusions change.
- Remove fixed, disproved, and obsolete findings after a complete re-audit.
- Keep accepted risk visible while the risky condition remains.
- Do not retain old targets, resolved findings, reviewer transcripts, duplicate
  summaries, or empty sections.

## Result

Use one aggregate result:

- `Changes needed` when any substantive finding remains;
- `Incomplete` when no finding remains but any required pass, target boundary, or
  verification step was incomplete; or
- `No substantive findings` only when decision, conformance, and code-quality
  passes all completed on the recorded immutable range.

This order is the precedence. A review with both findings and incomplete coverage
uses `Changes needed`; the pass table preserves the coverage limitation.

The result reports review evidence. It is not a push verdict.

## Suggested Shape

Omit optional fields rather than adding placeholders.

```markdown
# OpenSpec Implementation Review: <change-name>

## Assessment

**Result:** Changes needed | Incomplete | No substantive findings

<A short statement of the highest-impact current conclusion.>

## Review target

- **Upstream:** <tracking ref and full base SHA>
- **Reviewed head:** <full HEAD SHA>
- **Outgoing commits:** <count>
- **Reviewable paths:** <count; excludes implementation-review.md>
- **OpenSpec change:** <name and schema>
- **Upstream freshness:** Local tracking state; no fetch performed
- **Excluded worktree state:** <dirty paths were excluded; omit when clean>

## Reviewed increment

### U1 · <short intended outcome>

- **Work items:** <task or work-item IDs or stable labels attributable to the range>
- **Requirements and scenarios:** <affected IDs or stable labels>
- **Affected boundary:** <actor or system boundary>
- **Implementation target:** <exact changed paths within the recorded base..head>
- **Applicable constraints and non-goals:** <mechanism-neutral summary>
- **Excluded change scope:** <untouched future work; omit when obvious>

## Unmapped range

- **Unmatched outgoing paths:** <paths and uncertainty; omit when none>

## Pass coverage

| Pass | Status | Evidence or limitation |
|---|---|---|
| Independent decision review | Complete | <fresh reviewer and exact path boundary for each unit> |
| OpenSpec conformance | Complete | <verification and validation evidence> |
| Code quality | Complete | <areas and checks covered> |

Use `Incomplete` for a pass whose required evidence was unavailable.

## Findings

### F1 · High — <concise problem>

- **Evidence:** <specific paths, lines, behavior, and repository facts>
- **Impact:** <concrete failure, rework, or engineering harm>
- **Required outcome:** <what must become true without prescribing one fix>
- **Earliest source of truth:** <implementation/tests, task/verification,
  design/ADR, requirement/proposal, or separate change>
- **Affected artifacts:** <artifact IDs and code areas that must stay consistent>
- **Decision needed:** <focused human choice and why; omit when unnecessary>
- **Disposition:** Open | Planned | Awaiting decision | Accepted risk

## Review coverage

<A concise note naming important paths, runtime boundaries, requirements, and
activated risk areas examined. Do not reproduce a traceability matrix.>
```

Use `critical`, `high`, `medium`, and `low` severity according to plausible
impact. Do not report cosmetic preferences or hypothetical improvements without
concrete harm.

The reviewed-increment section defines what the outgoing range actually claims
to deliver. Add another `U<n>` section for each materially distinct outcome. Omit
`Unmapped range` when every material path is mapped. Do not list the whole change
as implemented, treat a checkbox as sufficient mapping evidence, or enumerate
every untouched future task. Any material unmatched path must remain visible here
and as a finding when it represents unrelated or untraceable work.

`Evidence` establishes the fact. `Impact` explains why it matters. `Required
outcome` defines closure while preserving solution choice. Put implementation
ideas in the working remediation plan or OpenSpec tasks, not in the finding,
unless examples are needed to clarify the valid solution space.

## A Clean Review

When no substantive finding remains, write:

```markdown
## Findings

No substantive findings were found in the reviewed outgoing implementation range.
```

Keep the target, pass coverage, and review coverage so the boundary of that
conclusion remains reproducible.
