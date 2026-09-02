# Review Report Format

Use `<change-root>/review.md` as a concise statement of the current review result.
It is a companion report, not an OpenSpec schema artifact, an approval record, or
a history of review sessions.

## Keep Only Current Truth

- Rewrite the report when artifacts or conclusions change.
- Remove a finding once it has been fixed or no longer applies.
- Preserve an existing finding unless current artifact evidence establishes one
  of those outcomes. Material edits elsewhere and absence from new review output
  are not resolutions.
- Do not preserve resolved findings, old assessments, decision history, or
  review-process bookkeeping.
- Keep a risk visible while it still exists, even when the human knowingly
  chooses not to address it in this change.
- Do not duplicate findings in a summary table.

On the initial audit, give each finding an `F<n>` identifier in report order.
During a re-audit, keep the identifier of every finding that still represents the
same root cause, even when this leaves gaps. Give a new finding the next number
after the highest identifier in the report being rewritten so an ID does not
change meaning across that rewrite.

## Suggested Shape

Adapt headings to project conventions when useful. Omit optional material rather
than creating empty sections.

```markdown
# OpenSpec Change Review: <change-name>

## Assessment

**Result:** Changes needed | No substantive findings

<A short assessment of the change, its real blast radius, and whether anything
currently prevents implementation from being planned safely.>

**Validation:** <OpenSpec validation result and any important untested boundary>

## Findings

### F1 · High — <concise problem statement>

- **Evidence:** <specific artifact or code paths and the relevant facts>
- **Impact:** <concrete ambiguity, failure mode, rework, or operational risk>
- **Required change:** <observable outcome, without inventing an unresolved design>
- **Decision needed:** <human question and why it matters; omit when unnecessary>

## Review coverage

<A brief note naming the core review and the change-specific areas examined in
depth, such as data migration, security, telemetry, or rollout. This is not an
applicability matrix.>
```

Use `critical`, `high`, `medium`, and `low` severity according to plausible
impact. Do not create findings for cosmetic preferences without a concrete
consequence.

## A Clean Review

When no substantive problem remains, do not leave placeholder findings, resolved
findings, or implied concerns. Write:

```markdown
## Findings

No substantive findings were found in the reviewed change artifacts and relevant
repository context.
```

The assessment and coverage note should still make the scope and limits of that
conclusion clear. A clean report means the review found no current issue; it does
not authorize Apply.
