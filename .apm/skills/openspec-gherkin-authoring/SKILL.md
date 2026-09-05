---
name: openspec-gherkin-authoring
description: Clarifies requirements and illustrates them with readable Gherkin-style scenarios in OpenSpec Markdown. Use when drafting or reviewing behavioral specifications, choosing meaningful examples, or resolving ambiguity while following the active schema.
---

# Gherkin-Style OpenSpec Authoring

## Purpose

Write OpenSpec specifications that help people agree on the system's intended
behavior. State general requirements in prose and use Gherkin-style scenarios
to illustrate their meaning. Aim for clear rules, useful examples, and enough
precision to recognize whether the behavior satisfies the requirement.

Read the requirement and relevant agreed context before choosing examples. Use
the repository's language and domain terminology. Follow the active artifact
instructions, schema, and template for syntax and document structure; use only
the constructs they support. Keep edits within the requested scope.

## Keep Requirements Primary

- State obligations, constraints, and exceptions in the requirement text.
  Scenarios illustrate the rule; they do not replace its general statement or
  define the full extent of the requirement through a list of examples.
- Retain explanations, definitions, and shared context that help readers
  understand the behavior. A scenario may rely on this context without repeating
  it as setup steps.
- Keep detail proportional to the behavioral decision. Test fixtures, harness
  setup, assertion code, and exhaustive input combinations belong in test design.
- Preserve meaningful requirements even when the method of verification has
  not yet been chosen. Clarify uncertainty about behavior separately from
  uncertainty about how to test it.

## Choose Examples That Explain the Rule

- Identify the rule each scenario demonstrates. Split unrelated behaviors into
  separate examples; keep consequences of the same event together.
- Choose cases that distinguish business conditions, boundaries, or outcomes.
  Use representative examples where they make a rule easier to understand or
  expose ambiguity. Include boundary, failure, and alternative cases when their
  distinctions matter, without expanding into a test coverage matrix.
- Give each scenario a name that identifies its situation or expected outcome.
  Keep it short enough that the behavior remains apparent.
- Ensure the examples agree with the rule. Add an example when prose leaves an
  important interpretation unclear; do not require a separate scenario for
  every sentence. Surface missing decisions instead of silently extending or
  weakening the requirement.

## Express State, Event, and Result

- **GIVEN** describes prior state needed to understand this example. Omit it
  when no special starting context is relevant or the applicable context is
  already clear from the requirement. Do not add generic setup to fill a template.
- **WHEN** identifies one meaningful action or event. Express the actor's intent
  or the system event clearly, without incidental interaction sequences.
- **THEN** states consequences observable by a user, caller, or external system.
  Include multiple results when they belong to the behavior being demonstrated.

Use domain behavior as the level of description. UI controls, API operations,
messages, and other technical details belong in the scenario when they are part
of the contract being specified. Include implementation details only when they
are themselves an agreed constraint on the system.

## Use Enough Precision to Resolve Meaning

- Make the situation, event, and expected consequence understandable in the
  context of the specification. Avoid implicit dependence on the execution of
  another scenario.
- Replace empty claims such as "works correctly" or "handles errors gracefully"
  with the expected behavior. Terms such as "authorized user" or "valid data"
  are useful when the specification defines their meaning.
- Use exact values, times, and error text when they define or clarify the rule.
  Otherwise use meaningful domain conditions such as "an expired invitation";
  arbitrary identifiers, timestamps, and payloads need not be supplied.
- Distinguish example data from business limits. Do not invent thresholds,
  tolerances, or error policies to make the document appear more precise.
- When several materially different outcomes fit the wording, resolve the
  ambiguity from agreed context or identify the missing product decision.

## Example

Requirement: an invitation remains valid for 24 hours after it is issued and is
rejected once that period ends.

Scenario: the recipient attempts to accept an invitation at the expiry boundary.

- GIVEN the invitation was issued exactly 24 hours ago
- WHEN the recipient attempts to accept it
- THEN acceptance is refused because the invitation has expired

The exact duration belongs in the scenario because it defines the requirement's
business boundary. If expiration is defined elsewhere, prefer "an expired
invitation" instead of repeating the value. If the agreed context does not say
what happens at the boundary, surface that decision instead of choosing an
outcome. Render the rule and scenario using the active template's notation.

## Review Before Returning

Read the requirement and its scenarios together: can a reader understand what
the system promises, when the rule applies, and what its examples demonstrate?
Could materially different behaviors both appear to satisfy the wording? Clarify
such differences without filling in the mechanics of a future test.

Review the specification for contradictions, missing behavioral decisions, and
redundancy. Preserve agreed behavior when improving wording, and distinguish
proposed behavior changes from editorial corrections.
