---
name: skill-authoring
description: Creates and improves portable Agent Skills. Use when a user wants to create a new skill, change an existing SKILL.md or bundled resource, diagnose why a skill misfires, or decide whether reusable agent guidance should be a skill at all.
---

# Skill Authoring

## Overview

Turn a user's actual intent into a useful Agent Skill. Be an opinionated thinking
partner before becoming an editor: listen for the job behind the requested
artifact, challenge weak assumptions, recommend the simplest suitable mechanism,
and then write instructions that agents and humans can both understand.

Do not turn authoring into a ceremony. A narrow, unambiguous edit should remain a
narrow edit. A new or unclear skill deserves more exploration because prose added
before the purpose is understood only makes the wrong behavior more consistent.

## Core Principles

- **Find the job before choosing the form.** A request for a skill may actually
  need a project instruction, script, tool, hook, MCP integration, or one-off
  prompt.
- **Assume the agent is capable.** Teach decisions, constraints, domain knowledge,
  and reusable mechanics it would not reliably infer. Remove generic advice.
- **Make the conversation adaptive.** Spend the user's attention only on
  questions whose answers can change the result.
- **Have a point of view.** Recommend a direction and explain the trade-off. Do
  not present weak and strong options as if they were equal.
- **Keep the user in control.** Push back once with clear reasoning, then honor an
  informed choice unless it would violate safety, authorization, or policy.
- **Prefer a portable core.** Write to the open Agent Skills format unless the
  user explicitly asks for a harness-specific capability.

## Start With the Actual Context

Before asking questions, gather what is already available:

1. Read the current conversation for examples, corrections, desired outputs, and
   constraints the user has already supplied.
2. When updating a skill, read its `SKILL.md` completely, then inspect every
   referenced file relevant to the requested behavior.
3. Inspect project instructions, neighboring skills, validators, and generated
   outputs when they can answer repository questions.
4. Research authoritative sources when correctness depends on a current standard,
   library, API, or harness behavior.

Do not ask the user for facts available in the workspace. Do not make them repeat
an answer merely to satisfy a phase or template.

## Choose the Depth of Work

### Fast Path

Use the fast path when the request is mechanical, narrow, and semantically clear,
such as correcting a typo, adding one explicit trigger, fixing a broken relative
link, or changing a named example.

- Make the smallest sufficient edit.
- Preserve the skill's name, structure, voice, and unrelated behavior.
- Avoid a formal brief, broad research, generated alternatives, or an approval
  round that cannot change the edit.
- Verify the focused diff and the affected skill.

### Collaborative Design

Use collaborative design for a new skill or a change whose purpose, audience,
behavior, boundaries, or risks are unclear.

Start with a short working interpretation, not a questionnaire:

```text
My current read: <what the user is trying to accomplish>.
The decision I cannot safely infer yet: <one consequential unknown>.
```

Ask one high-leverage question at a time and attach the best current guess when it
helps the user react. Prefer questions about:

- the person or agent behavior the skill is meant to help;
- the observable outcome that would make the skill worthwhile;
- realistic requests that should and should not activate it;
- the failure or frustration that prompted the request;
- binding constraints, permissions, and unacceptable outcomes.

Let each answer reshape the next question. Stop when further questions would not
change the recommended artifact or edit. Do not require a confidence score,
formal design brief, or ritual confirmation. If the emerging direction materially
differs from what the user asked for, say so plainly before writing.

For calibrated examples of the fast path, collaborative design, and a justified
no-skill outcome, read [references/examples.md](references/examples.md).

## Decide Whether a Skill Is the Right Artifact

Recommend the mechanism that best matches the need:

| Need | Better fit |
|---|---|
| Reusable judgment or a workflow agents often perform poorly | Agent Skill |
| Project-wide convention that should always be present | Project instructions such as `AGENTS.md` |
| Deterministic rule that can be enforced mechanically | Script, validator, hook, or CI check |
| New external capability or service boundary | Tool or MCP integration |
| One specific outcome unlikely to recur | Direct task or prompt |
| Large stable body of facts used conditionally | Skill reference material, possibly paired with a tool |

