---
name: phased-planning
description: Turn requirements into a concise, strictly ordered sequence of outcome-oriented execution phases that guides later phase-by-phase task generation. Use when creating or revising a high-level execution plan upstream of task breakdown; not when writing checklists, tickets, estimates, owners, file-level steps, or implementation-ready tasks.
---

# Phased Planning

## Purpose

Create a stable layer between requirements and implementation tasks:

```text
requirements -> phased plan -> selected phase -> detailed tasks
```

A phase describes a meaningful transition in the state of the work. It sets a
direction and a boundary for later task generation; it is not a heading that
hides a list of tasks. Each phase should be broad enough to produce several
implementation tasks when that phase is selected.

## Routing Boundary

Use this skill when:

- requirements need an execution direction before task decomposition;
- a workflow needs a high-level plan artifact upstream of its task artifact;
- changed requirements require a local revision of current or future phases.

Do not use this skill to break a selected phase into implementable work. Use a
task-breakdown workflow for checklists, acceptance criteria, dependencies,
verification commands, files, and estimates. Do not use it to implement a phase.
If a request needs both a phased plan and tasks, keep them as separate artifacts
and finish the phased plan before task generation.

## Ground the Plan

Read the supplied requirements, constraints, decisions, current-state context,
and any existing plan before drafting. Inspect additional context only when it
can change the overall direction, phase boundaries, or phase order. Do not
inspect a repository merely to invent file lists or implementation steps.

Treat the caller's template, content rules, and output target as authoritative
where they do not collapse the distinction between phases and tasks. Produce
only the requested plan artifact and do not hard-code an output path.

Resolve an unknown before drafting when it can change:

- the destination or overall execution direction;
- whether a distinct phase is necessary;
- the order or boundary between phases;
- the state that must be reached before later work can begin.

Defer choices that affect only the tasks inside a phase. A phased plan should
make task generation possible without prematurely making task-level decisions.

## Derive Outcome-Oriented Phases

Start from the intended end state, then identify the few meaningful state
transitions required to reach it.

1. Synthesize the overall direction and constraints from the requirements.
2. Identify states that must become true before the next body of work can begin.
3. Order those states as one strict sequence. Do not emit branches, lanes, or a
   dependency graph.
4. Use the fewest phases that preserve useful planning boundaries. Do not merge
   distinct coherent outcomes merely to reduce the phase count.
5. Check that every in-scope requirement shapes a phase or a plan-wide
   constraint without copying the requirement list into the plan.

Name phases for outcomes, not activities. Split at a distinct, coherent outcome
boundary: either later work should wait for that state, or task breakdown would
otherwise need to recreate phase-like groups inside the phase. Merge a proposed
phase when it amounts to one obvious action or one technical artifact that
belongs inside a broader transition.

Independent work may later run in parallel as tasks within a phase, but the plan
still presents a linear progression of achieved states.

Avoid organizing phases by technical layer or routine discipline. Database,
backend, frontend, testing, security, documentation, and observability are not
separate phases unless one of them genuinely creates a distinct required state.
Normally, cross-cutting qualities shape the outcome, boundaries, or readiness
condition of the phases they constrain.

## Calibrate Phase Size

A phase is right-sized when it owns one coherent outcome and can be decomposed
directly into a manageable set of related implementation tasks. The downstream
task breakdown should not need another layer of phase-like groups to make the
work understandable.

Split a proposed phase when:

- it contains several independently meaningful outcomes rather than one coherent
  state transition;
- its task breakdown would require multiple intermediate outcomes that behave
  like internal phases; or
- its boundaries are too broad to explain what is achieved before the next phase
  begins.

Do not split a phase merely because it crosses technical layers, contains
parallel work, or produces several artifacts. Keep that work together when it
contributes to one outcome and remains one coherent body of tasks. Do not use a
numeric task limit; task complexity varies, while outcome coherence is the stable
boundary.

For an asynchronous export capability, `Add the export endpoint` is too small
because it is directly implementable as a task. `Authorized users can request
and retrieve reliable exports without blocking interactive traffic` is
right-sized because it describes one usable outcome supported by several related
tasks. `Deliver the self-service analytics platform` is too large when it bundles
independently meaningful ingestion, querying, dashboard, and export outcomes.

