# Discussion Curation Examples

Use these examples to judge what belongs in a maintained discussion dossier.
They illustrate the editing standard, not mandatory wording.

## Synthesize, Do Not Log

Conversation about a novel:

> Maybe first person would feel more intimate. Actually, the twist only works
> if the reader does not know what the narrator knows, so close third person is
> safer unless we move the reveal earlier. And no comic relief: the book should
> stay quiet and melancholic.

Bad capture:

```markdown
- We discussed first person.
- Then we discussed close third person.
- Tone also came up.
```

Good capture:

```markdown
## Conclusions
- **Tell the story in close third person.** First person would expose what the
  narrator knows before the twist.

## Decisions and Constraints
- **No comic relief.** The author wants the book to stay quiet and melancholic
  throughout.

## Open Questions
- Should the reveal move earlier? A positive answer reopens the point-of-view
  decision.
```

Treat a firm preference about tone, style, or taste as a durable constraint,
even when the user does not justify it.

## Surface an Independent Branch Early

Keep a branch in the current dossier when it merely supplies evidence or an
edge case. Propose a related discussion when it has its own purpose, unresolved
questions, and more than one plausible downstream outcome.

For example, a discussion about a game character's 3D model may note that the
character will be animated, so its joints need topology that deforms cleanly.
That stays inline. If the conversation expands into a choice of rigging
approach, motion-capture retargeting, and export to the game engine, do not
wait until the next dossier edit to notice the drift. Say:

> Deformation is still a constraint on the model, but the animation pipeline
> now has its own question and alternatives. I recommend branching it into
> `character-animation-pipeline`, scoped to rigging, motion-capture
> retargeting, and engine export. Shall I create that discussion and move
> there, or should we park it and return to the model?

If the user branches, retain only the parent-level implication in the model
dossier. If the user parks it, stop expanding the animation pipeline inside the
model discussion.

Do not split a thread merely because it has a recognizable label. For example,
an exploration of whether facial animation needs dedicated face topology stays
within the character model discussion while its answer directly shapes the mesh
and does not need a separate body of questions.

## Keep Topic Decomposition Ordinary

A discussion may itself ask how a body of future work should be divided. Treat
that as the topic, not as a signal to switch to a special planning format. For
example, a discussion about dividing notification-reliability work might
capture:

```markdown
## Current Synthesis
The work has two independently valuable boundaries: first make accepted
delivery attempts survive restarts, then decide retry behavior using the durable
attempt state. Provider failover remains unresolved because it depends on the
idempotency guarantees of candidate providers.

## Open Questions
- Do candidate providers offer idempotency keys across regions? The answer
  determines whether provider failover belongs in the same reliability model.
```

Record the emerging understanding in the dossier's ordinary synthesis,
conclusions, constraints, and questions. Create a separate plan or other
implementation artifact only when the user asks for one outside this workflow.
