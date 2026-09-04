# Review Report Format

Use `<change-root>/review.md` as a concise statement of the current review result.
Record findings that still need resolution and human-accepted residual risks that
remain applicable. It is a companion report, not an OpenSpec schema artifact, an
approval record, or a history of review sessions.

## Keep Only Current Truth

- Rewrite the report when artifacts or conclusions change.
- Remove a finding once it has been fixed, no longer applies, or the human has
  explicitly accepted its residual risk.
- Preserve an existing finding unless current artifact evidence establishes one
  of those outcomes or the report records that explicit acceptance. Material
  edits elsewhere and absence from new review output are not resolutions.
- Do not preserve resolved findings, old assessments, decision history, or
  review-process bookkeeping.
- Keep an accepted risk visible while its condition remains within the recorded
  scope and assumptions and no reopening condition has occurred.
- Do not duplicate findings in a summary table.

On the initial audit, give each finding an `F<n>` identifier in report order.
During a re-audit, keep the identifier of every finding that still represents the
same root cause, even when this leaves gaps. Give a new finding the next number
after the highest identifier in the report being rewritten so an ID does not
change meaning across that rewrite. Preserve `AR<n>` identifiers in their
separate namespace and assign collision-free identifiers to newly accepted
risks.

## Separate Findings from Accepted Risks

- Explicit human acceptance resolves a finding in the review state without
  fixing or disproving the risky condition. Remove its `F<n>` entry and create a
  distinct `AR<n>` entry under `Accepted risks`; never keep the same condition in
  both sections.
- An agent may explain the remediation trade-off or recommend acceptance, but it
  must not record an accepted risk without the human's explicit decision.
- On every re-audit, review the full change surface independently of prior
  acceptance, then reconcile current evidence with each accepted risk. Retain an
  applicable `AR<n>` without creating a duplicate finding; remove it if the
  condition no longer exists; or return the condition to `Findings` if its scope,
  assumptions, or reopening boundary no longer holds.
- If an acceptance changes a product contract, architecture, or another OpenSpec
  source of truth, reconcile that artifact through `openspec-update-change`. Do
  not edit planning solely to duplicate a change-scoped accepted-risk entry.
- If the acceptance must govern work after the OpenSpec change is archived,
  require the entry to reference an appropriate durable project decision record.

## Result

Use one aggregate result:

- `Changes needed` when any active finding remains; or
- `No unresolved findings` when no active finding remains.

Accepted risks do not count as active findings, but the assessment and handoff
must name them so `No unresolved findings` is not mistaken for absence of known
residual risk. The result remains review evidence, not permission to run Apply.

## Suggested Shape

Adapt headings to project conventions when useful. Omit optional material rather
than creating empty sections.

```markdown
# OpenSpec Change Review: <change-name>

## Assessment

**Result:** Changes needed | No unresolved findings

<A short assessment of the change, its real blast radius, and whether anything
currently prevents implementation from being planned safely.>

**Validation:** <OpenSpec validation result and any important untested boundary>

## Findings

### F1 · High — <concise problem statement>

- **Evidence:** <specific artifact or code paths and the relevant facts>
- **Impact:** <concrete ambiguity, failure mode, rework, or operational risk>
- **Required change:** <observable outcome, without inventing an unresolved design>
- **Decision needed:** <human question and why it matters; omit when unnecessary>

## Accepted risks

### AR1 · <concise residual-risk condition>

- **Evidence:** <specific artifact or repository facts supporting the condition>
- **Potential impact:** <concrete failure, rework, or operational harm that remains possible>
- **Acceptance rationale:** <why remediation does not justify its cost or trade-offs>
- **Scope and assumptions:** <the exact boundary within which acceptance applies>
- **Reopen when:** <observable changes that invalidate the acceptance>
- **Acceptance authority:** <the human decision or its durable source>
- **Originating finding:** <original F identifier>
- **Decision record:** <durable project artifact; required when acceptance must
  outlive this OpenSpec change, otherwise omit>

## Review coverage

<A brief note naming the core review and the change-specific areas examined in
depth, such as data migration, security, telemetry, or rollout. This is not an
applicability matrix.>
```

Use `critical`, `high`, `medium`, and `low` severity according to plausible
impact. Do not create findings for cosmetic preferences without a concrete
consequence.

An accepted risk records a human decision about a supported condition, not a
weaker kind of finding. Its rationale must compare the residual exposure with the
cost or technical trade-offs of remediation. Its scope, assumptions, and
reopening conditions must let a later re-audit determine whether the acceptance
still applies without guessing.

## A Clean Review

When no active finding remains, do not leave placeholder findings, resolved
findings, or implied concerns. Write:

```markdown
## Findings

No unresolved findings remain in the reviewed change artifacts and relevant
repository context.
```

The assessment and coverage note should still make the scope and limits of that
conclusion clear. Retain the `Accepted risks` section when any accepted condition
still applies; omit it when none does. A report without active findings does not
authorize Apply or imply that no known residual risk remains.
