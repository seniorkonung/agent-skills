# Discussion Curation Examples

Use these examples to judge what belongs in a maintained discussion dossier.
They illustrate the editing standard, not mandatory wording.

## Synthesize, Do Not Log

Conversation:

> We may need Redis. Actually, the current database lock is sufficient below
> our expected concurrency. Redis would only become necessary if workers move
> to multiple regions.

Bad capture:

```markdown
- We discussed Redis.
- Then we discussed database locks.
- Multi-region also came up.
```

Good capture:

```markdown
## Conclusions
- **Use the existing database lock at the current scale.** Redis adds no value
  until workers operate across multiple regions.

## Open Questions
- Will workers become multi-region? A positive answer reopens the coordination
  mechanism decision.
```

## Surface an Independent Branch Early

Keep a branch in the current dossier when it merely supplies evidence or an
edge case. Propose a related discussion when it has its own purpose, unresolved
questions, and more than one plausible downstream outcome.

For example, a discussion about notification reliability may mention provider
pricing as a constraint. That stays inline. If the conversation expands into a
choice of vendor, contracting model, migration strategy, and regional
availability, do not wait until the next dossier edit to notice the drift. Say:

> Provider cost is still a constraint on reliability, but vendor selection now
> has its own question and alternatives. I recommend branching it into
> `notification-provider-strategy`, scoped to vendor choice, contracting,
> migration, and regional availability. Shall I create that discussion and move
> there, or should we park it and return to reliability?

If the user branches, retain only the parent-level implication in the
reliability dossier. If the user parks it, stop expanding the provider strategy
inside the reliability discussion.

Do not split a thread merely because it has a recognizable label. For example,
an exploration of whether provider idempotency guarantees are sufficient stays
within notification reliability while its answer directly shapes the
reliability model and does not need a separate body of questions.

## Keep Topic Decomposition Ordinary

A discussion may itself ask how a body of future work should be divided. Treat
that as the topic, not as a signal to switch to a special planning format. For
example, useful capture might be:

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
