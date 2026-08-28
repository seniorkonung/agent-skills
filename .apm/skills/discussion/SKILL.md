---
name: discussion
description: Maintains durable, scoped discussion documents for open-ended research or brainstorming that may span sessions or branch into related topics. Use for a raw topic that needs exploration and persistent synthesis; use idea-refine for a specific idea.
---

# Discussion

Explore a topic as an adaptive thinking partner while preserving the durable
results in `docs/discussions/`. A discussion document is a maintained map of
the current understanding, not a transcript, meeting log, plan, or
implementation artifact.

## Core Stance

- Keep the conversation free-form. Ask only questions that sharpen the topic,
  challenge a consequential assumption, or unblock a useful conclusion.
- Separate the user's actual desired outcome from a conventional solution,
  buzzword, or idea of what they should want. Probe only when the distinction
  could change direction; offer your current hypothesis so the user can
  correct it, and accept grounded preferences without turning the discussion
  into an interview.
- Keep the memory strict. Important conclusions, constraints, unresolved
  questions, and downstream implications must survive the session.
- Curate current truth instead of accumulating turns. Rewrite stale synthesis,
  merge duplicates, and preserve old material only when its reversal matters.
- Protect the topic boundary throughout the conversation. Notice when a line of
  thought no longer serves the document's purpose directly, and surface the
  drift before absorbing it into the dossier.
- Let one discussion inform many ideas and related discussions. Do not force
  the topic into a single deliverable or converge before the user is ready.

## Start or Resume

1. Inspect `docs/discussions/` before creating a document.
2. Resume an existing document when it clearly covers the topic. If several
   documents plausibly match, ask the user which one to use.
3. Otherwise, once the topic can be named, create
   `docs/discussions/<kebab-case-topic>.md` early in the session. Explicitly
   invoking this skill authorizes creation and maintenance of that document.
   If the skill was selected implicitly from a broad request, explain the
   durable dossier and get confirmation before the first write.
4. Read the selected document completely before continuing. When inside a
   codebase, inspect relevant code, docs, and prior decisions rather than
   relying on conversational memory alone.

Read [references/document-format.md](references/document-format.md) before
creating or restructuring a discussion document. Read
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

Make the smallest edit that leaves the dossier coherent. If no durable
knowledge changed, do not edit it. Before ending a session, compare the dossier
with the conversation and capture any missing durable result; this is a
completeness check, not a requirement to manufacture a diff.

Never:

- paste or lightly summarize the conversation turn by turn;
- record transient suggestions as conclusions;
- keep contradictory claims in the current synthesis;
- add empty sections or metadata merely because a template contains them;
- broaden `Purpose` after the fact merely to accommodate a tangent;
- preserve the details of an independent branch in the parent dossier;
- add YAML frontmatter, lifecycle statuses, or an archive mechanism.

Every document present in `docs/discussions/` is treated as active and
maintained. Obsolete documents are deleted by the user, not archived by this
skill.

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

When a specific idea emerges, record it as a candidate and offer to refine it.
After the user confirms:

1. Invoke `idea-refine` in the same session.
2. Pass the source discussion path and only the conclusions relevant to the
   idea.
3. Let `idea-refine` close missing gaps instead of repeating exploration that
   the discussion already completed.
4. After the idea document exists, link it from the discussion. The idea must
   link back to the source discussion and state the inherited conclusions.

Do not create an idea merely because it was mentioned.

## Session Handoff

At the end of a useful discussion session, briefly report:

- which synthesis, conclusions, or questions changed;
- which ideas or related discussions were created;
- the path of the maintained dossier.

Do not convert the dossier into a plan unless the user asks for planning.

## Verification

Before yielding:

- [ ] The document reflects the current understanding rather than session order
- [ ] Every durable conclusion from this session is represented
- [ ] The current synthesis still serves the stated purpose and boundary
- [ ] Independent branches were surfaced instead of absorbed into the dossier
- [ ] Conclusions, open questions, and ideas are distinct
- [ ] Created ideas have two-way provenance links
- [ ] Created related discussions are linked and do not duplicate branch detail
- [ ] No edit was made solely to show activity
