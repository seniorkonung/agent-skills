# Review Ledger Contract

Read this reference before creating or restructuring
`openspec/changes/<change>/review.md`. The ledger is the durable working memory
for a review that may span many sessions. Keep it as a curated view of current
truth, not a transcript, scratchpad, or second copy of the change artifacts.

## Location and Format

- Store exactly one ledger at `openspec/changes/<change>/review.md`.
- Keep it outside the OpenSpec artifact schema. Its existence does not mean the
  review is complete.
- Use relative repository paths and line references for evidence.
- Do not add YAML frontmatter. The Markdown itself is the human-readable source
  of truth.

## State Model

Use exactly one of these review states:

| State | Meaning |
|---|---|
| `auditing` | At least one applicable lens is pending, in progress, or stale. |
| `remediating` | The breadth-first audit is current and findings are being resolved. |
| `blocked-on-human` | No safe progress remains until the human answers a consequential question. |
| `ready-for-human-decision` | Coverage is current and no finding remains open, under investigation, or blocked. This is not approval to Apply. |

Use these coverage states:

| State | Meaning |
|---|---|
| `pending` | The lens is applicable but has not been reviewed. |
| `in-progress` | Review work has begun but is not complete enough to trust. |
| `reviewed` | The lens was checked against the recorded input fingerprints. |
| `stale` | A reviewed input changed in a way that may invalidate the conclusion. |
| `not-applicable` | Evidence shows the lens does not affect this change. |

Use only these finding severities: `critical`, `high`, `medium`, and `low`.
Do not create findings for cosmetic preferences that have no plausible impact.

Use exactly these finding statuses:

| Status | Meaning |
|---|---|
| `open` | The problem is understood but not yet being resolved. |
| `investigating` | Research or artifact work is active and the outcome is not settled. |
| `blocked-on-human` | Resolution requires a consequential human decision. |
| `resolved` | The required outcome is present and supported by fresh evidence. |
| `accepted` | The human explicitly accepts the residual risk without full remediation. |
| `deferred` | The human explicitly moves remediation out of this change. |

Only the human may authorize `accepted` or `deferred`. Record the decision,
rationale, and date. Agent inference, low severity, time pressure, or silence are
not authorization.

## Fingerprints and Freshness

Track every reviewed OpenSpec artifact and any other file whose contents support
a review conclusion. Prefer a Git blob fingerprint such as:

```sh
git hash-object --no-filters -- path/to/file
```

If Git is unavailable, use another deterministic content hash and record the
method. A timestamp is not a content fingerprint.

The recorded value means "this exact content was reviewed," not merely "this
content existed during the session." On resume:

1. Recompute every fingerprint and discover added or removed artifacts.
2. Mark the changed input `stale`.
3. Mark every coverage row whose evidence or conclusion may depend on it
   `stale`; be conservative when dependency impact is unclear.
4. Return the overall review to `auditing` before continuing remediation.
5. Replace the fingerprint only after the affected coverage has been reviewed
   again.

Changes made by the reviewer also create staleness. Editing an upstream artifact
normally invalidates downstream coherence, task, and verification coverage.

## Stable Finding Identity

- Assign monotonically increasing IDs in the form `REV-001`, `REV-002`, and so
  on.
- Never renumber, reuse, or delete an ID because a finding was resolved,
  rejected, merged, or superseded.
- If two findings are duplicates, keep both IDs and mark one resolved by the
  other.
- If a resolved problem recurs after later edits, reopen its original ID when it
  is materially the same problem. Create a new ID when the impact or required
  outcome is different.
- Keep the summary table and detailed entries synchronized.

## Required Document Shape

Use this semantic structure. The headings and human-facing field labels below
are examples; adapt them to the target project's conventions. Omit empty
optional paragraphs, but preserve exact status values and finding IDs.

```markdown
# OpenSpec Change Review: <change-name>

- **Change:** `<change-name>`
- **Schema:** `<resolved-schema-name or unknown>`
- **Review state:** `auditing`
- **Last updated:** `<ISO-8601 date or timestamp>`
- **Apply authority:** Human only; this ledger never authorizes Apply

## Current Assessment

**Blast radius:** <affected capabilities, modules, data, interfaces, and operations>

**Risk summary:** <the few risks that determine review depth>

**Readiness:** <what prevents or permits ready-for-human-decision>

**Validation boundary:** <OpenSpec validation result and any untested boundary>

## Reviewed Inputs

| Input | Kind | Last-reviewed fingerprint | State | Notes |
|---|---|---|---|---|
| `openspec/changes/example/proposal.md` | artifact | `<hash>` | `current` | Intent and scope source |

## Coverage Map

| Lens | Applicability | Status | Evidence | Findings |
|---|---|---|---|---|
| Intent and scope | applicable: <reason> | `reviewed` | <paths/lines or repository evidence> | `REV-001` or none |

## Findings Summary

| ID | Severity | Status | Lens | Title |
|---|---|---|---|---|
| `REV-001` | `high` | `open` | Data and migrations | <concise problem statement> |

## Findings

### REV-001 - <concise problem statement>

- **Lens:** <lens name>
- **Severity:** `high`
- **Status:** `open`
- **Evidence:** <specific artifact/code path and relevant fact>
- **Impact:** <concrete failure, ambiguity, or avoidable risk>
- **Affected artifacts:** <relative paths>
- **Required outcome:** <observable condition for resolution, not an assumed implementation>
- **Human decision:** Not required, or <question and why the answer changes the plan>
- **Resolution evidence:** Not resolved, or <fresh evidence that proves the outcome>

## Next Action

<One concrete next audit, research, decision, or remediation action.>

## Decision History

- `<date>` - `<finding or review state>` - <durable decision and rationale>
```

The reviewed-input state uses `current`, `stale`, `missing`, or `new`; it is
separate from coverage and finding states.

## Maintaining the Ledger

Update the ledger at semantic checkpoints: after completing a lens, recording a
finding, receiving a human decision, changing an artifact, or proving a
resolution. Do not wait until the end of a long session to preserve review
state.

Keep the document compact:

- Rewrite `Current Assessment` when the situation changes; do not append old
  assessments.
- Record conclusions from research with their sources, not a turn-by-turn search
  log.
- Keep one `Next Action`; replace it when progress changes.
- Preserve only durable human and architectural choices in `Decision History`.
- Collapse a resolved finding to its problem, severity, final status, affected
  artifacts, and resolution evidence when its intermediate investigation no
  longer helps future work.
- Keep accepted or deferred findings detailed enough for a future reader to see
  the residual risk and the human's rationale.

## Transition Rules

Move from `auditing` to `remediating` only when every known lens is `reviewed` or
`not-applicable` and all reviewed-input fingerprints are current.

Move to `blocked-on-human` only when no safe audit, research, or remediation work
can continue without a human answer. A single blocked finding does not stop work
on independent lenses or findings.

Move to `ready-for-human-decision` only when:

- every applicable lens is `reviewed` against current inputs;
- every finding is `resolved`, `accepted`, or `deferred`;
- accepted and deferred findings carry explicit human decisions;
- OpenSpec structural validation passed, or its absence/failure was explicitly
  handled as a finding rather than hidden;
- the artifact graph and tasks are coherent after the last remediation.

`ready-for-human-decision` means the ledger is ready for human judgment. It must
never be described as approval, sign-off, or permission to run Apply.
