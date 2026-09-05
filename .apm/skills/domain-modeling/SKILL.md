---
name: domain-modeling
description: Build and sharpen a project's domain model. Use when clarifying key domain concepts, writing or editing a CONTEXT.md, or recording or maintaining ADRs and their index.
---

# Domain Modeling

Build shared understanding of the project's key concepts as you design. Resolve
meaningful ambiguity, capture agreed definitions, and preserve the reasons for
significant decisions. Merely reading an existing glossary for vocabulary does
not require this workflow.

## File structure

First read project instructions and find existing glossaries, context maps,
specifications, and ADR directories. Continue the project's locations, formats,
and document language. The structures below are defaults when no convention
exists.

A single context can use:

```
/
├── CONTEXT.md
├── docs/
│   └── adr/
│       ├── README.md
│       ├── 0001-event-sourced-orders.md
│       └── 0002-postgres-for-write-model.md
└── src/
```

If a `CONTEXT-MAP.md` exists, use it to select the relevant context. A repo with
multiple contexts can keep system-wide and context-specific decisions separately:

```
/
├── CONTEXT-MAP.md
├── docs/
│   └── adr/                          ← system-wide decisions
├── src/
│   ├── ordering/
│   │   ├── CONTEXT.md
│   │   └── docs/adr/                 ← context-specific decisions
│   └── billing/
│       ├── CONTEXT.md
│       └── docs/adr/
```

Each ADR directory has its own `README.md` index. Create files lazily: a glossary
when the first significant term is agreed, an ADR directory with its index when
the first decision needs recording. Discover existing context boundaries before
creating a root glossary; an absent map does not prove there is only one context.
If the topic's scope remains ambiguous, ask which context it belongs to.

## During the session

### Choose concepts worth defining

Prioritize the objects, roles, actions, states, and relationships through which
users and domain participants understand the product. Include internal or
technical concepts when they have an important domain meaning, such as ownership
or access boundaries. Being project-specific or having come up in conversation
does not by itself earn a term a glossary entry.

### Resolve consequential ambiguity

Before interrupting to clarify a term, identify plausible interpretations and
explain how they would change understanding of an important concept or scenario.
Use the established canonical term when the intended meaning is clear. Surface
actual conflicts with the glossary and resolve them before relying on the term:
"The glossary uses Customer for the purchaser and User for the person signed in.
Which role owns this subscription?"
Propose a clear canonical term when competing names obscure a useful distinction.

Probe concept boundaries with concrete scenarios relevant to the current task.
Stop when participants can interpret the important scenarios consistently.
Inventing increasingly remote edge cases to make a definition exhaustive is not
a goal. If a question concerns an operation's exact behavior, handle it as a
requirement rather than expanding the definition.

### Cross-reference with code

Check claims about current behavior against relevant code and specifications.
Distinguish observed behavior, intended changes, and unresolved questions. Surface
contradictions without treating existing implementation as the authority on what
the domain should mean.

### Update CONTEXT.md inline

Record agreed, significant definitions as they settle. A suggestion or an
unresolved interpretation is not yet canonical. Before writing or editing a
glossary entry, read [CONTEXT-FORMAT.md](./CONTEXT-FORMAT.md) for the boundary
between a definition and a specification, including examples.

Put detailed behavioral requirements in the project's specifications and storage
or implementation mechanics in technical documentation. Preserve agreed details
when moving them out of an existing glossary; use an appropriate existing
document or follow the project's documentation convention. Reasons for
significant decisions may warrant an ADR.

### Record and maintain decisions

Before creating or editing an ADR or its index, read
[ADR-FORMAT.md](./ADR-FORMAT.md). It defines when a decision merits a record,
status handling, history preservation, and the adjacent `README.md` index.

Maintain the index in the same change as the ADR. Before finishing, check that
glossary additions explain concepts, agreed details have an appropriate home,
and affected ADRs and indexes agree on status and replacement links.
