---
name: openspec-review-implementation
description: Reviews a committed range ending at HEAD against an active OpenSpec change, preserves unresolved engineering and conformance findings across bounded reviews, and hands remediation decisions into OpenSpec artifacts and tracked work. Use after Apply commits, for re-audit, or to plan remediation; not for uncommitted work, an initial proposal review, or implementation itself.
---

# OpenSpec Review Implementation

Review the committed `base..HEAD` range requested by the user, defaulting to the
complete range that would be pushed from the current branch. Judge engineering
soundness, OpenSpec conformance, and ordinary code quality. Keep the current
unresolved review state in `<change-root>/implementation-review.md`.

The report is evidence, not approval to push, merge, archive, or accept risk.

## Boundaries

- Review committed changes only; exclude staged, unstaged, and untracked work.
- Exclude `implementation-review.md` so committed review evidence does not create
  a re-review loop.
- Review one active OpenSpec change at a time. Do not guess when the range touches
  several changes.
- During an audit, write only `implementation-review.md`.
- During remediation, never edit code or tests or invoke Apply. Reconcile planning
  only through `openspec-update-change`, then return implementation to the user.
- A bounded review may add or re-evaluate findings in its target, but it cannot
  clear an earlier finding merely because that finding is outside the target.
- Ask the human before settling consequential product, contract, architecture,
  data, security, privacy, cost, or residual-risk decisions.
- The decision reviewer must be isolated. The orchestrator is not: it must
  understand the complete change before producing a neutral intention brief.

## 1. Resolve the Target

Read [references/review-target.md](references/review-target.md), then run from the
repository root:

```sh
node "<skill-root>/scripts/discover-review-target.mjs"
```

Use the helper's exact result. Do not broaden the target, claim that a local
upstream is live, or fetch without the user's request.

The configured upstream is the default baseline. Use a different local baseline
only when the user explicitly requests that bounded committed range. Narrowing
the target limits new review work; it does not resolve earlier findings.

`reviewablePaths` is the authoritative inventory from the recorded Git diff.
`pathsOutsideChangeRoot` is only a location hint. Classify every path by its
actual role: planning evidence, delivery behavior, tests, configuration,
migrations, documentation, or unrelated work. Record the exact delivery-path
subset. Keep every path visible as planning evidence, part of a review unit, or
unmapped.

If no path contains implementation or delivery behavior, route to
`openspec-review-change`; do not issue a clean implementation result.

## 2. Understand the Change

After discovery, refresh:

```sh
openspec status --change "<name>" --json
openspec instructions apply --change "<name>" --json
```

The second command is read-only; it does not invoke Apply. Use the returned
`changeRoot`, `schemaName`, artifact graph, action context, tracked progress,
tasks, project context, operation guidance, and canonical specs. Follow relevant
references far enough to understand why the outcomes and constraints exist.

If planning sources conflict or leave consequential intent unclear, preserve the
uncertainty and ask for the smallest human decision that resolves it. Do not
choose the interpretation that best fits the implementation.

## 3. Map the Reviewed Increment

The active change provides context, not the scope delivered by the reviewed
range. From the immutable `base..head` diff, map changed delivery behavior to the
work items, requirements, and scenarios it claims to implement.

- Do not add unchanged files to the target. Inspect unchanged callers and
  dependencies only as context for changed behavior.
- Treat task edits and completion marks as candidates, not proof. Include an
  unchanged task when the implementation clearly delivers it; expose code that
  maps to no task.
- Do not require untouched future tasks merely because they belong to the same
  change.

Create one or more review units. Each unit records:

- its intended outcome and affected actor or system boundary;
- attributable work-item and requirement/scenario IDs or stable labels;
- implementation and test evidence in the immutable diff;
- applicable change-wide constraints and non-goals; and
- ambiguous mappings, unmatched code, and explicitly excluded nearby scope.

Cross-check both directions: every included work item needs reviewed delivery or
verification evidence, and every material delivery path must map to a unit or be
disclosed as unmatched or unrelated.

Keep work in one unit when it serves the same outcome and boundary. Use separate
units for materially distinct outcomes. Path-disjoint units receive separate
decision reviewers. If units share a changed path, keep their outcome mappings
separate but use one reviewer with a combined brief and the union of their full
path lists; Git targets cannot isolate hunks. Ask the human about consequential
mapping ambiguity, or mark the affected independent pass `Incomplete`.

## 4. Record Supported Findings

Read [references/review-format.md](references/review-format.md) before the review
passes and follow it as the report contract.

Write or rewrite the report as soon as repository evidence establishes a
finding's evidence, impact, required outcome, and earliest source of truth. Do
not write merely because a pass finished, and do not store suspicions, private
notes, transcripts, or session history. Merge, revise, or remove findings as
later evidence changes the conclusion. Write a clean report only at finalization.

After all fresh decision reviewers return and before the first report write, read
the existing report in the orchestrator context. Carry forward every finding
that still lacks the explicit resolution defined by the report contract. Never
treat absence from the current reviewer output as counter-evidence.

Immediately before every report write, confirm that `HEAD` and the recorded local
baseline still resolve to the recorded head and base. If either moved, rediscover
and review the new target.

