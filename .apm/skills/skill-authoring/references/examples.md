# Worked Examples

Read these examples when choosing how much conversation a request deserves or
turning an intent into concrete instructions. They illustrate judgment, not
scripts to replay word for word.

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
spot decisions and risks in under two minutes. That resolves the consequential
unknown. Recommend a focused direction and proceed:

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

## 4. Author Directly and Turn Intent Into Instructions

**User**

> Create a reusable skill for writing weekly updates from rough project notes.
> The reader is a product director. Keep the update under 200 words and prioritize
> decisions needed from them, changed commitments, and material risks. Include
> routine activity only when it explains one of those. Do not invent owners or
> dates. Ask questions only when the missing information changes the update.

The audience, source, outcome, and boundaries are clear. State the intended result
and draft directly; routine wording and section choices do not need an interview.

**Weak instruction**

> Write a concise, professional update. Focus on what matters. Ask only useful
> clarifying questions.

This drops the word limit and factual boundaries, and leaves "what matters" and
"useful" for the agent to reconstruct.

**Possible skill fragment**

```markdown
Use the supplied project notes to write a weekly update of fewer than 200 words
for a product director.

Lead with decisions needed from the director, then changed commitments and
material risks. Include routine activity only when it explains one of those.
Omit empty sections.

Preserve owners and dates stated in the notes. If a relevant owner or date is
absent, mark it as unspecified rather than inventing one.

Before asking a question, identify how the plausible answers would change the
update's content or priority. Ask when a missing fact prevents a useful, accurate
update; otherwise draft using the available facts and make relevant gaps explicit.
```

**Review against concrete situations**

- Notes include a decision, its owner, and its deadline: draft directly.
- A date is absent but its absence does not change the requested decision: mark
  the date as unspecified and continue.
- Notes conflict about whether the director has already approved a decision:
  clarify its status because the answer changes whether to request that decision.

The fragment translates the user's requirements into selection criteria, factual
boundaries, and a decision about when to ask. These situations support text review;
they are not a claim that model runs were performed. The fragment illustrates
instruction writing, not a mandatory outline for other skills.
