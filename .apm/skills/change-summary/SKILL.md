---
name: change-summary
description: Produces a causal, human-readable summary of repository work in the active task, connecting intent, substantive changes, resulting behavior, key decisions, verification, and limitations.
disable-model-invocation: true
---

# Change Summary

Explain repository work so a human can quickly judge its meaning and direction
without reading the diff. Give a causal account of the result, not an inventory
of edits or a replay of the session.

## Establish Scope and Evidence

Default to repository work from the active task: work performed under the current
agent's responsibility, including delegated work. Do not include unrelated work
merely because it is visible in the repository. Follow any broader or narrower
boundary the user gives. If plausible boundaries would materially change the
account, ask for the smallest clarification needed.

Use the conversation, request, specification, and plan to establish intent,
including intentions the agent inherited. Inspect the resulting repository state
as needed to verify facts and catch omissions. Git status, diffs, and history are
supporting evidence, not the organizing language; avoid forensic reconstruction
or Git mechanics unless they matter to the user.

Remain read-only while preparing the summary unless the user separately asks for
more changes.

## Write the Causal Account

Organize the work into a few meaningful themes. For each theme, make this
relationship clear in natural prose:

```text
intent or problem -> substantive change -> resulting effect
```

Explain what materially changed; why it was needed; and what it now enables,
prevents, simplifies, or makes more reliable. Include an implementation decision
or inherited constraint only when it helps assess the result or its trade-offs.

Distinguish observed facts from expected effects. State what verification
demonstrated, and do not present unexercised behavior as proven. Never invent a
rationale; identify it as unknown when the working context does not establish it.

Cover every materially distinct direction and consequential side effect without
replaying the diff:

- Group tests, documentation, configuration, generated artifacts, and mechanical
  edits with the substantive change they support.
- Give supporting work its own theme only when it creates a distinct behavioral,
  compatibility, security, data, dependency, or operational effect.
- Surface incidental, unplanned, or disconnected work when it materially changed
  the repository; it may reveal scope expansion.
- Do not enumerate files, symbols, lines, commands, commits, or task steps merely
  to demonstrate coverage.

Completeness concerns meaningful work, not the number of paths mentioned.

## Shape the Report for Fast Understanding

Lead with the net result. Use this order as an adaptive default rather than a
required template:

1. **Outcome:** the purpose and important before-to-after change.
2. **What changed and why:** a few cohesive themes connecting change, intention,
   and effect.
3. **How it works now or key decisions:** only when flow, structure, reasoning,
   or trade-offs materially aid understanding.
4. **Verification and limitations:** evidence obtained, unverified behavior,
   unfinished work, and important remaining constraints.

Merge or omit sections for small changes. For larger work, keep a concise
overview and add only enough detail to judge direction, consequences, and risk.

Prefer domain and behavior language over repository topology. Mention a path,
commit, or symbol only when it removes ambiguity or the user asks for it. Replace
vague activity statements such as "updated the backend" or "added tests" with
the concrete change, reason, effect, and evidence.

## Completion Check

Before returning the explanation, confirm that:

- the opening gives the meaningful before-to-after result and every material
  theme connects intent, change, and effect without a file inventory;
- claims, unknowns, verification, limitations, and unfinished work match the
  available evidence; and
- the report is concise enough for a fast first-pass judgment.
