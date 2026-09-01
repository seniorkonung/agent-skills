---
name: openspec-review-implementation
description: Reviews the committed pre-push range against an active OpenSpec change, records actionable engineering and conformance findings, and prepares findings for later implementation. Use after Apply commits, for re-audit, or to plan remediation; not for uncommitted work, an initial proposal review, or implementation itself.
---

# OpenSpec Review Implementation

Review the complete committed range that would be pushed from the current branch.
Check whether the implementation is a sound engineering solution, conforms to
the active OpenSpec change, and meets ordinary code-quality expectations. Keep
the current result in `<change-root>/implementation-review.md`.

The report is review evidence, not approval to push, merge, archive, or accept
residual risk.

## Boundaries

- Review committed changes only. Do not absorb staged, unstaged, or untracked
  work into the target.
- Exclude `implementation-review.md` itself. Committing review evidence must not
  create an endless re-review loop.
- Review one active OpenSpec change at a time. Do not guess when outgoing commits
  touch several changes.
- During an audit, write only `implementation-review.md`. Planning artifacts may
  change only in the separate remediation path below.
- When addressing findings, never edit implementation code or tests and never
  invoke Apply. Reconcile existing planning artifacts only through
  `openspec-update-change`, then hand implementation back to the user.
- Ask the human before settling consequential product, contract, architecture,
  data, security, privacy, cost, or residual-risk decisions.
- Isolation applies to the decision reviewer, not the orchestrator preparing its
  input. The orchestrator must understand the complete change before reducing
  that context to a neutral intention brief.

## Resolve the Pre-Push Target

Read [references/review-target.md](references/review-target.md), then run the
bundled discovery helper from the repository root:

```sh
node "<skill-root>/scripts/discover-review-target.mjs"
```

Use its exact result without improvising a broader target. The helper is
read-only and excludes uncommitted work and `implementation-review.md`. Do not
claim the local upstream reflects the live remote or run `git fetch` without the
user's request.

Treat `reviewablePaths` as the authoritative changed-file inventory for the
review. It comes from the recorded Git diff. `pathsOutsideChangeRoot` is only a
location hint; it does not prove that a path is implementation.

Classify each reviewable path by its actual role in the diff and repository:
planning evidence, implementation or delivery behavior, tests, configuration,
migrations, documentation, or unrelated work. Paths under the change root may be
delivery surfaces in a custom schema, and paths outside it may still be planning
artifacts. Record the exact delivery-path subset for later passes. Every
reviewable path must remain visible as planning evidence, a review-unit target,
or an unmapped path; do not silently drop one after classification.

If semantic classification finds no implementation or delivery behavior to
review, route to `openspec-review-change`; do not issue a clean implementation
verdict.

## Understand the Current Change

Refresh `openspec status --change "<name>" --json` after discovery. Use its
`changeRoot`, `schemaName`, `artifactPaths`, `artifacts`, and `actionContext`
rather than assuming filenames or a repository-local planning layout.

Run the read-only context command
`openspec instructions apply --change "<name>" --json`; this does not invoke the
Apply workflow. Read its current context files, tracked progress, tasks, project
context, applicable operation guidance, and relevant canonical specs. Follow
their references far enough to understand why the requested outcomes and
constraints exist; do not infer intent from one artifact in isolation.

If planning sources conflict or leave a consequential part of intent unclear,
preserve the uncertainty and ask the human for the smallest decision that would
resolve it. Do not silently choose the interpretation that best fits the current
implementation.

## Resolve the Reviewed Increment

The active change supplies context; it is not automatically the scope implemented
by the outgoing range. Starting from the immutable `base..head` diff, map the
behavior actually changed in implementation, tests, configuration, migrations,
and other delivery surfaces to the part of the change that the range claims to
deliver.

Do not add unchanged files to the review target. Inspect unchanged callers,
dependencies, and runtime boundaries only as context needed to understand the
changed behavior; do not report unrelated findings from them.

Inspect the tracked-work diff as evidence. Tasks completed, reopened, or edited
in the range are candidates, not proof of scope or completion. Include an
unchanged task when the implementation clearly changes behavior promised by that
task, and expose code that maps to no task instead of silently assigning it to a
convenient one.

