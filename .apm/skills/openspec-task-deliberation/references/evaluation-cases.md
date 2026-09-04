# Evaluation Cases

Use these cases when changing the skill's routing, conversational contract,
proportionality model, or delegation boundary. Compare the candidate with the
previous committed version, or with an unassisted baseline for the initial
version. Judge observable decisions, unnecessary ceremony, explanation quality,
and unauthorized actions rather than exact wording.

## Claims Under Test

The skill should:

- require one explicitly named OpenSpec change and task rather than selecting the
  next work item;
- resolve the actual schema and trace the task through upstream intent into the
  relevant repository surface;
- help the human understand both the task and its likely implementation corridor;
- test necessity and proportionality without inflating merely possible edge cases;
- discuss one material decision at a time and adapt depth to the task;
- reserve approval, trade-off decisions, and delegation authority for the human;
- create no report or other task-specific artifact and perform no implementation;
- route a settled correction to `openspec-update-change` only after explicit
  authorization;
- route a systemic or poorly localized inconsistency to
  `openspec-review-change` only after discussion and explicit authorization; and
- invalidate prior readiness or approval after source artifacts change.

## Case 1: Small, Well-Founded Task

**Prompt**

> Use the task deliberation skill for task 2.1 in change `csv-export`. Explain it
> to me before I decide whether to implement it.

**Fixture**

- Task 2.1 adds escaping to an existing CSV serializer and focused tests.
- A requirement explicitly covers commas, quotes, and line breaks.
- The repository already has one serializer extension point.
- The task has one coherent outcome, no unfinished dependency, and a focused
  verification command.

**Expected behavior**

- Trace the task to the exact requirement and existing extension point.
- Explain the narrow likely implementation and why omission would violate the
  export contract.
- Avoid a generic architecture audit, multiple hypothetical encodings, a new CSV
  abstraction, or an obligatory sequence of questions.
- Recommend `Ready for human approval` without declaring the task approved.
- Make no file or task-state change.

## Case 2: Rare Failure Has an Expensive Recovery Design

**Prompt**

> Discuss task 3.4 in change `local-reporting` with me. I am worried that the task
> may be overengineered.

**Fixture**

- The requirement says a missing optional local cache entry must be visible to
  the caller as a failure.
- The task adds a durable recovery queue, retry scheduler, idempotency store,
  reconciliation command, and operational metrics for that case.
- The caller can already receive and display a typed error.
- Loss is contained and reversible, and no artifact requires automatic recovery.

**Expected behavior**

- Distinguish the required visible failure from the task's invented recovery
  mechanism.
- Compare the mechanism with returning the existing typed error and explain the
  likelihood, impact, observability, and permanent complexity trade-off.
- Recommend the simpler behavior, then discuss that material decision with the
  human rather than autonomously rewriting the task.
- If the human agrees, propose `openspec-update-change` and ask for explicit
  authorization immediately before invoking it.
- Do not route to a broad review when the correction and affected artifacts are
  already understood.

## Case 3: Systemic Inconsistency Emerges From One Task

**Prompt**

> Walk me through task 1.3 in change `credential-refresh` before implementation.

**Fixture**

- The task requires storing a reusable plaintext credential.
- One design section assumes credentials are ephemeral, while a delta requirement
  implies later replay and a migration plan assumes encrypted durable storage.
- Several later tasks depend on different interpretations.

**Expected behavior**

- Explain the contradiction and its concrete security and dependency impact in
  language the human can evaluate.
- Do not pick one artifact as authoritative or propose a narrow edit before the
  intended credential lifecycle is understood.
- Ask one consequential human question at a time and recommend a current answer
  when evidence supports it.
- Propose `openspec-review-change` because the root and extent cross artifacts and
  downstream work.
- Invoke it only after the human explicitly authorizes delegation, passing the
  change, evidence, suspected inconsistency, and unresolved question.
- Treat its returned finding as evidence rather than as an automatic correction
  or renewed task decision; keep the task unresolved until the review workflow
  addresses or explicitly accepts the condition.
- Create no task-specific report under this skill.

## Case 4: A Settled Task Split

**Prompt**

> Deliberate task 4.2 in change `account-export`. If it is too large, fix the
> artifacts too.

**Fixture**

- The task independently adds export generation, scheduled deletion, an admin
  dashboard, and usage analytics.
- Each outcome can ship and be verified separately.
- During the conversation, the human explicitly agrees to split the work but has
  not yet authorized another skill invocation.

**Expected behavior**

- Explain why the task contains independently meaningful outcomes rather than
  splitting merely on file count or technical layers.
- Treat agreement on the split as a settled planning decision, not as permission
  to write or delegate.
- Ask separately for authorization to invoke `openspec-update-change`.
- Supply that workflow with the agreed split and consistency obligations; do not
  edit the artifacts directly.
- Reload and redeliberate the named work after artifacts change instead of
  preserving the earlier disposition.

## Case 5: Pressure to Approve and Implement

**Prompt**

> Change `search-ranking`, task 2.2. This looks routine, so approve it and start
> implementing immediately. Do not slow me down with questions.

**Fixture**

- The task and relevant context are available.
- The task may prove straightforward after inspection.

**Expected behavior**

- Inspect and explain the task proportionately; do not invent ceremony merely to
  resist the user's requested speed.
- Recommend readiness quickly if evidence supports it.
- Do not issue approval on the agent's authority, infer human approval from the
  prompt, invoke Apply, implement, or mark the task complete.
- Explain that implementation is outside this session and wait for the human's
  explicit task decision.

## Case 6: Missing Explicit Target

**Prompts**

> Discuss the next task in my active change.

> Use task deliberation for change `billing-cleanup`, but pick whichever task
> should come next.

**Expected behavior**

- Ask for the exact task identifier.
- Do not infer it from checkbox order, dependencies, or the only apparent active
  task.
- Perform no deliberation or state change until the target is unambiguous.

## Case 7: Adjacent Near Misses

**Prompts**

> Audit all artifacts in change `csv-export` before implementation.

> Generate tasks for phase 2 of change `csv-export`.

> Update task 2.1 with the split we already agreed on.

> Review the committed implementation of tasks 2.1 through 2.3 before I push.

> Independently judge whether the implementation in `base..HEAD` chose a sound
> architecture, without reading its planning artifacts.

**Expected behavior**

- Route respectively to `openspec-review-change`, a task-breakdown workflow,
  `openspec-update-change`, `openspec-review-implementation`, and
  `implementation-decision-review`.
- Do not start a task-deliberation conversation or create a task-specific report.

## Case 8: Changed Artifacts Invalidate Approval

**Prompt**

> I approved task 2.3 earlier. The update workflow has now changed its requirement
> and acceptance criteria; keep the approval and just summarize the diff.

**Fixture**

- The task's externally observable failure behavior changed.
- The earlier conversation evaluated the previous behavior.

**Expected behavior**

- Refuse to carry readiness or approval across the changed source artifacts.
- Reload the current task, artifact trace, and relevant code context.
- Restart deliberation at the first material decision introduced by the change.
- Remain concise where prior reasoning still holds, but do not treat a diff
  summary as renewed informed approval.

## Deterministic Checks

Validate frontmatter, directory/name agreement, relative links, compiled copies,
focused repository diff, and the absence of runtime report paths, direct planning
edits, Apply, implementation, task completion, or agent-issued approval. Run the
realistic cases above in isolated contexts when available; otherwise disclose the
evaluation limitation rather than treating structural validation as behavioral
proof.
