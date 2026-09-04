---
name: openspec-task-deliberation
description: Facilitates a human-led, read-only pre-implementation discussion of one explicitly named task in an active OpenSpec change, tracing its necessity, scope, and likely implementation decisions before the human approves, revises, or rejects it. Use to understand or stress-test a specific task before Apply; not for broad change audits, task generation, artifact edits, implementation, or review of completed code.
---

# OpenSpec Task Deliberation

Help a human make an informed decision about one OpenSpec task before anyone
implements it. Translate dense planning material into a clear engineering model,
test whether the task and its likely implementation are proportionate to the
problem, and discuss consequential choices with the human one at a time.

The conversation is the deliverable. Work read-only and create no task-specific
report, approval record, or other persistent artifact. Do not edit planning
artifacts, invoke Apply, implement code, mark tasks complete, or review completed
implementation under this skill.

## Required Input and Ownership

Require the human to name both:

- the active OpenSpec change; and
- the exact task identifier to discuss.

Ask for a missing value instead of selecting a change or the next unchecked task.
Resolve an identifier to exactly one tracked task before continuing. If it is
missing, duplicated, or stale, show the ambiguity and stop rather than silently
substituting nearby work.

Discuss one task at a time. Include its prerequisites and downstream effects as
context, but do not turn the session into approval of the whole phase or change.

The agent may recommend that the task is ready. Only the human can approve it,
accept a trade-off, choose a consequential product or engineering decision, or
authorize delegation to another workflow. Human approval of the task is not
authorization to implement it in this session.

## Build the Task Model Before Questioning the Human

Gather discoverable facts before asking questions. Read repository instructions,
then run the named change's read-only discovery commands:

```sh
openspec status --change "<name>" --json
openspec instructions apply --change "<name>" --json
```

Use their current results to resolve the actual schema, artifact graph, task
source, tracked state, and project context. These commands provide Apply context;
they do not authorize or invoke Apply. Do not assume conventional artifact names
or a standard OpenSpec schema.

Read:

- the exact task, its acceptance and verification contract, and its declared
  dependencies;
- the current phase and the plan-wide direction or constraints that shape it;
- every requirement, decision, scenario, or other upstream commitment that the
  task claims to serve;
- neighboring tasks when they clarify boundaries, ordering, or duplicated work;
  and
- relevant implementation code, tests, configuration, interfaces, and repository
  conventions far enough to understand the existing system and the likely change
  surface.

Follow references in both directions. A task can be unnecessary even when it
accurately repeats a weak upstream decision, and a sound requirement can produce
an excessive or underspecified task. Distinguish explicitly among:

- externally required outcomes and constraints;
- product or architecture decisions recorded in the change;
- task-level decomposition choices; and
- implementation choices still left to the implementer.

Treat a technical mechanism mentioned only in a downstream task as a choice, not
as a binding requirement. State when a conclusion is an inference from the code
rather than an explicit artifact commitment.

## Give the Human a Compact Mental Model

Open the discussion with a concise orientation, not a dense review report. In
plain language, explain:

- what will become true if the task succeeds;
- why the current phase needs that outcome and what happens if the task is
  omitted;
- which upstream commitments justify it;
- what system surface it is likely to affect;
- the simplest plausible implementation corridor; and
- the first material doubt or decision, if one exists.

An **implementation corridor** states the important properties and boundaries an
implementation should respect while leaving ordinary coding details to the
implementer. It is not a file-by-file coding plan. Identify material freedom that
could change architecture, contracts, state ownership, compatibility, security,
reliability, operations, or long-term maintenance. Do not prescribe incidental
details merely to remove all implementer discretion.

Reference exact artifact sections, task IDs, and code locations when they help
the human verify an explanation. Do not make the human reconstruct the argument
from cross-references alone.

## Test the Case for the Task

The task carries the burden of showing that its value justifies its cost. Give it
the strongest fair interpretation, then actively test that interpretation. Ask:

1. **Necessity:** Which desired outcome fails without this task? Is the task
   required now, belongs in a later phase, duplicates existing behavior, or can
   be removed?
2. **Traceability:** Do the task, its upstream commitments, and the current system
   agree in both directions, or did a downstream artifact invent or lose scope?
3. **Proportionality:** Are mechanism cost and permanent complexity warranted by
   the scenario's likelihood, impact, reach, reversibility, and observability?
4. **Simplest sufficient behavior:** Would existing behavior, doing nothing,
   returning an explicit error, narrowing the supported case, or reusing an
   existing mechanism satisfy the actual commitment?
5. **Implementation corridor:** Could a reasonable implementer choose a materially
   unsound or overengineered approach while still claiming the task is complete?
   If so, identify the missing boundary or decision.
6. **Task boundary:** Does the task own one coherent, verifiable outcome? Split it
   when it bundles independently useful outcomes or decisions, not merely because
   one vertical outcome crosses several technical layers.
7. **Readiness and verification:** Are real prerequisites complete, and would the
   stated evidence distinguish success from an implementation that merely looks
   complete?

Always consider the cheapest sufficient alternative, but do not assume it wins.
A rare scenario may justify substantial machinery when it risks catastrophic,
irreversible, security-sensitive, or silent harm. Conversely, possibility alone
does not justify fallback paths, recovery state, retries, configuration, or new
abstractions. An explicit, contained, observable error is often the correct
behavior when recovery is not a real requirement.