Build one or more review units. Each unit records:

- a coherent intended outcome and affected actor or system boundary;
- the task or work-item IDs or stable labels attributable to the outgoing range;
- the affected requirement and scenario IDs or stable labels;
- the implementation and test evidence in the immutable diff;
- the change-wide constraints and non-goals that apply to this unit; and
- any ambiguous mapping, unmatched outgoing code, or nearby change scope that is
  explicitly excluded from this increment.

Cross-check the map in both directions: every included work item needs outgoing
delivery or verification evidence, and every material outgoing implementation
path must belong to a review unit or be disclosed as unmatched or unrelated. Do
not demand implementation of untouched future tasks merely because they share
the active change.

Keep tasks in one unit when they serve the same outcome and boundary. When the
range contains materially distinct outcomes, create separate units and decision
briefs rather than flattening them into the whole change's purpose. If a
consequential mapping cannot be resolved from repository evidence, ask the human
instead of guessing. If it remains unresolved, mark the affected independent
pass `Incomplete`.

## Review in Three Passes

### 1. Independent decision review

For each review unit, synthesize a short mechanism-neutral intention brief from
the complete planning context and the increment map. This is controlled context
reduction, not an attempt to understand the work from a minimal set of files or
to substitute the whole change's purpose for the implemented increment.

Classify the source material before writing the brief:

- **Intent:** the problem, desired outcome, and affected actor or system boundary;
- **Binding constraints:** externally imposed contracts or limits that genuinely
  restrict valid solutions, with `none known` when the artifacts establish none;
- **Non-goals:** explicit outcome or scope exclusions; and
- **Reviewer-excluded context:** task steps, technologies, architecture,
  algorithms, expected files, selected-solution rationale, prior findings, and
  preferred fixes.

Cross-check the first three categories against the complete artifact graph and
the unit's mapped work items. Keep source notes in the orchestrator's context,
but exclude the selected solution and planning provenance from the reviewer
input. Do not promote a documented design choice into a binding constraint merely
because the implementation follows it.

The brief must contain `Problem`, `Desired outcome`, `Affected boundary`,
`Binding constraints`, optional `Non-goals`, and an exact `Review target` naming
the repository root, immutable base and head, and the unit's complete path list.
Every target path must come from `reviewablePaths`. If a material conflict or
unknown prevents an accurate brief, do not fill it from code or selected-solution
rationale; leave that unit's independent pass `Incomplete` until the human
resolves it.

Use a fresh zero-history reviewer that follows `implementation-decision-review`
for each materially distinct unit. Give it only that unit's intention brief and
repository root. The reviewer must reconstruct exactly
`git diff <base>..<head> -- <unit-paths>` from the supplied target. It must not
rerun target discovery, resolve the current upstream or `HEAD`, inspect other
changed paths, or widen the unit. It may inspect unchanged surrounding code as
context, but before opening a context path outside the target it must use
`git diff --quiet <base> <head> -- <path>` only to confirm that the path did not
change. It must not read a changed context path. Findings must arise from the
bounded target. If another changed path is required to review the unit
coherently, the reviewer returns `Incomplete` and asks the orchestrator to
correct the unit instead of adding that path itself.

Forbid planning artifacts, commit messages and history, the review report, prior
findings, implementation discussion, and the orchestrator's private source notes.

If isolated review is unavailable, continue the other passes but mark this pass
`Incomplete`. A non-isolated pass may add concrete findings but cannot produce a
clean result or clear an earlier finding.

### 2. OpenSpec conformance review

Using the full artifact graph already loaded, check that:

- every requirement and scenario mapped to the reviewed increment has
  implementation and test evidence;
- every task completion or verification claim introduced or changed in the
  outgoing range is supported by that range;
- code, requirements, design, tasks, and verification agree in both directions;
- untouched future tasks are not reported as missing implementation for this
  increment;
- changed behavior, failure paths, compatibility, migration, operations, and
  documentation obligations are covered when relevant; and
