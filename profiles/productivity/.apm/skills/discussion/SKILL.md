---
name: discussion
description: Maintains durable, scoped discussion documents for open-ended research or brainstorming that may span sessions or branch into related topics. Use when a topic or idea needs exploration and persistent synthesis.
---

# Discussion

Explore a topic as a thinking partner while preserving the durable results in
`docs/discussions/`. The conversation stays free-form; the memory stays strict.
A discussion document is a maintained map of the current understanding, not a
transcript, meeting log, plan, or implementation artifact.

Do not force the topic into a single deliverable or converge before the user is
ready. Turn the dossier into a plan only when the user asks for planning.

## Start or Resume

1. Inspect `docs/discussions/` before creating a document.
2. Resume an existing document when it clearly covers the topic. If several
   documents plausibly match, ask the user which one to use.
3. Otherwise, once the topic can be named, create
   `docs/discussions/<kebab-case-topic>.md` early in the session. Explicitly
   invoking this skill authorizes creation and maintenance of that document.
   If the skill was selected implicitly from a broad request, explain the
   durable dossier and get confirmation before the first write.
4. Read the selected document completely before continuing. Inspect the
   project materials relevant to the topic, such as code, documents,
   manuscripts, models, reference images, and prior decisions, rather than
   relying on conversational memory alone.

Read [references/document-format.md](references/document-format.md) before
creating or editing a discussion document. Read
[references/examples.md](references/examples.md) when deciding whether a note
is durable or when a line of thought may deserve a separate discussion.

## Maintain the Dossier

Update the document at semantic checkpoints, not after every message. A
checkpoint exists when the conversation produces or revises at least one of:

- a durable conclusion, decision, or constraint;
- evidence that changes confidence in the current understanding;
- an open question that affects future direction;
- a candidate idea or created related discussion;
- a deliberate change to the topic boundary.

Make the smallest edit that leaves the dossier coherent, and do not edit it
when no durable knowledge changed. Before yielding, check that every durable
result of the session is in the dossier; this is a completeness check, not a
reason to manufacture a diff.

Curate the dossier instead of accumulating it:

- Rewrite the current understanding rather than appending to it. Replace what
  changed and merge duplicates so contradictory claims never stand side by
  side. Do not summarize the conversation turn by turn.
- Record what was established. A passing suggestion is not a conclusion.
- Give each fact one home, the most specific section that owns it, and state it
  there once. Facts repeated across sections make the dossier grow with every
  session and drift apart when only one copy is updated. The synthesis gives
  the overall picture and points to sections for detail; general lists hold
  only what no more specific section owns.

Do not add YAML frontmatter, lifecycle statuses, or an archive mechanism. Every
document in `docs/discussions/` is active; the user deletes obsolete ones.

## Branches and Outcomes

### Related discussions

Treat scope as an active conversational decision, not a cleanup task for the
next document edit. When a new line of thought appears, classify it:

- Keep it in the current discussion when it mainly provides evidence, a
  constraint, an example, or a subquestion needed to resolve the parent topic.
- Recommend a separate discussion when it has its own purpose or central
  question, could continue usefully without the parent, or is accumulating its
  own alternatives and unresolved questions.
- Call out an unrelated tangent and offer either to start a new discussion or
  return to the current one.

Do not silently follow a branch while continuing to write it into the parent.
State where the boundary lies, propose a focused title and purpose, and ask
whether to branch or stay with the current topic. Give a recommendation instead
of presenting the choice as arbitrary.

Create the new document only after the user confirms. Before switching, bring
the parent dossier to a coherent checkpoint. Link the two documents, move
branch-specific material to the child, and retain in the parent only the
relationship and any conclusion that directly affects its synthesis. If the
user declines or defers the branch, do not keep exploring its details in the
parent.

### Ideas

When a specific idea emerges, record it as a candidate. Do not record an idea
merely because it was mentioned.

## Session Handoff

At the end of a useful session, briefly report what changed in the dossier,
which related discussions were created, and the dossier's path.
