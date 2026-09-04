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
narrow edit. Explore when a consequential decision is unclear; a new skill with
sufficient context can go straight to authoring.

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

### Direct Authoring

Use direct authoring for a new skill or substantive update when the context
already establishes the purpose, audience, expected behavior, and boundaries.

- Briefly state the intended result or behavior change, then write it.
- Resolve routine wording and organization choices using the available context.
- Check the result against the requirements and relevant usage examples.
- Switch to collaborative design if a consequential unknown emerges.

The size of the change alone does not require an interview or an approval round.

### Collaborative Design

Use collaborative design when a missing decision about purpose, audience,
behavior, boundaries, or risks could materially change the result.

Start with a short working interpretation and identify the consequential unknown.
Before asking, identify what you would do differently for the plausible answers.
If the action would stay the same, proceed using the available context.

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

For examples that help choose a route or turn intent into concrete instructions,
read [references/examples.md](references/examples.md).

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
communicates the capability. Write a description of 1–1024 characters containing
both what the skill does and when it applies, without compressing the full
workflow into frontmatter.

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
- Distill decision-changing guidance from external sources instead of copying
  whole guides into the skill.

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

Start with structural validation and careful review of the instructions, linked
resources, and diff. Check clarity, consistency, scope, and relevant usage examples.
This is sufficient for changes whose correctness can be established by inspection.

Use behavioral runs to resolve a specific uncertainty that inspection cannot
settle, reproduce a reported failure, or substantiate a behavioral claim. State
what the run should tell you and use the smallest useful set of cases within the
user's time and token constraints. A substantive edit alone does not justify a
benchmark or a matrix of models.

When comparison is needed, use no skill as the baseline for a new capability and
the unchanged version for an update. Inspect observable actions and artifacts.
Keep the distinction between text review and observed behavior clear in the
handoff.

For skills that can change external state:

- test pure decisions and transformations with fixtures first;
- use mocks, fakes, dry-runs, sandboxes, disposable resources, or staging for
  integrations;
- verify authorization, rollback, idempotency, limits, and stop conditions;
- never treat a request to test a skill as authorization to mutate production;
- if no representative safe environment exists, report the untested boundary
  instead of inventing confidence.

Revise on the basis of a concrete defect found by inspection, a changed
requirement, or an observed failure. Do not add speculative rules without a
problem they address.

For choosing focused checks, comparison mechanics, and stateful safety, read
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

## Verification

Before completing the work, verify that:

- [ ] YAML frontmatter parses; `name` and `description` meet the format constraints.
- [ ] Relative links resolve and referenced scripts, templates, and files exist.
- [ ] The result and relevant usage examples match the intended behavior and scope.
- [ ] The diff preserves unrelated behavior and identity; instructions and examples agree.
- [ ] Instructions guide concrete decisions without unnecessary repetition or resources.
- [ ] Dependencies and any requested harness-specific extensions are explicit.
- [ ] The handoff distinguishes inspection from runs, states limitations, and stays
  within the evidence and authorization available.

## Source Notes

The workflow is self-contained; these sources are provenance and refresh points,
not runtime dependencies:

- [Agent Skills specification](https://agentskills.io/specification)
- [Anthropic Skill Creator](https://github.com/anthropics/skills/tree/main/skills/skill-creator)
- [Addy Osmani's Skill Anatomy](https://github.com/addyosmani/agent-skills/blob/main/docs/skill-anatomy.md)
- [Addy Osmani on Agent Skills](https://addyosmani.com/blog/agent-skills/)
