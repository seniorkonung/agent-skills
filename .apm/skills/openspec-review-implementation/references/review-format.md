# Implementation Review Report Format

Use `<change-root>/implementation-review.md` for the active OpenSpec change's
current review state. Record the latest immutable review target, findings that
still need an explicit resolution, and human-accepted residual risks that remain
applicable. The report is not review history or approval to push, merge, archive,
or accept risk.

## Record Supported Conclusions

Run the independent decision pass first. Once its reviewers have returned, or
isolation is declared unavailable, reconcile existing state as described below.
Then create or rewrite the report as soon as a finding has repository evidence,
concrete impact, a required outcome, and an earliest source of truth. Do not wait
for conformance and code-quality passes to finish before recording a supported
finding. Mark every unfinished pass `Incomplete` in intermediate reports.

Before the first write, read the existing report in the orchestrator context
after the fresh decision reviewers have returned or are unavailable. Carry
forward a supported finding unless this review resolves it explicitly. Never
expose the report or earlier findings to an isolated reviewer. Excluding the
report from the Git target prevents a re-review loop; it does not exclude it as current
review state. Preserve carried `F<n>` and `AR<n>` IDs in their separate
namespaces, and assign collision-free IDs to new entries.

Completing a pass alone does not justify a report write. Do not use the report as
a scratchpad, progress log, or store for suspicions and reviewer transcripts. If
no substantive finding is established during the passes and no earlier finding
needs to be carried forward, write the clean report only when finalizing the
review.

When later evidence reveals another symptom of the same root cause, update the
existing finding instead of adding a duplicate. Revise or remove a recorded
finding when the evidence changes or disproves it.

## Separate Findings from Accepted Risks

- A finding remains until it has an explicit resolution. A different or narrower
  target, a moved head, or its absence from new reviewer output is not a
  resolution.
- Resolution may come from repository evidence that fixes or disproves the
  problem, or from a concrete remediation decision durably captured in the
  appropriate OpenSpec sources of truth, with any remaining implementation owned
  by concrete tracked work.
- A vague task promising to fix the area, or a completed checkbox contradicted by
  code, does not establish ownership. The agreed required outcome and remaining
  work must be identifiable in the cited artifacts.
- Once those artifacts own the required outcome, remove the finding; they become
  the source of truth for later implementation.
- Explicit human acceptance of the residual risk is also a resolution of the
  finding, but it does not fix or disprove the risky condition. Remove the
  `F<n>` entry and record the decision under `Accepted risks` with a distinct
  `AR<n>` ID. Never retain the same condition in both sections.
- An agent may explain the remediation trade-off or recommend acceptance, but it
  must not create an accepted-risk entry without the human's explicit decision.
- Preserve a finding outside the current target and disclose that it was carried
  forward rather than re-reviewed.
- Keep an accepted risk while its condition remains within the recorded scope and
  assumptions and no reopening condition has occurred. On a later review,
  reconcile fresh evidence against accepted risks only after isolated reviewers
  return: retain an applicable `AR<n>` without creating a duplicate finding;
  remove it if the condition no longer exists; or return the condition to
  `Findings` if its acceptance boundary no longer holds. An accepted risk never
  prevents independent review of the implementation.
- If an acceptance must govern work after the OpenSpec change is archived,
  require the accepted-risk entry to reference an appropriate durable project
  decision record.
- Do not retain resolved findings, closure records, reviewer transcripts,
  duplicate summaries, or empty sections.

## Result

Use one aggregate result:

- `Changes needed` when any active finding remains;
- `Incomplete` when no active finding remains but any required pass, target
  boundary, or verification step was incomplete; or
- `No unresolved findings` only when decision, conformance, and code-quality
  passes all completed on the recorded immutable range and no active finding
  remains.

This order is the precedence. A review with both findings and incomplete coverage
uses `Changes needed`; the pass table preserves the coverage limitation.
Accepted risks do not count as active findings, but the assessment and handoff
must name them so `No unresolved findings` is not mistaken for absence of known
residual risk.

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
- **Current target relation:** Carried forward; not re-reviewed | <omit when the
  finding was reviewed in the current target>

## Accepted risks

### AR1 · <concise residual-risk condition>

- **Evidence:** <specific paths, behavior, and repository facts>
- **Potential impact:** <concrete failure or engineering harm that remains possible>
- **Acceptance rationale:** <why remediation does not justify its cost or trade-offs>
- **Scope and assumptions:** <the exact boundary within which acceptance applies>
- **Reopen when:** <observable changes that invalidate the acceptance>
- **Acceptance authority:** <the human decision or its durable source>
- **Originating finding:** <original F identifier>
- **Decision record:** <durable project artifact; required when acceptance must
  outlive this OpenSpec change, otherwise omit>
- **Current target relation:** Carried forward; not re-reviewed | <omit when the
  accepted risk was reconciled against the current target>

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

For new or re-evaluated evidence, cite paths and lines at the recorded commit,
using the base for deleted content. For a carried finding or risk, retain its
original evidence revision and the `Current target relation` field; do not make
old line numbers look freshly verified against the current head.

An accepted risk records a decision about a supported condition, not a weaker
kind of finding. Its rationale must compare the residual exposure with the cost
or technical trade-offs of remediation. Its scope, assumptions, and reopening
conditions must be concrete enough for a later review to decide whether the
acceptance still applies without guessing.

## A Clean Review

When no active finding remains, write:

```markdown
## Findings

No unresolved findings remain in the implementation review.
```

Keep the target, pass coverage, and review coverage so the boundary of that
conclusion remains reproducible. Retain the `Accepted risks` section when any
accepted condition still applies; omit it when none does. The OpenSpec artifacts
and tracked work, not this report, retain any remediation already handed off for
later implementation.
