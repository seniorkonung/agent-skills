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

## Split Only an Independent Branch

Keep a branch in the current dossier when it merely supplies evidence or an
edge case. Propose a related discussion when it has its own purpose, unresolved
questions, and more than one plausible downstream outcome.

For example, a discussion about notification reliability may mention provider
pricing as a constraint. That stays inline. If the conversation expands into a
choice of vendor, contracting model, migration strategy, and regional
availability, propose a separate `notification-provider-strategy` discussion
and retain only its parent-level implication in the reliability dossier.

## Bound a Future Change Without Writing Its Proposal

Too vague:

```markdown
#### `improve-notifications`
- Make notifications reliable.
```

Too close to an OpenSpec artifact:

```markdown
#### `improve-notifications`
[A complete proposal, normative scenarios, detailed design, and task list.]
```

Useful handoff:

```markdown
#### `persist-notification-attempts` — Failed deliveries survive worker restarts
- **Purpose:** Make delivery attempts durable before introducing retry policy.
- **In:** Persist attempt state and recover unfinished attempts on startup.
- **Out:** Backoff policy, provider failover, and user-facing preferences.
- **Depends on:** Nothing.
- **Handoff notes:**
  - **Specs:** A restart must not lose or duplicate an accepted notification.
  - **Design:** Preserve the conclusion that the database is the current
    coordination boundary; do not introduce Redis for this change.
  - **Tasks:** Land persistence and recovery before retry scheduling.
```

## Feed Back Only Cross-Cutting Discoveries

During implementation, a renamed helper and a local test fixture stay in the
OpenSpec change. A discovery that the provider cannot guarantee idempotency
belongs back in the discussion when it changes several candidate changes,
their ordering, or the shared reliability model.
