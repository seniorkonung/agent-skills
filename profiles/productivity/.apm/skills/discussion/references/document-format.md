# Discussion Document Format

Use this format as a content model, not a form to fill mechanically. Omit empty
sections and add topic-specific sections when they make the current
understanding easier to navigate.

```markdown
# [Discussion Topic]

## Purpose
[What is being explored, why it matters, and the useful boundary of the topic.]

## Current Synthesis
[The overall picture in a few paragraphs, readable on its own: the main
results and how they fit together. Point to the sections that hold the details
instead of retelling them. Rewrite it when the understanding changes; do not
append session summaries.]

## Conclusions
- **[Conclusion]** — [Rationale or evidence when it is not self-evident.]

## Decisions and Constraints
- **[Decision or constraint]** — [Why it shapes later work.]

## Open Questions
- [Question] — [Why the answer matters or what it would change.]

## Outcomes

### Ideas
- **[Idea]** — [What emerged and which conclusions support it.]

### Related Discussions
- [Discussion name](related-discussion.md) — [Boundary and relationship.]

## Superseded Conclusions
- **Previously:** [Material former conclusion.]
  **Replaced by:** [Current conclusion and why the change matters.]
```

## Editing Rules

- Treat `Purpose` as the scope boundary. Change it when the user deliberately
  reframes the topic, not as a way to make accumulated tangents appear relevant.
- State settled points plainly and keep uncertainty in `Open Questions` rather
  than weakening every sentence with caveats.
- Record rationale beside the conclusion or decision it supports. Avoid a
  detached evidence dump.
- `Superseded Conclusions` is exceptional. Use it only when forgetting the old
  conclusion and why it changed could cause future work to repeat a mistake.
- Use relative Markdown links so the dossier remains portable with the project.
