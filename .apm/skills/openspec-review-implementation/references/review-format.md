# Implementation Review Report Format

Use `<change-root>/implementation-review.md` for the active OpenSpec change's
current review state. Record the latest immutable review target and findings that
still need an explicit resolution. The report is not review history or approval
to push, merge, archive, or accept risk.

## Record Supported Conclusions

Create or rewrite the report as soon as any review pass substantiates a finding
with repository evidence, concrete impact, a required outcome, and an earliest
source of truth. Do not defer a supported finding until the remaining passes
finish.

Before the first write, read the existing report in the orchestrator context
after the fresh decision reviewers have returned. Carry forward a supported
finding unless this review resolves it explicitly. Never expose the report or
earlier findings to an isolated reviewer. Excluding the report from the Git
target prevents a re-review loop; it does not exclude the report as current
finding state. Preserve carried finding IDs and assign collision-free IDs to new
findings.

Completing a pass alone does not justify a report write. Do not use the report as
a scratchpad, progress log, or store for suspicions and reviewer transcripts. If
no substantive finding is established during the passes and no earlier finding
needs to be carried forward, write the clean report only when finalizing the
review.

When later evidence reveals another symptom of the same root cause, update the
existing finding instead of adding a duplicate. Revise or remove a recorded
finding when the evidence changes or disproves it.

## Keep Only Unresolved Findings

- A finding remains until it has an explicit resolution. A different or narrower
  target, a moved head, or its absence from new reviewer output is not a
  resolution.
- Resolution may come from repository evidence that fixes or disproves the
  problem, or from a concrete remediation decision durably captured in the
  appropriate OpenSpec sources of truth, with any remaining implementation owned
  by concrete tracked work.
- Once those artifacts own the required outcome, remove the finding; they become
  the source of truth for later implementation.
- Preserve a finding outside the current target and disclose that it was carried
  forward rather than re-reviewed.
- Keep accepted risk visible while the risky condition remains.
- Do not retain resolved findings, closure records, reviewer transcripts,
  duplicate summaries, or empty sections.

## Result

Use one aggregate result:

- `Changes needed` when any unresolved finding remains;
- `Incomplete` when no finding remains but any required pass, target boundary, or
  verification step was incomplete; or
- `No unresolved findings` only when decision, conformance, and code-quality
  passes all completed on the recorded immutable range and no finding still
  awaits resolution.

This order is the precedence. A review with both findings and incomplete coverage
uses `Changes needed`; the pass table preserves the coverage limitation.

The result reports review evidence. It is not a push verdict.

## Suggested Shape

Omit optional fields rather than adding placeholders.

```markdown
# OpenSpec Implementation Review: <change-name>

## Assessment

**Result:** Changes needed | Incomplete | No unresolved findings

<A short statement of the highest-impact current conclusion.>

## Review target

- **Baseline:** <tracking or user-supplied local ref and full base SHA>
- **Reviewed head:** <full HEAD SHA>
- **Target commits:** <count>
- **Reviewable paths:** <count; excludes implementation-review.md>
- **OpenSpec change:** <name and schema>
- **Target scope:** Complete pre-push range | User-requested bounded range
- **Baseline freshness:** Local ref state; no fetch performed
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

- **Unmatched target paths:** <paths and uncertainty; omit when none>

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
- **Disposition:** Open | Awaiting decision | Accepted risk
- **Current target relation:** Carried forward; not re-reviewed | <omit when the
  finding was reviewed in the current target>

## Review coverage

<A concise note naming important paths, runtime boundaries, requirements, and
activated risk areas examined. Do not reproduce a traceability matrix.>
```

Use `critical`, `high`, `medium`, and `low` severity according to plausible
impact. Do not report cosmetic preferences or hypothetical improvements without
concrete harm.

The reviewed-increment section defines what the target range actually claims
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

When no unresolved finding remains, write:

```markdown
## Findings

No unresolved findings remain in the implementation review.
```

Keep the target, pass coverage, and review coverage so the boundary of that
conclusion remains reproducible. The OpenSpec artifacts and tracked work, not
this report, retain any remediation already handed off for later implementation.
