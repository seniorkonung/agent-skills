# ADR Format

Use the project's existing ADR directories, naming convention, document format,
and status vocabulary. When none exist, use `docs/adr/` for the relevant scope
and sequential filenames such as `0001-slug.md`. Keep system-wide and
context-specific decisions in their respective directories.

Create a directory and its `README.md` index when the first ADR is needed. For an
existing directory without an index, create the index when working on its ADRs.

## When to record a decision

Offer an ADR when a decision materially shapes the system or its domain and a
future reader would benefit from knowing its reasons, constraints, or trade-offs.
Costly reversal, a surprising choice, and meaningful alternatives are useful
signals, not three mandatory conditions.

Typical subjects include architectural shape, context ownership and integration,
technology commitments, deliberate deviations from expected practice, and
non-obvious rejected alternatives. An external constraint can justify recording
the resulting decision even when it leaves no practical alternative. For
example, explain how a residency constraint determines deployment placement;
keep detailed compliance requirements in the appropriate specification.

Skip routine choices whose reasons are obvious and operational rules that belong
in a specification. This filter guides proactive suggestions; honor an explicit
request to document a particular decision or maintain an existing ADR.

## Template

```md
---
status: proposed
---

# {Short title of the decision}

{1-3 sentences: what's the context, what did we decide, and why.}
```

The body can be a single paragraph. For a proposal, describe the proposed choice
without implying it has been adopted. Use `accepted` when the conversation or
existing records establish that the decision was made; otherwise use `proposed`.
Do not require a second approval for an already agreed decision.

Every new ADR has an explicit status, using the project's existing representation
or the frontmatter above. Add considered options or consequences when they
explain a meaningful trade-off or a non-obvious effect; omit empty sections.

## Status and history

Use the project's vocabulary when established. Otherwise:

| Status | Meaning |
|---|---|
| `proposed` | Under consideration; not yet adopted. |
| `accepted` | Adopted as the decision; implementation may still be pending. |
| `rejected` | Considered and declined. |
| `deprecated` | No longer applicable, with no replacement decision. |
| `superseded` | Replaced by another accepted decision. |

Change status when supported by the discussion or recorded evidence. Status
describes the decision's lifecycle, not implementation progress.

Refine proposals in place. Preserve the original rationale of accepted and
historical decisions: factual corrections and status updates are appropriate,
but a changed decision needs a new ADR rather than a rewritten history.

When proposing a replacement, link it to the old ADR while keeping the old status
until the replacement is adopted. On adoption, mark the old ADR `superseded` and
add a relative link to its replacement; the replacement links back to the old ADR.
For deprecation or rejection, record a brief reason. Keep historical ADRs in the
directory and index.

## README index

Maintain `README.md` beside the ADR files as the entry point for that directory.
Use or update an ADR index section in an existing README, preserving other prose
and navigation. The ADR is the source of truth; the index summarizes its current
title, decision, status, and replacement. Preserve additional useful index columns
already present in the project.

Include one row per ADR in that directory, including proposed, rejected, and
historical records. Use a linked number and title, a short summary that conveys
the choice beyond its title, the status, and a replacement link when applicable.
Keep the established ordering, or order by ADR number. For example, when the
referenced records exist:

```md
# Architecture Decision Records

| ADR | Decision summary | Status | Replaced by |
|---|---|---|---|
| [0001 — Order notifications](0001-order-notifications.md) | Call Billing synchronously after order confirmation. | superseded | [0007](0007-order-events.md) |
| [0007 — Order events](0007-order-events.md) | Publish confirmed orders for Billing to process asynchronously. | accepted | — |
```

When creating the index, inventory all existing ADRs in that directory, not just
the current session's additions. Exclude templates and supporting documents.
Read each record for its summary and status. Show `unspecified` when a legacy
record has no status; do not infer acceptance from its age, filename, or presence
in the directory. This label denotes missing metadata, not a new lifecycle state.
Surface ambiguous status evidence rather than inventing certainty.

Whenever creating or editing an ADR, changing status, or replacing a decision,
update affected rows and reconcile the directory's index in the same change.
Update existing rows instead of appending duplicates. For a replacement spanning
directories, update both indexes and use relative paths that identify each ADR
unambiguously. Standalone index maintenance reads the ADRs and repairs the index;
it does not change decisions to match stale rows.

## Numbering and checks

Under the default naming convention, scan actual ADR filenames in the selected
directory for the highest number and increment it. Numbering is local to each
directory; preserve existing identifiers and gaps. Use paths in cross-context
references because another directory may contain the same number.

Before finishing, check that every ADR in each affected directory has exactly one
index row, local links resolve, summaries and statuses match their records, and
replacement links connect the old and new ADRs. Verify that existing README
content and historical decision rationale were preserved.
