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

### Candidate OpenSpec Changes

#### `change-slug` — [Intended outcome]
- **Purpose:** [The independently valuable result.]
- **In:** [What belongs in this change.]
- **Out:** [Tempting adjacent work explicitly excluded.]
- **Depends on:** [Earlier candidates or external prerequisite, or "Nothing".]
- **Handoff notes:**
  - **Proposal:** [Motivation or scope information needed later.]
  - **Specs:** [Observable behavior, constraints, or edge cases needed later.]
  - **Design:** [Technical direction or trade-off needed later.]
  - **ADR:** [Decision whose rationale must be preserved.]
  - **Tasks:** [Execution or sequencing knowledge needed later.]

## Superseded Conclusions
- **Previously:** [Material former conclusion.]
  **Replaced by:** [Current conclusion and why the change matters.]
```

## Editing Rules

- Keep `Current Synthesis` readable without requiring the rest of the document.
- Put stable results in `Conclusions`; keep uncertainty explicit in
  `Open Questions` rather than weakening every sentence with caveats.
- Record rationale beside the conclusion or decision it supports. Avoid a
  detached evidence dump.
- In candidate changes, include only handoff labels that carry actual
  information. An empty `Specs` or `ADR` label is noise.
- A candidate change should deliver one independently reviewable outcome. If
  its `In` list contains separate outcomes or its handoff notes describe
  unrelated architectures, split it or record the unresolved decomposition as
  an open question.
- `Superseded Conclusions` is exceptional. Use it only when forgetting the old
  conclusion and why it changed could cause future work to repeat a mistake.
- Use relative Markdown links so the dossier remains portable with the repo.
