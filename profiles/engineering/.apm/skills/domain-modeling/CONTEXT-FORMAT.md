# CONTEXT.md Format

## Structure

```md
# {Context Name}

{One or two sentence description of what this context is and why it exists.}

## Language

**Order**:
{A one or two sentence description of the term}
_Avoid_: Purchase, transaction

**Invoice**:
A request for payment sent to a customer after delivery.
_Avoid_: Bill, payment request

**Customer**:
A person or organization that places orders.
_Avoid_: Client, buyer, account
```

## Rules

- **Select significant concepts.** Treat the glossary as the project's active
  domain language rather than an inventory of everything the system contains.
  Use the inclusion test below instead of relying on novelty or frequency alone.
- **Choose useful canonical language.** Prefer the agreed term. Use `_Avoid_` for
  names that would cause a real misunderstanding, and omit it when none are
  needed. Do not turn harmless wording variations into terminology disputes.
- **Keep definitions focused.** Usually one or two sentences explain the meaning
  and the distinctions a reader needs. Length alone is not the test: two long
  sentences can still hide an entire specification.
- **Group terms under subheadings** when natural clusters emerge. If all terms belong to a single cohesive area, a flat list is fine.

## Inclusion test

Actively consider the important nouns and verbs in user language, scenarios,
specifications, and code. Add an agreed term when at least one of these is true:

- it is needed to explain an important user or domain scenario;
- it distinguishes concepts that participants could reasonably confuse;
- it has a non-obvious meaning in this domain or differs from its everyday or
  industry meaning;
- it recurs as stable language across conversations, requirements, interfaces,
  or code;
- interpreting it differently would change domain identity, behavior, ownership,
  lifecycle, relationships, or system boundaries.

One strong reason is sufficient. A newly introduced core concept need not recur
before it belongs in the glossary, and a familiar term such as Customer can
qualify through its specific meaning in this domain. Technical concepts qualify
when they are part of the domain itself.

Do not add a term solely because it names an incidental field, interface control,
operation parameter, storage structure, or implementation helper. A difference
in operation-specific validation or persistence mechanics does not count as a
different domain meaning by itself.

## Definitions and detailed rules

For each detail, ask: does this explain what the concept means or distinguish it
from a neighboring concept, or does it prescribe how an operation works?

Keep defining relationships and distinctions in the glossary. For example,
completion belonging to a daily choice rather than to the underlying intention
can be essential to understanding both concepts. Put validation, defaults,
transition conditions, editing and deletion procedures, and storage mechanics in
the project's specifications or technical documentation. A rule affecting user
behavior does not automatically make it part of a definition.

| Concept | Useful definition content | Detail for a specification or technical document |
|---|---|---|
| Intention title, when participants need it as a domain term | User-provided name of an intention; distinct intentions can share a title. | Trimming surrounding whitespace, rejecting blank input, preserving internal spaces. |
| Daily choice | A dated choice of action connected to an originating intention through a saved selection path; completion belongs to that choice. | Which edits revalidate the path, whether changing the action preserves completion, and which references block deletion. |
| Selection path step | An element of a selection path, if participants need to discuss steps as a domain concept. | A pointer to the previous step, lack of duplicated entities, or snapshot storage. |
| Description, when it carries a distinct domain meaning | Optional explanatory text accompanying an intention or relationship. | Treatment of whitespace-only input and exact preservation of line breaks. |

These examples illustrate placement, not domain rules to adopt in other projects.
Do not give an incidental field or storage structure its own entry just to house
its constraints. Preserve details removed from an existing entry in the relevant
document; link to that document when it helps readers find the full rules.

## Coverage check

At natural pauses and before finishing glossary work, review the important
objects, roles, actions, states, transitions, relationships, ownership rules, and
boundaries introduced or changed by the current work. Apply the inclusion test to
each candidate. Every qualifying concept must have an existing or newly added
agreed concise definition; keep a significant unresolved meaning explicitly open
in the project's appropriate working document. Resolve material conflicts with
existing entries.

Scope this check to the current work and the concepts needed to understand it.
Audit the entire repository only when the user asks for a comprehensive domain
language review.

## Single vs multi-context repos

Follow existing glossary locations and context boundaries. These are default
layouts for projects without an established convention.

**Single context:** One `CONTEXT.md` at the repo root.

**Multiple contexts:** A `CONTEXT-MAP.md` at the repo root lists the contexts, where they live, and how they relate to each other:

```md
# Context Map

## Contexts

- [Ordering](./src/ordering/CONTEXT.md): receives and tracks customer orders
- [Billing](./src/billing/CONTEXT.md): generates invoices and processes payments
- [Fulfillment](./src/fulfillment/CONTEXT.md): manages warehouse picking and shipping

## Relationships

- **Ordering → Fulfillment**: Ordering emits `OrderPlaced` events; Fulfillment consumes them to start picking
- **Fulfillment → Billing**: Fulfillment emits `ShipmentDispatched` events; Billing consumes them to generate invoices
- **Ordering ↔ Billing**: Shared types for `CustomerId` and `Money`
```

Read an existing `CONTEXT-MAP.md` to find the relevant glossary. Without a map,
inspect existing documentation and context boundaries before choosing a location.
Create a root glossary lazily when the first significant term is agreed and the
project has a single context. When the topic spans contexts, keep each definition
in its owning context and use the map for their relationship. The same word may
have different meanings in different contexts; if ownership is unclear, ask.