Consider whether an existing skill should be extended instead of creating a
near-duplicate. If a skill is not the best fit, say so directly, explain the
simpler alternative, and do not create `SKILL.md` merely to satisfy the noun in
the request.

## Explore Only Meaningful Alternatives

When more than one direction could solve the actual problem, offer two or three
meaningfully different approaches. Explain for each:

- what behavior it optimizes;
- what complexity or constraint it introduces;
- what assumption could make it fail.

Recommend one. Skip alternatives when the right edit is already obvious.

## Create a New Skill

Before drafting, understand enough concrete usage to predict how the skill should
behave:

- two or three realistic user requests;
- at least one adjacent request that should not activate it;
- the expected outcome or artifact;
- required inputs, permissions, dependencies, and environmental constraints;
- the hard decisions or common failures the instructions must improve.

Choose a name of 1–64 characters using only lowercase ASCII letters, digits, and
single hyphens. Do not start or end with a hyphen or use consecutive hyphens, and
make the name exactly match the skill directory. Prefer a short name that
communicates the capability. Write a discriminating description containing both
what the skill does and when it applies, without compressing the full workflow
into frontmatter.

Create only the resources the workflow earns:

- Keep essential purpose, routing, constraints, and workflow in `SKILL.md`.
- Put substantial conditional guidance in `references/` and state exactly when to
  read it.
- Put repeated deterministic work in `scripts/`; document dependencies, inputs,
  outputs, failure behavior, and safe defaults.
- Put templates and files copied into deliverables in `assets/`.
- Omit empty directories, placeholder files, redundant READMEs, and speculative
  scaffolding.

## Update an Existing Skill

Treat an update as diagnosis before rewriting:

1. Identify the observed failure, desired behavior change, or maintenance need.
2. Trace the relevant instruction through references, scripts, examples, callers,
   and generated copies.
3. Distinguish a narrow wording problem from a structural problem or a missing
   resource.
4. Make the smallest change that fixes the general failure rather than overfitting
   to one prompt.
5. Preserve the name, public behavior, and invocation policy unless changing them
   is part of the request.

Do not reinitialize an existing skill. Do not accumulate exceptions, repeated
warnings, and `ALWAYS`/`NEVER` clauses when a clearer explanation, better model,
or smaller workflow removes the underlying ambiguity. Delete or consolidate
instructions that no longer earn their context cost, but do not remove unrelated
behavior silently.

## Write for Agents and Humans

Use simple, direct English unless the user or repository establishes another
language. Communicate with the user in their language; do not confuse the
conversation language with the artifact's language.

- Prefer imperative, concrete instructions over abstract advice.
- Explain why a non-obvious constraint matters so an agent can generalize it.
- Use descriptive headings, short paragraphs, lists, tables, and compact examples
  when they make the behavior easier to scan.
- Describe outcomes and decision criteria instead of prescribing a rigid sequence
  where several approaches are valid.
- Use absolute rules only for safety, authorization, format contracts, or fragile
  operations where deviation creates a concrete failure.
- Keep one source of truth. Link conditional detail instead of duplicating it.
- Keep references shallow and use relative paths from the skill root.

Sections such as `When to Use`, `Common Rationalizations`, `Red Flags`, and
`Verification` are tools, not mandatory decoration. Add them when they prevent a
real routing error, shortcut, or false completion claim. Do not force every skill
into the same outline.

## Preserve Portability

The portable contract is a skill directory with a `SKILL.md` containing `name`
and `description`, plus optional bundled resources. Avoid harness-specific
frontmatter, tool names, paths, UI metadata, and orchestration assumptions unless
the user requests that target.

Use capabilities progressively:

1. Prefer ordinary filesystem inspection and standard commands.
2. Consider independent subagents when complexity or risk warrants separate
   context and delegation is available and authorized.
3. Use sequential evaluation whenever it is sufficient or delegation is
   unavailable, unauthorized, or disproportionate.
4. Use browser viewers, MCP services, trigger optimizers, and other enhanced tools
   when available, but never make them necessary for the core workflow.

When a harness-specific extension is requested, isolate it from the portable core
and document the compatibility requirement rather than implying universal support.

## Evaluate in Proportion to Risk