## Phase Contract

When the caller provides no template, use this compact Markdown shape:

```markdown
# Phased Plan

## Direction

<The overall path from the current state to the intended result.>

## Plan Constraints

<Only constraints that shape the plan as a whole. Omit when none are needed.>

## Phase 1: <outcome-oriented title>

**Objective:** <The state transition this phase is responsible for.>

**Outcome:** <The coherent state that will be true after the phase.>

**Boundaries:** <The broad scope included here and any exclusion needed to
prevent overlap or premature work.>

**Ready to advance:** <High-level evidence that the next phase can safely begin.>
```

Number phases sequentially as `Phase 1`, `Phase 2`, and so on. The previous
phase's outcome is the next phase's implicit starting point, so do not add a
dependency graph.

Keep each field at phase granularity:

- **Objective** explains the intended transition, not the actions to perform.
- **Outcome** describes a usable or decision-relevant state, not completed code
  items.
- **Boundaries** separates phases without enumerating implementation steps.
- **Ready to advance** gives a broad gate, not task acceptance criteria or test
  cases.

For example, `Outcome: authorized users can request an export without blocking
interactive traffic` is phase-level direction. `Add a POST endpoint, queue job,
and worker test` is task-level decomposition and does not belong in this plan.

## Keep Tasks Out of the Plan

Do not include:

- checkboxes, ticket identifiers, or implementation-step lists;
- file paths, code symbols, endpoint names, or shell commands;
- task dependencies, per-task acceptance criteria, or verification procedures;
- owners, assignments, dates, duration estimates, or status tracking;
- speculative implementation decisions not established by the requirements;
- separate cleanup phases for testing or documentation when those qualities
  belong in the readiness of an earlier outcome.

Ordinary prose or bullets are acceptable only when they express constraints or
state boundaries. Rewrite any bullet that could be handed directly to an
implementer as a task.

## Revise Locally

When revising an existing plan:

1. Determine which phases are completed from the supplied context. If a change
   might affect earlier phases and their completion state is unknown, resolve
   that ambiguity first.
2. Preserve completed phases verbatim, including their numbers and wording,
   unless the user explicitly asks to revise them.
3. Identify the earliest unfinished phase affected by the changed requirement.
   Modify that phase and only the later phases whose direction, boundaries, or
   outcomes actually change.
4. Keep unaffected future phases intact. Insert, remove, or renumber phases only
   within the affected future suffix.
5. If a new requirement contradicts a completed phase, surface the conflict
   instead of silently rewriting history. Resolve whether future corrective work
   is needed before producing the revised plan.

Do not introduce stable technical identifiers. Sequential phase numbers are
sufficient because completed history remains fixed and revision is localized to
current and future work. Preserve an existing caller-supplied format rather than
rewriting completed phases into the default template.

## Downstream Handoff

Later task generation should receive the selected phase, the plan-wide direction
and constraints, and the relevant requirements and current-state context. The
selected phase must therefore be understandable without expanding every other
phase, while still fitting the sequence.

This skill stops at that boundary. It does not generate tasks for the selected
phase or regenerate tasks for the entire plan.

## Verification

Before finalizing a phased plan, confirm that:

- [ ] The plan contains the fewest meaningful strictly ordered phases that
      preserve useful planning boundaries.
- [ ] Every phase describes an outcome-oriented state transition.
- [ ] Every phase is broad enough to generate several later tasks.
- [ ] Every phase can be decomposed directly into one manageable body of related
      tasks without introducing phase-like groups or independently meaningful
      internal outcomes.
- [ ] The requirements are covered without being repeated as a checklist.
- [ ] Cross-cutting qualities constrain relevant outcomes instead of becoming
      routine technical phases.
- [ ] No phase contains checkboxes, implementation steps, files, commands,
      owners, estimates, or detailed task criteria.
- [ ] The caller's template and output target are respected.
- [ ] Completed phases remain unchanged during a local revision.
- [ ] Any conflict between new requirements and completed work is visible.
- [ ] No harness-specific assumptions were introduced unless supplied by the
      caller.