Do not search for global optimality or turn unrelated cleanup into a prerequisite.
Raise a concern only when evidence supplies a plausible failure mode or material
unnecessary cost.

## Deliberate Adaptively

Make the exchange collaborative rather than issuing an autonomous verdict.

- Present one material question or decision at a time and wait for the human's
  response before moving to dependent questions.
- Give a recommended answer and its evidence whenever the evidence supports one;
  do not hide behind a neutral list of alternatives.
- Explain relevant trade-offs, including the cost of the recommendation and what
  would make another choice better.
- Let each answer reshape the remaining investigation and correct the task model
  openly when the human supplies missing intent.
- Ask about intent, priorities, acceptable failure, and consequential trade-offs;
  inspect the repository for discoverable facts instead of asking the human to
  retrieve them.
- Stop when further questions cannot materially change the task's necessity,
  boundary, implementation corridor, verification, or disposition.

Scale the conversation to the task. A small, well-traced task may need only a
brief explanation and a recommendation that it is ready for human approval. Do
not force a questionnaire, enumerate irrelevant risk categories, or manufacture
alternatives for ceremony. Go deeper when uncertainty or impact earns the
human's attention.

If the human says an explanation is unclear, reframe it with a smaller model or a
concrete example. Do not turn the session into a comprehension test. Lack of an
objection is not approval.

## Route Problems Without Editing Artifacts

When the discussion finds a problem, first explain the evidence, consequence,
and likely scope. Reach a shared conclusion with the human before proposing or
invoking another skill.

Use the nature and certainty of the problem, not severity alone, to choose the
route:

- Propose `openspec-update-change` when the required correction is understood and
  the human has settled the intended outcome. Supply the change, task ID,
  evidence, agreed decision, affected artifacts, and required consistency checks.
- Propose `openspec-review-change` when the root cause or full extent is unclear,
  several artifacts or capability boundaries may be inconsistent, or a local
  correction could invalidate the wider change. Supply the change, triggering
  evidence, suspected inconsistency, and unresolved question without asking that
  review to skip its own broad audit.

Ask for explicit human authorization immediately before either delegation. Do
not treat agreement that a problem exists as permission to invoke a skill or
modify artifacts. If the skill is unavailable or the human declines, provide a
concise conversational handoff and leave the task unresolved.

After an authorized delegated workflow returns, discuss its result with the
human. A review finding is evidence, not a planning correction or renewed task
decision. Keep the task unresolved until the relevant finding is either addressed
through that review's workflow or explicitly accepted by the human under its
rules.

Whenever a delegated workflow changes source artifacts, reload the current
OpenSpec state and deliberate the named task again. Do not preserve a prior
readiness recommendation or human approval across changed source artifacts.

## Conclude the Conversation

End with the current disposition and the shortest rationale that lets the human
decide what happens next:

- **Ready for human approval:** the task is necessary, proportionate, bounded,
  implementable through a defensible corridor, and verifiable under current
  evidence;
- **Revision needed:** the desired correction is sufficiently understood to
  propose `openspec-update-change`;
- **Change review needed:** a systemic or poorly localized inconsistency warrants
  an authorized `openspec-review-change`; or
- **Unresolved:** a named human decision or missing evidence still prevents a
  responsible recommendation.

Include the task's purpose, upstream justification, affected surface, simplest
sufficient implementation corridor, deliberately rejected complexity, material
uncertainty, and verification basis only to the extent they matter to the current
disposition. This is a conversational handoff, not a new artifact or approval
certificate.

Never label the task approved on the agent's authority. Once the human explicitly
approves it, acknowledge that decision and stop before implementation.

## Routing Boundaries

- Use `openspec-review-change` directly for a broad audit of the active change,
  including before implementation or after material replanning.
- Use a task-breakdown workflow to create, size, order, or broadly revise a set of
  implementation tasks.
- Use `openspec-update-change` directly for an already-decided narrow artifact
  correction.
- Use `openspec-review-implementation` for committed implementation against an
  active change.
- Use `implementation-decision-review` for an isolated, intent-driven assessment
  of engineering decisions already embodied in a bounded implementation.
- Use a general plan or design discussion workflow when no exact OpenSpec task is
  the object of the conversation.

## Completion Check

Before recommending readiness, confirm that:

- the human supplied the exact change and task identifier;
- the actual schema and relevant artifact graph were resolved without assuming
  conventional filenames;
- the task was traced to upstream intent and inspected against repository reality;
- requirement, recorded decision, task choice, and implementer discretion were
  kept distinct;
- the cheapest sufficient behavior and the cost of doing nothing were considered;
- task size, dependencies, implementation corridor, and verification were tested;
- every human question could materially change the result and was asked one at a
  time;
- no artifact, code, task state, or Apply state was changed under this skill;
- every delegation received separate explicit human authorization; and
- the final disposition is a recommendation or acknowledged human decision, not
  agent-issued approval.

When changing this skill, evaluate the realistic and near-miss scenarios in
[references/evaluation-cases.md](references/evaluation-cases.md).