Always perform structural validation and a careful self-review. Add behavioral
evaluation when a new or changed instruction is meant to alter agent decisions.

Use realistic prompts, including near-misses. For substantial skills, compare
results with and without the skill, review both final artifacts and reasoning, and
iterate only on observed failures. Prefer independent runs so knowledge of the
intended answer does not contaminate the result.

For skills that can change external state:

- test pure decisions and transformations with fixtures first;
- use mocks, fakes, dry-runs, sandboxes, disposable resources, or staging for
  integrations;
- verify authorization, rollback, idempotency, limits, and stop conditions;
- never treat a request to test a skill as authorization to mutate production;
- if no representative safe environment exists, report the untested boundary
  instead of inventing confidence.

Do not require a full benchmark for a typo or a subjective style preference.
Do not skip meaningful behavioral tests merely because the file is Markdown.
For evaluation levels, comparison mechanics, and stateful safety boundaries, read
[references/evaluation.md](references/evaluation.md) when behavioral testing is
warranted.

## Handoff

After creating or changing a skill, report:

- the path and concise purpose of the result;
- the important design decisions or trade-offs;
- what was validated and the evidence obtained;
- any untested boundary, external dependency, or harness-specific limitation.

Show the actual artifact or focused diff when practical. Let the user judge the
work from the result instead of asking them to approve a redundant pre-writing
brief.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "The user asked for a skill, so a skill must be the answer." | The requested noun may encode an assumption. Solve the underlying job and recommend a better mechanism when one exists. |
| "I need every detail before I can write anything." | Ask only about decisions that can change the result. Narrow edits do not need discovery theater. |
| "This is only documentation, so testing is unnecessary." | Skills change agent behavior. Important behavioral claims need realistic evidence. |
| "More instructions make the skill more reliable." | Extra prose adds context cost and creates conflicting rules. Keep only guidance that changes decisions. |
| "A strict template makes every skill consistent." | Consistency is useful only when the sections serve the task. Empty ceremony hides the important workflow. |
| "The eval needs production to be realistic." | Realism does not grant authorization. Use representative safe environments and state the remaining uncertainty. |
| "One successful prompt proves the skill works." | It may be luck or overfitting. Test varied realistic cases and near-misses when behavior matters. |

## Red Flags

- Drafting a new skill before understanding who benefits and what success means
- Asking several generic questions whose answers cannot change the edit
- Silently choosing an audience, output format, or safety boundary
- Creating a near-duplicate without inspecting the existing skill catalog
- Rewriting an existing skill when the user requested one focused change
- Treating vendor-specific metadata or tools as part of the open format
- Copying an external guide into the skill instead of distilling decision-changing guidance
- Adding resources that are never referenced or empty directories for symmetry
- Claiming a stateful workflow is fully tested without a safe representative run
- Accepting structurally valid Markdown as proof of useful behavior

## Verification

Before completing the work, verify that:

- [ ] The result addresses the user's underlying job, not only their initial wording.
- [ ] A skill was chosen over another mechanism for an explicit reason.
- [ ] New skills have realistic trigger and near-miss examples.
- [ ] Existing skills retain unrelated behavior and identity.
- [ ] The description is specific enough to route correctly without restating the body.
- [ ] Instructions are plain, structured, actionable, and free of generic filler.
- [ ] Every supporting resource exists, is linked, and earns its context or maintenance cost.
- [ ] Portable guidance is separated from requested harness-specific extensions.
- [ ] Validation matches the change's behavioral and operational risk.
- [ ] External mutations were tested only within the user's authorization and a safe environment.
- [ ] The final handoff names evidence and limitations without overstating confidence.

## Source Notes

The workflow is self-contained; these sources are provenance and refresh points,
not runtime dependencies:

- [Agent Skills specification](https://agentskills.io/specification)
- [Anthropic Skill Creator](https://github.com/anthropics/skills/tree/main/skills/skill-creator)
- [Addy Osmani's Skill Anatomy](https://github.com/addyosmani/agent-skills/blob/main/docs/skill-anatomy.md)
- [Addy Osmani on Agent Skills](https://addyosmani.com/blog/agent-skills/)