- unrelated outgoing changes are exposed rather than silently attributed to the
  selected change.

Use the project's OpenSpec verification workflow when available. Otherwise
perform these checks directly and state the missing verification boundary. Run
`openspec validate "<name>" --json` as structural evidence, not as proof of
implementation correctness.

### 3. Code-quality review

In the current orchestrator context, invoke `code-review-and-quality` when
available and review the complete bounded delivery-path subset. If it is
unavailable, apply the same five axes directly and disclose that limitation. Use
its correctness, readability, architecture, security, and performance lenses and
evidence discipline only. This skill owns the target, severity scale, findings,
and aggregate result; do not import approval language, merge verdicts, or
`Required`/`Nit`/`Optional`/`FYI` categories from the supporting skill.

Inspect affected callers, tests, configuration, data paths, and runtime
boundaries far enough to substantiate findings, without adding them to the target
or expanding into unrelated cleanup.

## Consolidate Findings

Verify every cited fact against the repository. Merge duplicate symptoms from
different passes into one finding. Keep distinct root causes separate.

For each finding, identify the earliest source of truth that must change:

- implementation or tests;
- task or verification;
- design or ADR;
- requirement or proposal; or
- a separate change when remediation has different intent or material new scope.

A documented choice does not rebut an engineering problem. Narrow or remove a
finding only when concrete evidence disproves its failure mode or supplies a
binding constraint. Human acceptance changes the disposition, not the evidence.

Read [references/review-format.md](references/review-format.md) before every
report write. Rewrite the report to the current truth for the full outgoing
range; do not retain resolved findings, old targets, or review-session history.
Immediately before writing, confirm that `HEAD` and the local upstream ref still
resolve to the recorded head and base. If either moved, rerun discovery and
review the new target instead of publishing a stale report.

Use this result precedence:

1. `Changes needed` when any substantive finding remains, even if a pass is
   incomplete;
2. `Incomplete` when no finding remains but a required pass, target boundary, or
   verification step is incomplete; or
3. `No substantive findings` only when all three passes completed and no material
   finding remains.

## Address Findings When Asked

A request such as `fix F2` re-enters this skill only to prepare planning and
tracked work for later implementation. Read
[references/remediation.md](references/remediation.md) before taking any action.

This skill never implements a finding. After planning reconciliation, keep the
finding in the report and hand the affected work items to the user. A later,
separate Apply invocation may implement them. Re-audit only after that work is
committed and the user requests another review of the complete pre-push range.

## Handoff

Report the upstream and reviewed head, selected change, reviewed work units and
work-item IDs or labels, aggregate result, highest-impact findings or their
absence, decisions still needed, excluded uncommitted work, validation and
verification evidence, isolation limitations, planning handoff state, and the
report path. Leave implementation, push, merge, and archive decisions to the
human.

## Verification

Before reporting the result, confirm that:

- the target contains every outgoing commit and no uncommitted work;
- review reports themselves were excluded without hiding code or planning edits;
- the selected change came from changed-path evidence or an explicit choice;
- every material outgoing implementation path was mapped to a review unit or
  disclosed as unmatched or unrelated;
- reviewed work items have outgoing evidence and untouched future tasks were not
  treated as current implementation obligations;
- the orchestrator synthesized the intention brief from the complete planning
  context without hiding material conflicts or promoting chosen solutions into
  constraints;
- the independent reviewer received only the neutral brief, repository root, and
  immutable base, head, and exact unit path list in a fresh context, and did not
  widen or rediscover that target;
- conformance and code-quality passes covered the same immutable range;
- the code-quality pass used its supporting skill only as a review lens and kept
  this skill's result, severity, and report protocol;
- every finding has evidence, impact, a required outcome, and an earliest source;
- report state matches the current base and head without stale findings;
- remediation delegated planning writes to `openspec-update-change`, recorded
  appropriate tracked work, and made no code, test, Apply, or implementation
  changes; and
- no push, merge, archive, or risk-acceptance approval was implied.

When changing this skill, run the bundled discovery tests and evaluate the
realistic routing and workflow cases in
[references/evaluation-cases.md](references/evaluation-cases.md).
