---
name: openspec-review-implementation
description: Reviews a committed range ending at HEAD against an active OpenSpec change, preserves unresolved findings and human-accepted residual risks across bounded reviews, and hands remediation decisions into OpenSpec artifacts and tracked work. Use after Apply commits, for re-audit, or to resolve review findings; not for uncommitted work, an initial proposal review, or implementation itself.
---

# OpenSpec Review Implementation

Review the committed `base..HEAD` range requested by the user, defaulting to the
complete range that would be pushed from the current branch. Judge engineering
soundness, OpenSpec conformance, and ordinary code quality. Keep the current
unresolved findings and applicable accepted-risk decisions in
`<change-root>/implementation-review.md`.

The report is evidence, not approval to push, merge, archive, or accept risk.

The three passes answer different questions:

| Pass | Question | Context |
|---|---|---|
| Independent decision review | Is this a sound way to achieve the outcome? | Neutral intention brief and bounded code target, in a fresh context |
| OpenSpec conformance | Does this increment deliver what its planning claims? | Complete change context and mapped increment |
| Code quality | What concrete defects or maintenance costs does the change introduce? | Changed delivery paths and affected surroundings |

You coordinate the review and own its report. `implementation-decision-review`
owns the isolated engineering assessment. A solution can conform to its design
and still be unsound; passing one review does not substitute for another.

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
- Ask the human when an unresolved product, contract, architecture, data,
  security, privacy, cost, or residual-risk choice changes the correct outcome.
  Reuse decisions already supplied; ordinary review judgments do not need approval.
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

Use the recorded full base and head IDs for every diff and file read. Follow the
snapshot and verification rules in `review-target.md`; a clean Git diff does not
make ordinary worktree reads evidence about those commits.

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

The CLI describes the current checkout. Read versioned planning evidence from
the recorded head, using CLI paths to locate it. Disclose uncommitted planning
differences; do not silently use them to justify the committed implementation.
If current metadata cannot identify the committed artifacts, mark conformance
and any dependent intention brief `Incomplete` and name the missing evidence.

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
path lists. This protocol uses whole-file boundaries, so a shared file must not
be divided into competing hunk-level targets. Ask the human about consequential
mapping ambiguity, or mark the affected independent pass `Incomplete`.

## 4. Run the Independent Decision Review

Read [references/review-format.md](references/review-format.md) before the review
passes and follow it as the report contract.

Read [references/intention-brief.md](references/intention-brief.md) and prepare a
mechanism-neutral brief for each review unit or overlap group. Derive it from
the complete artifact graph and increment map. Include the problem, desired
outcome, affected boundary, binding constraints, relevant non-goals, and exact
repository, commit IDs, and assigned delivery paths. Keep planning paths out of
the reviewer's target. If intent is missing or conflicting, mark the affected
review incomplete rather than selecting the interpretation that fits the code.

Use a fresh zero-history reviewer following `implementation-decision-review` for
each path-disjoint unit or overlap group. Give it only the applicable brief and
repository root. That skill owns diff reconstruction, context-path checks, and
the prohibition on rediscovery or target widening. If it needs another changed
path, correct the unit or mark the pass `Incomplete`; the reviewer must not widen
its own target.

Do not expose planning artifacts, commit history, the report, prior findings,
accepted risks, implementation discussion, or private source notes. If isolated
review is unavailable, continue the other passes but mark this pass `Incomplete`.
A substitute decision pass in the existing context may add findings, but cannot
produce an independent clean result or clear an earlier decision finding.

A reviewer's `Changes needed` does not mean its coverage was complete. Read its
coverage and limitations separately; mark this pass complete only when every
unit or overlap group has complete independent coverage.

## 5. Record Findings and Complete the Other Passes

After all fresh reviewers return, or isolation is declared unavailable, read the
existing report in your context. Preserve unresolved findings and applicable
accepted risks before reconciling new observations. The report is current state,
even though it is excluded from the code target. Never send it to a reviewer.

Verify returned findings against repository evidence and identify their impact,
required outcome, and earliest source of truth. Write supported findings now;
then update them as conformance and code-quality evidence becomes available.
Follow `review-format.md` for write timing, IDs, carry-forward, accepted risks,
and resolution. Keep unfinished passes `Incomplete` in each intermediate report.
If there are no findings to record, write the clean report only at finalization.

Immediately before each report write, confirm that `HEAD` and the recorded local
baseline still resolve to the recorded head and base. If either moved,
rediscover and review the new target before replacing the report. Preserve any
supported findings from the superseded target until explicitly resolved.

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

A documented choice does not rebut an engineering problem. A binding constraint
may disprove a proposed alternative without disproving the failure itself;
recheck the finding's reasoning before narrowing or removing it.

Apply the resolution rules in `review-format.md`. Here, resolving a finding can
mean that agreed remediation has a durable planning owner; it does not always
mean the code is fixed. Distinguish verified correction, planning handoff, and
explicit human risk acceptance in the handoff. Never infer acceptance yourself.

Finalize the report and aggregate result according to
[references/review-format.md](references/review-format.md). It must describe the
current target, unresolved findings, and applicable accepted risks without
resolved findings, duplicate symptoms, or review history. Clearly identify a
finding carried forward from outside the current target. Accepted risks do not
count as active findings, but must remain visible in the assessment and handoff.

## Resolve Findings When Asked

For requests such as `fix F2` or `accept F2 as residual risk`, read
[references/remediation.md](references/remediation.md). Never implement the
finding. For remediation, remove it once the agreed outcome is durably owned by
the appropriate artifacts and any remaining implementation has concrete tracked
work, then hand those work items to the user. For explicit human acceptance,
move the finding to a collision-free `AR<n>` entry without claiming that its
condition was fixed or disproved.

## Handoff

Report the baseline and reviewed head, selected change, review units and work
items, aggregate result, highest-impact findings or their absence, applicable
accepted risks, unresolved decisions, excluded worktree state, validation and
verification evidence, isolation limitations, planning handoff state, and report
path. Leave push, merge, archive, implementation, and risk acceptance to the
human.

## Verification

Before reporting, check the boundaries most likely to produce a false conclusion:

- **Target:** evidence belongs to the recorded commits; every changed path has a
  role, and future work was not mistaken for missing delivery.
- **Coverage:** reviewer isolation and pass completion are supported, and missing
  verification remains visible even when findings already exist.
- **State:** no unresolved finding disappeared merely because the target changed;
  accepted risks have human authority and are not duplicated as active findings.
- **Handoff:** planning ownership, verified correction, and risk acceptance are
  distinguished; the report does not authorize implementation or release.

When changing this skill, run the bundled discovery tests and evaluate the
realistic routing and workflow cases in
[references/evaluation-cases.md](references/evaluation-cases.md).
