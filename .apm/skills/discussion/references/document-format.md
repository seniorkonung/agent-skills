# Discussion Document Format

Use this format as a content model, not a form to fill mechanically. Omit empty
sections and add domain-specific subsections when they make the current
understanding easier to navigate. Do not add YAML frontmatter.

```markdown
# [Discussion Topic]

## Purpose
[What is being explored, why it matters, and the useful boundary of the topic.]

## Current Synthesis
[A compact, coherent account of the best current understanding. Rewrite this
when the understanding changes; do not append session summaries.]

## Conclusions
- **[Conclusion]** — [Rationale or evidence when it is not self-evident.]

## Decisions and Constraints
- **[Decision or constraint]** — [Why it shapes later work.]

## Open Questions
- [Question] — [Why the answer matters or what it would change.]

## Outcomes

### Ideas
- Candidate: **[Idea]** — [What emerged and which conclusions support it.]
- Created: [Idea name](../ideas/idea-name.md) — [Relevant relationship.]

### Related Discussions
- [Discussion name](related-discussion.md) — [Boundary and relationship.]

## Superseded Conclusions
- **Previously:** [Material former conclusion.]
  **Replaced by:** [Current conclusion and why the change matters.]
```

## Editing Rules

- Keep `Current Synthesis` readable without requiring the rest of the document.
- Treat `Purpose` as the scope boundary. Change it when the user deliberately
  reframes the topic, not as a way to make accumulated tangents appear relevant.
- Put stable results in `Conclusions`; keep uncertainty explicit in
  `Open Questions` rather than weakening every sentence with caveats.
- Record rationale beside the conclusion or decision it supports. Avoid a
  detached evidence dump.
- For a related discussion, keep only its link, boundary, relationship, and any
  implication needed to understand the parent. The child owns its detailed
  synthesis and questions.
- `Superseded Conclusions` is exceptional. Use it only when forgetting the old
  conclusion and why it changed could cause future work to repeat a mistake.
- Use relative Markdown links so the dossier remains portable with the repo.
