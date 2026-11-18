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

## Write the Report

Fill [the report template](../assets/review-template.md), preserving its structure.
Replace placeholders with evidence, repeat entry blocks as needed, and omit
inapplicable optional fields and sections. Use the validator's diagnostics to
correct format errors.

Set coverage from the evidence actually reviewed; explain missing material
coverage in `Coverage limitations`. Preserve findings, accepted risks, IDs, and
evidence when updating an older report. Do not invent evidence or drop review
state to satisfy the validator; it checks recorded structure, not the truth of
the review.

Copy the full commit and path arrays from discovery into the target. Keep each
reviewable path accounted for as planning evidence, part of a review unit, or
unmapped. Use `[]` for work-item or requirement labels only when their mapping
cannot be established; explain that uncertainty rather than inventing IDs.

Set `Target scope` to `User-requested bounded range`, including when endpoints
came from clear context. The legacy value `Complete pre-push range` remains
supported for existing reports.

Cite paths and lines at the recorded base/head in current evidence. For a carried
finding or risk, preserve its original evidence revisions and `Current target
relation`; omit that field when the entry was re-evaluated in the current target.

Keep required outcomes focused on closure; put implementation ideas in remediation
plans or tasks unless an example clarifies the valid solution space.

With no active findings, keep `Findings` and use the matching sentence:

- Complete coverage: `No unresolved findings remain in the implementation review.`
- Incomplete coverage: `No findings confirmed; review incomplete.`

For programmatic consumption or validator maintenance only, read
[validator-interface.md](validator-interface.md).
