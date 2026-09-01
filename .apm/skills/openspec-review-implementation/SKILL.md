---
name: openspec-review-implementation
description: Independently challenges engineering decisions in a bounded OpenSpec implementation increment, persists current findings, and reconciles accepted findings across code and change artifacts. Use during Apply when asked for decision-quality review after a task or increment, or to continue, re-audit, or address that review; not for pre-Apply proposal audit, implementation-to-spec verification, or ordinary conformance or pull-request review.
---

# OpenSpec Review Implementation

Review whether a completed implementation increment is a defensible way to
achieve its high-level intent. Preserve an independent review boundary, then use
the full OpenSpec change only to determine how accepted findings propagate through
implementation, requirements, design, tasks, and later work.

Keep the current result in `<change-root>/implementation-review.md`. The report is
the durable handoff for review cycles that span sessions and implementation
increments. It aggregates findings that still apply even when they came from
different bounded targets. It is not an OpenSpec schema artifact, a history of
resolved findings, a conformance report, or approval to continue Apply or archive
the change.

## Boundaries

- Review one active change and one bounded implementation target at a time.
- During an initial audit, change only `implementation-review.md`. Do not edit
  planning artifacts or implementation, change task checkboxes, invoke Apply, or
  archive the change.
- Judge engineering decisions rather than conformity to the change artifacts.
  OpenSpec verification owns completeness, correctness against requirements, and
  design adherence.
- Keep the independent reviewer unaware of implementation tasks, proposal or
  design rationale, ADRs, previous review findings, and the implementing agent's
  discussion.
- Use the full artifact graph only after independent findings have been returned
  and recorded.
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

## Resolve the Change and Review Target

1. Use the change named by the user. If none is named, infer it only when one
   active change is plausible; otherwise resolve the ambiguity with the user.
2. Run `openspec status --change "<name>" --json` and use its reported
   `changeRoot`, schema, artifacts, and paths. Do not assume a repo-local
   `openspec/changes` layout.
3. Resolve the task or increment named by the user or established by the current
   implementation session. Read task text in the parent only when needed to find
   the review boundary; never pass the task text to the independent reviewer.
4. Resolve the exact code target from an explicit commit range, the implementation
   session's edits, or a bounded worktree diff. Exclude unrelated user changes and
   the review report itself. If the target cannot be separated reliably, ask for
   a baseline instead of reviewing the whole dirty worktree.
5. Prefer an immutable commit range. Record the task or increment label, base
   revision, reviewed revision, included paths, and a stable target ID used to
   correlate later re-audits of the same decision boundary. When the target
   contains uncommitted work, snapshot the exact bounded diff for the review,
   record its deterministic SHA-256 digest and paths, and mark the result
   **provisional**. A digest identifies a transient target but cannot reconstruct
   it.

A provisional review may report substantive findings, but it cannot issue `No
substantive findings` or remove findings from an earlier immutable-target review.
Obtain an immutable target and re-audit before using absence of findings as durable
evidence. Do not allow implementation edits while the reviewer is inspecting a
transient snapshot.

The task scopes the implementation history; it does not define the reviewer's
solution space.

## Build a Non-Prescriptive Intention Brief

The parent derives a small intention brief from the user's stated goal and the
minimum existing artifacts needed to understand why the increment exists. Prefer
the proposal's problem and outcome plus externally observable constraints from
relevant specifications. Do not summarize the implementation plan.

The brief contains:

- **Problem:** the undesirable state that motivated the work;
- **Desired outcome:** the state that should become possible or true in user,
  operator, or system terms;
- **Affected boundary:** the actor or system boundary whose outcome matters;
- **Binding constraints:** only externally imposed constraints that genuinely
  limit valid solutions;
- **Non-goals:** scope exclusions needed to prevent review drift; and
- **Review target:** the exact diff, revisions, or paths to inspect.

Before sending it, apply a mechanism-leakage check. Remove:

- task steps and acceptance checklists;
- selected technologies, algorithms, data structures, patterns, or module seams;
- expected files, symbols, classes, endpoints, or database objects;
- design and ADR conclusions or their rationale;
- the implementing agent's explanations; and
- prior review findings or preferred remedies.

Retain a technical term only when it is an externally binding contract rather than
a chosen mechanism. Label it as a binding constraint and explain what makes it
binding. If that distinction is unclear, omit it and allow the reviewer to report
the missing constraint as uncertainty.

The brief should enable this question:

> Is the implementation a defensible way to achieve the intent, or does repository
> evidence reveal a materially simpler, safer, or more coherent alternative?

Do not ask the reviewer to prove global optimality.

## Run an Independent Decision Review

Use a fresh isolated reviewer with no inherited implementation conversation or
OpenSpec planning context. When subagents are available, spawn a new
general-purpose reviewer context with history inheritance explicitly disabled and
instruct it to apply `implementation-decision-review`. Do not use a reviewer role
whose standing instructions require task/specification conformance or a merge
verdict. In a harness that exposes a turn-fork setting, select its zero-history
value; for example, use `fork_turns: "none"` in Codex. An instruction to ignore
inherited context is not an isolation boundary. Give the reviewer only:

- the intention brief;
- the exact repository root and review target;
- permission to inspect the target, tests, surrounding production code, callers,
  runtime boundaries, and repository conventions; and
- an explicit instruction to load and follow `implementation-decision-review`.

Explicitly forbid it from reading the change folder, tasks, specifications,
designs, ADRs, commit or pull-request descriptions, Git log or blame output,
implementation discussion, existing `implementation-review.md`, or previous
review output. Revision identifiers may be used only to resolve the exact code
diff. Do not reuse a reviewer that participated in implementation or saw the
selected design.

Use the result, severity, finding, uncertainty, and coverage contract from
`implementation-decision-review` without adding a conformance or merge-oriented
output contract.

The reviewer must not classify which OpenSpec artifact is wrong. That would
require the context deliberately withheld from it.

If isolated subagents are unavailable or zero-history isolation cannot be
confirmed, conduct the decision review before loading the full artifact graph,
keep planning files out of the pass, and return `Incomplete`. Never describe that
fallback as equivalent isolation. It may add provisional evidence-backed
findings, but it cannot issue a clean result, clear existing findings, or use the
absence of new findings to drive reconciliation.

## Persist Findings Before Reconciliation

Read [references/review-format.md](references/review-format.md) before creating or
restructuring `implementation-review.md`.

Verify cited code evidence without opening withheld planning artifacts, then write
the independent result. Do not discard a finding because the parent remembers why
the implementation was chosen. Unsupported or factually false code evidence may
be corrected, but preserve uncertainty rather than resolving it from design
rationale at this stage.

The report describes current truth across the change:

- keep a separate target section for each bounded target that still has an
  applicable finding or accepted residual risk;
- keep every incomplete target section until a conclusive isolated re-audit of
  that same stable target replaces it, or repository evidence shows that target
  no longer exists in the current implementation;
- include the exact intention brief, target identity or digest, reproducibility
  status, and isolation boundary for every retained target;
- keep only findings that still apply to the current implementation;
- remove fixed, disproven, or obsolete findings only after a fresh isolated
  re-audit of an immutable target;
- keep an accepted residual risk visible while the risky condition remains; and
- do not overwrite findings for one target when reviewing another target;
- retain the most recent clean immutable-target section so its scope and
  limitations survive context loss; and
- do not accumulate session history, resolved-item logs, superseded clean
  sections, superseded reviews of the same target, or empty sections.

If no substantive finding remains and the target is immutable, write the
clean-review statement from the format reference. The aggregate report may say
`No substantive findings` only when no retained target has an applicable finding,
accepted residual risk, or incomplete review. A clean decision review does not
establish conformity to OpenSpec artifacts. For a transient target or a
non-isolated fallback, persist `Independent review incomplete` instead.

