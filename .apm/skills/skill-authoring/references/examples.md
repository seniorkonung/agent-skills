# Worked Examples

Read these examples when calibrating how much conversation a request deserves.
They illustrate judgment, not scripts to replay word for word.

## 1. Explore a Vague New Skill

**User**

> I want a skill that helps our team write better weekly status updates. Make it
> professional and comprehensive.

**Weak response**

Immediately draft a reporting template with accomplishments, metrics, blockers,
risks, decisions, and next steps. This silently chooses the writer, audience,
purpose, format, and meaning of "professional."

**Better response**

> My current read: you want more useful weekly communication, and the skill is a
> means to that end. The decision I cannot safely infer is who needs to act on the
> update.
>
> Who is the primary reader? My guess is leadership, because "professional and
> comprehensive" often means an executive-facing summary. If it is mainly for the
> team, the useful content and voice will be different.

Suppose the user answers that the update is for a product director who needs to
spot decisions and risks in under two minutes. The next question should follow
that answer:

> Then completeness is probably not the goal; decision density is. Does success
> mean the director can identify every requested decision and material risk
> without asking a follow-up? My guess is yes, and that routine activity should be
> compressed unless it changes a commitment.

Once the outcome is clear, recommend a focused direction instead of preserving
the user's original adjectives:

> I would build a decision-oriented status-writing skill, not a comprehensive
> reporting skill. It should help the writer select and compress information,
> surface changed commitments, and make asks explicit. A comprehensive template
> would encourage the exact scanning burden you are trying to remove.

Only then draft realistic trigger cases, near-misses, instructions, and evaluation
criteria. No separate brief is necessary because the conversation itself resolved
the consequential decisions.

## 2. Keep a Narrow Update Narrow

**User**

> Change this skill's trigger description so it also activates for pull-request
> reviews. Do not change anything else.

**Good response pattern**

1. Resolve the referenced skill path from the conversation or workspace.
2. Read `SKILL.md` and confirm the description can accept the new trigger without
   contradicting an existing boundary.
3. Edit only the description.
4. Validate the skill and inspect the focused diff.
5. Report the exact change and evidence.

Do not ask for the target audience, generate alternative descriptions for user
approval, restructure the skill, rewrite adjacent wording, or run unrelated
behavioral benchmarks. Ask a question only if multiple candidate skills match or
"pull-request review" conflicts with an existing exclusion.

## 3. Recommend No Skill

**User**

> Create a skill that makes every commit message in this repository use
> `type(scope): subject` and rejects subjects over 72 characters.

**Better response**

> This is deterministic and repository-specific, so a skill is not the strongest
> enforcement mechanism. Put the convention in the project's instructions so
> agents see it, and add a commit-msg hook or CI validator so violations are
> rejected mechanically. A skill can advise, but it cannot guarantee the format.

If the user wants reusable guidance for *choosing* types and scopes across many
repositories, that judgment may justify a skill. Split the concerns:

- project instructions state the local convention;
- a hook or validator enforces syntax and length;
- an optional skill teaches the non-obvious classification decisions.

If the user still wants a skill after hearing the trade-off, honor the informed
choice without pretending it provides deterministic enforcement.

## What These Examples Protect

- Begin with a hypothesis so the user can correct something concrete.
- Ask one question because its answer changes the next question.
- Reframe the goal when the user's requested quality would work against it.
- Preserve speed and scope when the requested edit is already clear.
- Say "this should not be a skill" when another mechanism better fits the job.
- Treat the user's informed decision as final unless safety or authorization
  prevents execution.
