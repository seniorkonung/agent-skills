---
name: openspec-review-implementation
description: Reviews all commits ahead of upstream before push, auto-detects the active OpenSpec change, records actionable code and specification findings, and coordinates schema-aware fixes. Use after Apply commits or to re-audit or fix implementation-review findings; not for uncommitted work or an initial proposal review.
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
- During an audit, write only `implementation-review.md`. Change code or planning
  artifacts only when the user asks to address findings.
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

If the selected range contains no implementation paths outside the change root,
route planning-only review to `openspec-review-change`; do not issue a clean
implementation verdict.

## Understand the Current Change

Refresh `openspec status --change "<name>" --json` after discovery. Use its
`changeRoot`, `schemaName`, `artifactPaths`, `artifacts`, and `actionContext`
rather than assuming filenames or a repository-local planning layout.

Run `openspec instructions apply --change "<name>" --json`. Read its current
context files, tracked progress, tasks, project context, applicable operation
guidance, and relevant canonical specs. Follow their references far enough to
understand why the requested outcomes and constraints exist; do not infer intent
from one artifact in isolation.

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
the immutable base, head, and the paths or bounded diff for that unit. If a
material conflict or unknown prevents an accurate brief, do not fill it from code
or selected-solution rationale; leave that unit's independent pass `Incomplete`
until the human resolves it.

Use a fresh zero-history reviewer that follows `implementation-decision-review`
for each materially distinct unit. Give it only that unit's intention brief and
repository root. Forbid planning artifacts, commit messages and history, the
review report, prior findings, implementation discussion, and the orchestrator's
private source notes. The reviewer may inspect the exact diff and surrounding
repository code named by the brief.

If isolated review is unavailable, continue the other passes but mark this pass
and the aggregate result `Incomplete`. A non-isolated pass may add concrete
findings but cannot produce a clean result or clear an earlier finding.

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

Review the same outgoing implementation diff for correctness, readability,
architecture, security, and performance. Follow `code-review-and-quality` when
available. Inspect affected callers, tests, configuration, data paths, and runtime
boundaries far enough to substantiate findings, without expanding into unrelated
cleanup.

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

Use `No substantive findings` only when all three passes completed and no material
finding remains. Otherwise use `Changes needed` or `Incomplete`.

## Address Findings When Asked

A request such as `fix F2` re-enters this skill in remediation mode. Keep this
skill as the coordinator: select the requested findings, recheck their severity,
dependencies, and earliest sources of truth, prepare a bounded remediation plan,
obtain consequential human decisions, and retain control of verification,
commit coordination, and re-audit. Do not absorb unrelated cleanup or other open
findings unless the user selected them.

When a selected finding requires any proposal, specification, design, task, or
other planning-artifact revision, invoke `openspec-update-change`. Never edit a
planning artifact directly under this skill. Give the update workflow:

- the change name and finding ID;
- the finding's evidence, impact, and required outcome;
- every consequential decision the user has settled; and
- the planning artifacts expected to be affected, without treating that estimate
  as the actual schema graph.

The update workflow owns planning reconciliation. It must independently refresh
`openspec status`, resolve the current artifact IDs and concrete
`existingOutputPaths`, read all related existing planning artifacts, and
reconcile them in any direction. Schema dependency order may help it understand
the graph, but does not constrain which existing artifact can correct another.
It must show every proposed revision and obtain user confirmation before each
write, and it must never edit implementation code.

Corrective task handling also belongs to `openspec-update-change`. It must reopen
a completed task when the original work was never complete, or add a corrective
task when a newly accepted requirement or design decision creates new work. Each
corrective task needs concrete acceptance criteria and verification evidence;
never use vague tracked work to hide a requirement or design gap.

If reconciliation needs an artifact or glob output that does not yet exist, the
update workflow hands that creation to `openspec-continue-change`. If it discovers
materially new intent, it recommends a separate change. If it discovers required
code changes, it returns control to this remediation workflow instead of making
them.

If `openspec-update-change` is unavailable, stop before any planning-artifact
write. Report an incomplete or incorrect OpenSpec workflow installation and tell
the user to run terminal `openspec update`; never fall back to direct editing.

After planning reconciliation, or immediately when no planning revision is
needed, update code and tests through the appropriate implementation workflow,
normally `openspec-apply-change`, strictly within the selected findings. Run
focused verification, then run OpenSpec validation and verification again.

Keep refinements serving the same intent in the current change. Put materially
different intent or scope in a separate change. Do not invoke
`openspec-review-change` merely because one finding touches a planning artifact;
use it after remediation only when intent, capability boundaries, or requirements
changed enough to warrant a broad planning-artifact re-audit.

Re-audit only after remediation is committed, because the target must remain the
complete immutable `upstream..HEAD` range. If committing is outside the agent's
authorization, ask the user to commit before re-audit. Use a fresh isolated
decision reviewer and rewrite `implementation-review.md` to current truth. A
finding that the complete re-audit disproves or verifies as fixed is removed from
the report rather than retained or marked resolved.

## Handoff

Report the upstream and reviewed head, selected change, reviewed work units and
work-item IDs or labels, aggregate result, highest-impact findings or their
absence, decisions still needed, excluded uncommitted work, validation and
verification evidence, isolation limitations, and the report path. Leave the
push, merge, and archive decisions to the human.

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
  immutable code target in a fresh context;
- conformance and code-quality passes covered the same immutable range;
- every finding has evidence, impact, a required outcome, and an earliest source;
- report state matches the current base and head without stale findings;
- remediation delegated planning writes to `openspec-update-change`, kept code
  changes within the selected findings, and updated tracked work; and
- no push, merge, archive, or risk-acceptance approval was implied.

When changing this skill, run the bundled discovery tests and evaluate the
realistic routing and workflow cases in
[references/evaluation-cases.md](references/evaluation-cases.md).
