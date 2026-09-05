---
name: openspec-gherkin-authorin
description: Authors and reviews Gherkin-style requirements and behavioral scenarios in OpenSpec Markdown specifications. Use when creating or improving OpenSpec spec artifacts, acceptance criteria, or scenario examples while preserving the active schema and template.
---

# Gherkin-Style OpenSpec Authoring

## Purpose

Write OpenSpec requirements as business rules illustrated by concrete,
testable examples. Apply the behavioral semantics of Gherkin while keeping the
document in the exact Markdown structure required by the active OpenSpec schema.

Treat the OpenSpec structure as the semantic model:

| OpenSpec element | Gherkin-style meaning |
| --- | --- |
| Capability | Feature context |
| Requirement | Business rule |
| Scenario | Concrete example of the rule |
| `GIVEN` | Relevant starting state |
| `WHEN` | Meaningful action or event |
| `THEN` | Observable outcome |

These are semantic mappings, not instructions to add literal `Feature:` or
`Rule:` lines.

## Scope

Use this skill only for OpenSpec Markdown specifications. It does not author
standalone Gherkin feature files, Markdown with Gherkin documents, step
definitions, tests, implementation plans, or technical designs.

When reviewing or editing a spec, preserve unrelated requirements, scenarios,
operation sections, prose, and metadata. Change only the behavior or wording in
scope unless the active schema requires a broader structural correction.

## Read the Specification Contract

Before authoring, read the repository instructions and the active OpenSpec
artifact instructions, schema, and template. Also read the proposal and any
existing requirement being modified.

Apply the sources in this order:

1. Repository language and domain terminology.
2. The active OpenSpec schema and artifact instructions.
3. The active template and established spec style.
4. The Gherkin-style authoring guidance in this skill.

The schema owns exact paths, headings, operation sections, keyword spelling,
emphasis, and required fields. Preserve those forms exactly. Use the repository's
required language for names and prose while keeping structural markers in the
form required by the schema.

## Author the Behavior

1. Identify the capability and the delta operation the schema requires.
2. Write each `Requirement` as one independently understandable business rule.
   Put normative `SHALL` or `MUST` language in the requirement body when the
   schema requires it.
3. Illustrate the rule with the smallest set of scenarios needed to distinguish
   its important behavior. Include success, alternative, boundary, or failure
   cases only when they have materially different outcomes.
4. Write each scenario as one concrete example with relevant context, one
   meaningful event, and observable results.
5. Re-read the requirement and its scenarios together. The examples must
   demonstrate the rule without introducing behavior that the requirement does
   not state.
6. Review the finished Markdown against the active schema and template without
   translating it into standalone Gherkin syntax.

## Write Strong Scenarios

### GIVEN: establish relevant state

- Include `GIVEN` only when the scenario needs prior state to be understood.
- Describe facts that are true before the behavior begins.
- Keep only context that changes the outcome or makes the example unambiguous.
- Do not put the triggering user interaction or system event in `GIVEN`.

### WHEN: name the behavior trigger

- Describe one meaningful action or event.
- State intent at the domain level instead of scripting a sequence of incidental
  interface operations.
- Mention a UI control, API operation, message, or other channel when that
  channel is itself part of the externally visible contract.

### THEN: state observable consequences

- Describe what a user, caller, or external system can observe.
- Use precise outcomes that can be checked without guessing intent.
- Include multiple consequences only when they belong to the same behavioral
  outcome.
- Avoid internal database, class, function, queue, mock, or logging details
  unless they are explicitly part of the external contract.

Use the step markers and continuation style allowed by the active schema. Do not
introduce `And`, `But`, or another marker merely because standalone Gherkin
supports it.

## Keep Examples Useful

- Give scenarios specific names that communicate the situation or outcome;
  avoid names such as "Works", "Success", or "Error case" without context.
- Prefer concrete actors, states, values, and boundaries over abstract phrases
  such as "valid data" when the distinction matters.
- Keep each scenario independently understandable. Do not rely on scenario order
  or state created by another scenario.
- Keep scenarios short enough to reveal one behavior. Three to five clauses is a
  useful signal, not a hard limit.
- Avoid duplicating scenarios that exercise the same rule and produce the same
  observable result.
- Do not turn scenarios into implementation procedures or exhaustive test suites.

## Respect OpenSpec Delta Semantics

- Preserve exact operation and requirement headings from the active schema.
- For `MODIFIED`, carry forward the complete existing requirement block and all
  scenarios that remain valid, then edit the resulting full behavior.
- Do not force behavioral scenarios onto `REMOVED` or `RENAMED` entries when the
  schema defines different required fields for those operations.
- Do not add `Feature`, `Rule`, `Background`, `Scenario Outline`, `Examples`,
  tags, Doc Strings, Data Tables, or other standalone Gherkin constructs unless
  the active OpenSpec schema explicitly defines their Markdown representation.
- Remove template comments and placeholders from completed requirements.

## Example

A typical OpenSpec representation is:

```markdown
## ADDED Requirements

### Requirement: Expired password reset links are rejected

The system MUST reject a password reset link after its allowed lifetime.

#### Scenario: Customer uses an expired reset link

- **GIVEN** the customer's password reset link has expired
- **WHEN** the customer attempts to choose a new password with the link
- **THEN** the system informs the customer that the link has expired
- **THEN** the customer's password remains unchanged
```

The active schema and template take precedence over this example's exact
formatting.

## Verification

Before finishing, verify that:

- the file follows the active OpenSpec schema, template, and repository language;
- every added or modified requirement states one normative business rule;
- every required scenario has a specific name and demonstrates that rule;
- each `GIVEN` is prior state, each `WHEN` is a meaningful event, and each `THEN`
  is an observable result;
- scenarios do not add unstated behavior or unnecessary implementation detail;
- modified requirements retain all behavior that is meant to survive the change;
- removed and renamed entries follow their own schema-defined fields; and
- no unsupported standalone Gherkin constructs were introduced.
