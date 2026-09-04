# Review Report Format

Use `<change-root>/review.md` for unresolved findings and applicable
human-accepted residual risks. It is current review evidence, not a schema
artifact, approval record, or review history.

## Keep Only Current Truth

- Remove a finding only when current evidence shows it is fixed or inapplicable,
  or the acceptance procedure below is complete. Unrelated edits and absence from
  fresh review output do not resolve it.
- Retain an entry whose evidence cannot be rechecked, stating the limitation.
- Keep accepted risks while their recorded scope and assumptions hold.
- Rewrite the assessment when conclusions change. Omit resolved findings,
  review-process bookkeeping, and duplicate summary tables.

On the initial audit, give each finding an `F<n>` identifier in report order.
During a re-audit, keep the identifier of every finding that still represents the
same root cause, even when this leaves gaps. Allocate new finding numbers above
the highest `F<n>` in the report being read, including originating-finding
references in accepted risks, before removing any entries. Preserve `AR<n>`
identifiers in their separate namespace and allocate new risk numbers above its
current maximum. Resolve later user requests against the current report.

## Separate Findings from Accepted Risks

1. Require the human's explicit acceptance. An agent recommendation, low
   likelihood, or remediation cost is insufficient.
2. Record the supported condition, impact, rationale, scope, and reopening
   conditions using the fields below. Ask for consequential terms that cannot be
   established from the human's decision and existing evidence.
3. If acceptance changes an OpenSpec source of truth, reconcile it through
   `openspec-update-change`. Acceptance that must outlive the change also needs a
   durable project decision record. Until required reconciliation is complete,
   keep the finding open and state the decision and remaining work. Do not edit
   planning solely to duplicate a change-scoped risk entry.
4. Replace the `F<n>` with a distinct `AR<n>` under `Accepted risks`. The condition
   remains; never duplicate it in both sections.

After a broad re-audit, reconcile accepted risks with fresh evidence: retain those
still applicable, remove conditions that no longer exist, and reopen those whose
scope, assumptions, or reopening boundary no longer holds. For a reopened risk,
remove the `AR<n>`, explain the invalidated boundary, and reuse its originating
`F<n>` if free and still representing the same root cause; otherwise assign a new ID.

## Result

Choose the first applicable result:

| Condition | Result |
|---|---|
| Any active finding remains | `Changes needed` |
| No active finding remains, but missing material evidence prevents a review conclusion | `Review incomplete` |
| The review scope was covered and no active finding remains | `No unresolved findings` |

Always disclose material coverage gaps. An unreadable essential contract prevents
a complete conclusion; an unavailable validation command alone need not, if the
artifacts support the review. Record missing access as a limitation and a required
artifact known to be absent as a finding.

Accepted risks do not count as active findings. Name them in the assessment and
handoff so a clean result is not mistaken for absence of known risk or approval
to run Apply.

## Suggested Shape

Adapt headings to project conventions when useful. Omit optional material rather
than creating empty sections.

```markdown
# OpenSpec Change Review: <change-name>

## Assessment

**Result:** Changes needed | Review incomplete | No unresolved findings

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

Use `critical`, `high`, `medium`, and `low` severity according to
[review-lenses.md](review-lenses.md).

The acceptance rationale should compare residual exposure with remediation cost
or trade-offs. Its scope and reopening conditions must let a later reviewer
determine whether acceptance still applies without guessing.

## A Clean Review

When the review is complete and no active finding remains, do not leave
placeholder findings, resolved findings, or implied concerns. Write:

```markdown
## Findings

No unresolved findings remain in the reviewed change artifacts and relevant
repository context.
```

For an incomplete review with no confirmed finding, say instead: "No findings
confirmed in the inspected material; review incomplete because <missing evidence
and affected area>." Retain `Accepted risks` only when an accepted condition
still applies.