## 5. Run Three Passes

### Independent decision review

For each review unit, synthesize a mechanism-neutral intention brief from the
complete artifact graph and increment map. For path-overlapping units, include a
complete intention section per unit and one shared target.

Classify source material as:

- **Intent:** problem, desired outcome, and affected boundary;
- **Binding constraints:** externally imposed limits, or `none known`;
- **Non-goals:** explicit outcome or scope exclusions; or
- **Reviewer-excluded context:** tasks, technologies, architecture, algorithms,
  expected files, selected-solution rationale, prior findings, and preferred
  fixes.

Cross-check the first three categories against the complete artifact graph. Do
not turn a documented design choice into a binding constraint.

Each brief must contain `Problem`, `Desired outcome`, `Affected boundary`,
`Binding constraints`, optional `Non-goals`, and an exact `Review target` with
repository root, immutable base and head, and the unit's complete path list from
`reviewablePaths`. If conflict or missing intent prevents an accurate brief,
leave the pass `Incomplete` rather than filling the gap from code or rationale.

Use a fresh zero-history reviewer following `implementation-decision-review` for
each path-disjoint unit or overlap group. Give it only the applicable brief and
repository root. That skill owns diff reconstruction, context-path checks, and
the prohibition on rediscovery or target widening. If it needs another changed
path, correct the unit or mark the pass `Incomplete`; the reviewer must not widen
its own target.

Do not expose planning artifacts, commit history, the report, prior findings,
implementation discussion, or private source notes. If isolated review is
unavailable, continue the other passes but mark this pass `Incomplete`. A
non-isolated pass may add findings, but cannot produce a clean result or clear an
earlier finding.

### OpenSpec conformance

Using the loaded artifact graph, verify that:

- mapped requirements and scenarios have implementation and test evidence;
- changed completion or verification claims are supported by the range;
- code, requirements, design, tasks, and verification agree in both directions;
- future tasks are not treated as obligations of this increment;
- relevant behavior, failures, compatibility, migration, operations, and
  documentation obligations are covered; and
- unrelated work in the reviewed target remains explicit.

Use the project's verification workflow when available; otherwise perform the
checks directly and disclose the limitation. Run
`openspec validate "<name>" --json` as structural evidence, not proof of
correctness.

### Code quality

In the orchestrator context, use `code-review-and-quality` when available to
review the complete delivery-path subset. Apply only its correctness,
readability, architecture, security, performance, and evidence lenses. This
skill retains ownership of target, severity, findings, and aggregate result; do
not import approval language or the supporting skill's verdict categories.
If it is unavailable, apply the same five lenses directly and disclose that
limitation.

Inspect affected callers, tests, configuration, data paths, and runtime
boundaries far enough to substantiate findings without expanding into unrelated
cleanup.

## 6. Finalize

Verify every cited fact. Merge duplicate symptoms from different passes; keep
distinct root causes separate. For each finding, identify the earliest source of
truth: implementation/tests, task/verification, design/ADR,
requirement/proposal, or a separate change with different intent or material new
scope.

A documented choice does not rebut an engineering problem. Narrow or remove a
finding from review evidence when evidence disproves its failure mode or supplies
a binding constraint. A concrete remediation decision captured in the
appropriate OpenSpec artifacts, with concrete tracked work for any remaining
implementation, resolves ownership of the finding and removes it from this
report. Human acceptance changes disposition, not evidence.

Finalize the report and aggregate result according to
[references/review-format.md](references/review-format.md). It must describe the
current target and unresolved review state without resolved findings, duplicate
symptoms, or review history. Clearly identify a finding carried forward from
outside the current target.

## Address Findings When Asked

For requests such as `fix F2`, read
[references/remediation.md](references/remediation.md) and prepare planning and
tracked work for later implementation. Never implement the finding. Remove it
from the report once the agreed remediation is durably owned by the appropriate
artifacts and any remaining implementation has concrete tracked work, then hand
those work items to the user.

## Handoff

Report the baseline and reviewed head, selected change, review units and work
items, aggregate result, highest-impact findings or their absence, unresolved
decisions, excluded worktree state, validation and verification evidence,
isolation limitations, planning handoff state, and report path. Leave push,
merge, archive, implementation, and risk acceptance to the human.

## Verification

Before reporting:

- the immutable target matches the helper result, defaults to every outgoing
  commit, and contains no worktree changes or review report;
- helper evidence or an explicit association identifies one change, and every
  reviewable path remains classified and visible;
- every included work item has evidence, every material delivery path is mapped
  or disclosed, and future work is not treated as current scope;
- each independent reviewer received only a neutral brief and exact bounded
  target in a fresh context, while all three passes covered the same range;
- every finding follows the report contract and the report matches the current
  base and head without dropping unresolved findings outside that target;
- remediation used `openspec-update-change` and changed no code, tests, Apply
  state, or implementation, and removed a finding only after a durable planning
  handoff; and
- no push, merge, archive, or risk-acceptance approval was implied.

When changing this skill, run the bundled discovery tests and evaluate the
realistic routing and workflow cases in
[references/evaluation-cases.md](references/evaluation-cases.md).