## Reconcile Findings Against the Change

After findings have been independently recorded, resolve the full artifact graph
from `openspec status` and the applicable OpenSpec instructions. Read the current
proposal, specs, design, tasks, custom planning artifacts, relevant canonical
specs, and repository evidence needed to trace each finding.

For each finding, determine every affected layer rather than forcing one exclusive
label:

- **implementation:** the poor decision exists only in code or tests;
- **task or verification:** the work description or evidence path reinforces or
  fails to expose the decision;
- **design or ADR:** the poor decision is explicitly selected upstream;
- **requirement or proposal:** the demanded outcome or constraint creates the
  problem or leaves a consequential choice undefined;
- **workflow context:** required existing information did not reach the
  implementing agent; or
- **separate change:** the improvement has a different intent or would materially
  expand the current change.

A documented choice does not rebut a finding. It shows that the concern may begin
higher in the artifact chain. Reject or narrow a finding only with concrete
counter-evidence: the cited failure is impossible, an assumption is false, or a
binding constraint rules out the required property. A human may instead accept
the residual risk, but acceptance is a disposition rather than counter-evidence:
mark it as accepted and keep the finding visible while the risky condition
remains.

Annotate unresolved findings in `implementation-review.md` with affected layers,
the earliest source of truth that must change, its disposition, and any human
decision needed. Do not rewrite the independent evidence or invent a single
prescribed fix.

## Address Findings When Asked

Resolve findings by impact and dependency. Initial review is read-only apart from
the report; remediation begins only when the user asks to address findings.

For each accepted finding:

1. obtain any consequential human decision;
2. correct the earliest affected source of truth;
3. synchronize dependent requirements, design, tasks, and verification through
   the OpenSpec update workflow;
4. reopen a task when the finding proves it was never completed, or add a later
   corrective task when a newly accepted decision changes already completed work;
5. apply the implementation change using the appropriate implementation,
   testing, design, security, observability, or other specialist workflow;
6. run focused verification for the changed code; and
7. re-audit through `implementation-decision-review` with a new isolated reviewer
   that receives the current intention brief and code target but none of the old
   findings or planning rationale.

Do not change planning artifacts merely to make existing code appear acceptable.
Do not close a requirement or design problem with only a vague task. Do not fold a
different intent into the current change to avoid creating a separate one.

After re-audit, rewrite `implementation-review.md` to current truth across all
retained targets. Git preserves session history; the report preserves only
currently applicable cross-increment findings and the latest clean scope.

## Handoff

Report the reviewed target, current findings or their absence, affected layers,
decisions still needed, files changed during requested remediation, focused
verification evidence, reviewer-isolation limitations, and the
`implementation-review.md` path. Keep OpenSpec verification and the decision to
continue Apply or archive explicitly outside this review's verdict.

## Verification

Before reporting the current result, confirm that:

- the change and bounded code target were resolved without absorbing unrelated
  worktree changes;
- a transient target was marked provisional with a deterministic patch digest and
  did not produce or erase a clean conclusion;
- the intention brief describes outcomes and binding constraints without leaking
  the selected mechanism;
- the independent reviewer did not receive planning artifacts, implementation
  discussion, previous findings, or inherited implementation context, and the
  harness isolation setting was explicit;
- every finding has concrete code evidence, impact, and a required engineering
  property;
- findings were persisted before full-artifact reconciliation;
- documented decisions were treated as reviewable claims rather than automatic
  rebuttals;
- affected artifact layers, earliest sources of truth, dispositions, and
  consequential human decisions are visible;
- findings from earlier targets were not overwritten by the latest target;
- no clean aggregate result hides an unresolved incomplete target;
- the report contains current truth rather than review-session history;
- initial review changed no implementation, planning artifact, or task state; and
- no claim of OpenSpec conformity, readiness to Apply, or archive approval was
  made.
