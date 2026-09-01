---
name: openspec-review-implementation
description: Independently reviews whether a bounded OpenSpec Apply increment makes defensible engineering decisions, then persists and reconciles findings across code and change artifacts. Use after implementation, for re-audit, or to remediate recorded decision-review findings; not for proposal audit, implementation-to-spec verification, or ordinary code review.
---

# OpenSpec Review Implementation

Review whether a completed implementation increment is a defensible way to
achieve its high-level intent. First preserve an independent review boundary;
only after recording the result, use the full OpenSpec change to determine where
substantiated findings originate and what later work they affect.

Persist the current assessment across sessions and bounded targets in
`<change-root>/implementation-review.md`. This current-state companion report is
not an OpenSpec artifact, review history, conformance verdict, or approval to
continue Apply or archive the change.

## Boundaries

- Review one active change and one bounded implementation target at a time.
- During an initial audit, change only `implementation-review.md`; do not edit
  planning artifacts, code, task state, or change lifecycle.
- Judge engineering decisions rather than conformity to the change artifacts.
  OpenSpec verification owns completeness, correctness against requirements, and
  design adherence.
- Ask the human before settling consequential product, contract, architecture,
  data, security, privacy, infrastructure-cost, or residual-risk decisions.

## Routing

Use this skill when the caller requests an independent decision-quality audit
after a named or otherwise unambiguous task or increment has been implemented
during an active OpenSpec change. Also use it to re-audit that target after
remediation or to address findings already recorded in
`implementation-review.md`.

Route adjacent work elsewhere:

- pre-Apply audit of proposal, specs, design, and tasks ->
  `openspec-review-change`;
- implementation conformity to current change artifacts -> OpenSpec verification;
- ordinary conformance or pull-request review, whether or not an OpenSpec change
  is active -> `code-review-and-quality`;
- independent decision review that needs no OpenSpec persistence or artifact
  reconciliation -> `implementation-decision-review`;
- a narrow requested planning-artifact edit -> the OpenSpec update workflow;
- syntax or structure validation alone -> `openspec validate`.

## Workflow at a Glance

| Phase | Planning context | Allowed writes |
|---|---|---|
| Resolve target and build brief | Parent reads only what is needed to express intent | None |
| Independent decision review | Reviewer receives no OpenSpec rationale or prior findings | None |
| Persist independent result | Parent keeps planning context closed | `implementation-review.md` only |
| Reconcile against the change | Parent reads the full artifact graph | Report annotations only |
| Remediate when requested | Parent uses the full graph and specialist workflows | Approved artifacts, code, tests, and report |

A durable `No substantive findings` result requires both an immutable target and
a fresh isolated reviewer. Any weaker boundary may retain evidence-backed
findings, but its result remains incomplete.

## Resolve the Change and Review Target

1. Use the change named by the user. If none is named, infer it only when one
   active change is plausible; otherwise resolve the ambiguity with the user.
2. Run `openspec status --change "<name>" --json` and use its reported
   `changeRoot`, `schemaName`, `artifacts`, `artifactPaths`, and `actionContext`.
   Never assume planning paths. If status is unavailable, fails, or omits needed
   context, stop with `Independent review incomplete`.
3. Resolve the task or increment named by the user or current implementation
   session. The parent may read task text to locate the boundary but must not pass
   it to the reviewer.
4. Resolve the exact code target from an explicit commit range, the implementation
   session's edits, or a bounded worktree diff. Exclude unrelated user changes and
   the review report itself. If the target cannot be separated reliably, ask for
   a baseline instead of reviewing the whole dirty worktree.
5. Use a unique task ID or neutral label as the stable target ID. Retain it across
   re-audits of the same decision boundary; assign a new ID when intent or scope
   changes. Prefer full commit SHAs. For uncommitted work, read
   [references/review-target.md](references/review-target.md) and follow its
   canonical snapshot, digest, freeze, and provisional-result rules.

The task scopes the implementation history; it does not define the reviewer's
solution space.

## Build a Non-Prescriptive Intention Brief

Derive the `implementation-decision-review` intention brief from the user's goal
and the minimum artifacts needed to understand why the increment exists. Prefer
the proposal's problem and outcome plus externally observable constraints; do not
summarize the implementation plan.

The brief contains:

- **Problem:** the motivating undesirable state;
- **Desired outcome:** the intended user, operator, or system state;
- **Affected boundary:** the actor or system boundary that matters;
- **Binding constraints:** external limits on valid solutions, or `None known`;
- **Non-goals:** exclusions needed to prevent drift; and
- **Review target:** the exact diff, revisions, or paths to inspect.

Remove task steps, acceptance checklists, selected technologies or patterns,
expected files or symbols, design and ADR conclusions, implementation rationale,
prior findings, and preferred remedies.

Retain a technical term only when it is an externally binding contract rather than
a chosen mechanism, and say why it is binding. If unsure, omit it and let the
reviewer expose the uncertainty.

The brief should enable this question without asking for global optimality:

> Is the implementation a defensible way to achieve the intent, or does repository
> evidence reveal a materially simpler, safer, or more coherent alternative?

## Run an Independent Decision Review

Use a fresh isolated reviewer with no inherited implementation conversation or
OpenSpec planning context. Start a general-purpose zero-history context and tell
it to follow `implementation-decision-review`; do not use a role that requires
specification conformance or a merge verdict. Telling a context to forget is not
isolation. Supply only the intention brief, repository root, exact target, and
permission to inspect affected code, tests, callers, runtime boundaries, and
repository conventions.

Forbid the change folder, planning artifacts and ADRs, commit or pull-request
descriptions, Git log or blame, implementation discussion, the report, and prior
review output. Revision identifiers may resolve the diff but not framing history.
Do not reuse an implementation participant.

Use the dependent skill's result, severity, finding, uncertainty, and coverage
contract. Do not add a conformance or merge verdict or ask the reviewer to
classify which unseen OpenSpec artifact is wrong.

Without confirmed zero-history isolation, review before loading the artifact
graph and return `Incomplete`. This fallback may add evidence-backed findings but
cannot issue a clean result, clear findings, or reconcile from their absence.

## Persist Findings Before Reconciliation

Before every report write, read
[references/review-format.md](references/review-format.md), the single source for
aggregate results, retention, dispositions, and shape.

With planning artifacts still closed, verify cited code evidence and persist the
result. Correct unsupported or false evidence, but do not dismiss a finding from
remembered rationale; preserve uncertainty.

Persist the exact intention brief, target identity, reproducibility status,
isolation boundary, findings, and coverage. Merge the new target result into the
current report without overwriting retained findings from other targets. A clean
decision review does not establish conformity to OpenSpec artifacts.

## Reconcile Findings Against the Change

After findings have been independently recorded, refresh `openspec status` and
resolve the full artifact graph from its reported paths. Read the current
proposal, specs, design, tasks, custom planning artifacts, relevant canonical
specs, and repository evidence needed to trace each retained finding.

Assign every affected layer, not one exclusive label:

- **implementation:** code or tests contain the decision;
- **task or verification:** work framing or evidence reinforces or hides it;
- **design or ADR:** an upstream decision selects it;
- **requirement or proposal:** demanded or missing behavior creates it;
- **workflow context:** existing information failed to reach implementation;
- **separate change:** remediation has different intent or material new scope.

A documented choice may move a concern upstream but does not rebut it. Narrow a
finding only when concrete evidence makes the failure impossible, disproves an
assumption, or supplies a binding constraint. Human acceptance is a disposition,
not counter-evidence; keep the risk visible while the condition remains.

When reconciliation reveals counter-evidence or a binding constraint withheld
from the reviewer, mark the finding `Re-audit required`. Revise the intention
brief if needed and obtain a fresh isolated review before removing or narrowing
the finding. The parent must not overturn the independent result by itself.

Annotate unresolved findings in `implementation-review.md` with affected layers,
the earliest source of truth that must change, its disposition, and any human
decision needed. Do not rewrite the independent evidence or invent a single
prescribed fix.

## Address Findings When Asked

Remediation begins only when requested. Resolve selected findings by impact and
dependency:

1. obtain consequential human decisions;
2. correct the earliest affected source of truth;
3. before changing a planning artifact, load its current OpenSpec instructions
   with `openspec instructions "<artifact-id>" --change "<name>" --json`, then
   synchronize dependent requirements, design, tasks, and verification;
4. reopen a task when the finding proves it was never completed, or add a later
   corrective task when a newly accepted decision changes already completed work;
5. apply the implementation change using the appropriate implementation,
   testing, security, observability, or other specialist workflow and run focused
   verification; and
6. re-audit with a new isolated `implementation-decision-review` reviewer that
   receives the current brief and target but no old findings or rationale.

Do not launder code into planning artifacts, close an upstream gap with a vague
task, or fold a different intent into the current change.

After re-audit, rewrite `implementation-review.md` to current truth across all
retained targets according to the format reference.

## Handoff

Report the reviewed target, current findings or their absence, affected layers,
decisions still needed, files changed during requested remediation, focused
verification evidence, reviewer-isolation limitations, and the
`implementation-review.md` path. Keep OpenSpec verification and the decision to
continue Apply or archive explicitly outside this review's verdict.

## Verification

Before reporting the current result, confirm that:

- the change and bounded target exclude unrelated worktree changes;
- any transient target follows the snapshot reference and remains incomplete;
- the intention brief contains outcomes and binding constraints, not mechanisms;
- the reviewer received no inherited context, planning rationale, or prior findings;
- every finding has code evidence, impact, and a required engineering property;
- the independent result was persisted before reconciliation;
- counter-evidence triggered re-audit instead of a parent override;
- the report format preserved other targets and exposed decisions still needed;
- initial review changed only the report; and
- no OpenSpec conformity, Apply-readiness, or archive-approval claim was made.
