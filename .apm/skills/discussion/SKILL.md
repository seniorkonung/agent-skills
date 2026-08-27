---
name: discussion
description: Maintains durable, curated discussion documents for open-ended research or brainstorming that may span sessions, produce multiple ideas, or inform multiple future OpenSpec changes. Use for a raw topic that needs exploration and persistent synthesis; use idea-refine for a specific idea and openspec-explore for investigation scoped to one change.
---

# Discussion

Explore a topic as an adaptive thinking partner while preserving the durable
results in `docs/discussions/`. A discussion document is a maintained map of
the current understanding, not a transcript, meeting log, or OpenSpec change.

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
- Let one discussion inform many ideas and changes. Do not force the topic into
  a single deliverable or converge before the user is ready.

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
is durable, how to split a topic, or how much detail belongs in a change
candidate.

## Maintain the Dossier

Update the document at semantic checkpoints, not after every message. A
checkpoint exists when the conversation produces or revises at least one of:

- a durable conclusion, decision, or constraint;
- evidence that changes confidence in the current understanding;
- an open question that affects future direction;
- a candidate idea, related discussion, or future OpenSpec change;
- a cross-cutting discovery from later work that affects this topic beyond one
  local change.

Make the smallest edit that leaves the dossier coherent. If no durable
knowledge changed, do not edit it. Before ending a session, compare the dossier
with the conversation and capture any missing durable result; this is a
completeness check, not a requirement to manufacture a diff.

Never:

- paste or lightly summarize the conversation turn by turn;
- record transient suggestions as conclusions;
- keep contradictory claims in the current synthesis;
- add empty sections or metadata merely because a template contains them;
- add YAML frontmatter, lifecycle statuses, or an archive mechanism.

Every document present in `docs/discussions/` is treated as active and
maintained. Obsolete documents are deleted by the user, not archived by this
skill.

## Branches and Outcomes

### Related discussions

When a branch becomes independently useful, propose a focused title and
boundary. Create the new discussion only after confirmation, then link the two
documents and keep only the parent-level conclusion in the original dossier.

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

### Candidate OpenSpec changes

Decompose implementation directions into atomic candidate changes. Each
candidate records its intended outcome, scope boundaries, dependencies or
ordering, and the applicable handoff notes for proposal, specs, design, ADR,
or tasks.

**Hard session boundary:** never create an OpenSpec change or any artifact
inside `openspec/changes/` during a discussion session. Do not invoke
`openspec-new-change`, `openspec-propose`, or an equivalent command. Preserve
the candidate in the dossier and tell the user to start it in a separate
session.

In a later OpenSpec session, the dossier is an input, not another artifact to
mirror. Feed back only discoveries that change the shared understanding,
another candidate change, or future handoffs. Keep change-local detail in that
change's own artifacts.

## Session Handoff

At the end of a useful discussion session, briefly report:

- which synthesis, conclusions, or questions changed;
- which ideas or related discussions were created;
- which future change candidates were added or revised;
- the path of the maintained dossier.

Do not convert the dossier into a plan unless the user asks for planning.

## Verification

Before yielding:

- [ ] The document reflects the current understanding rather than session order
- [ ] Every durable conclusion from this session is represented
- [ ] Conclusions, open questions, ideas, and change candidates are distinct
- [ ] Candidate changes are bounded and ordered without creating OpenSpec files
- [ ] Created ideas have two-way provenance links
- [ ] No edit was made solely to show activity
