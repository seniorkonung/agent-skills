---
name: change-summary
description: Produces a causal, human-readable summary of repository work in the active task, connecting intent, substantive changes, resulting behavior, key decisions, verification, and limitations.
disable-model-invocation: true
---

# Change Summary

Explain repository work performed in the current working context so a human can
quickly judge its meaning and direction without reading the diff. Give a causal
account of the work, not an inventory of edits or a replay of the session.

## Establish the Work Being Explained

Default to repository work from the active task: work performed under the current
agent's responsibility, including delegated work. Do not include unrelated work
merely because it is visible in the repository. Follow any broader or narrower
boundary the user gives, such as the whole session or one completed task. If
multiple plausible boundaries would materially change the account, state the
ambiguity and ask for the smallest clarification needed.

Use the conversation and working context as the primary source of intent. Consult
the request, specification, plan, or other supplied requirements when they carry
the reason for a change. An intention remains part of the explanation even when
the agent inherited it rather than chose it.

Inspect the resulting repository state when useful to catch omissions or verify
facts. Git status, diffs, or commit history are supporting evidence, not the
organizing language of the report. Do not perform a forensic reconstruction when
the current context already explains the work, and do not expose Git mechanics
unless they matter to the user.

Remain read-only while preparing the summary unless the user separately asks for
more changes.

## Explain the Causal Story

Organize the work into a small number of meaningful change themes. For each
theme, make the following relationship understandable in natural prose:

```text
intent or problem -> substantive change -> resulting effect
```

Explain:

- what became different in behavior, structure, data, configuration, developer
  workflow, or operations;
- why the change was needed, including reasons established by higher-level
  requirements;
- what the change now enables, prevents, simplifies, or makes more reliable
  compared with the prior state; and
- why the implementation has its present shape when that choice is important to
  assessing the direction of the work.

Distinguish facts from expectations. Say what verification demonstrated and do
not present an intended effect as observed behavior when it was not exercised.
Do not invent a rationale after the fact. If the real reason is absent from the
working context, say that it is unknown rather than supplying a plausible story.

## Account for Work Without Replaying the Diff

Cover every materially distinct direction of work and every consequential side
effect, but summarize at the level a human needs to understand the result.

- Group supporting tests, documentation, configuration, generated artifacts,
  and mechanical edits with the substantive change they support.
- Give a supporting change its own explanation only when it creates a distinct
  behavioral, compatibility, security, data, dependency, or operational effect.
- Surface incidental or unplanned work when it changed the repository in a way
  the user should know about.
- Do not enumerate every file, symbol, line, command, commit, or task step merely
  to prove coverage.
- Do not omit a material change because it is difficult to fit into the main
  narrative; a disconnected theme may reveal scope expansion worth surfacing.

Completeness concerns the meaningful work, not the number of paths mentioned.

## Shape the Report for Fast Understanding

Use the following as an adaptive default, not a form that requires every heading:

```markdown
## Outcome

<Why the work was undertaken and the important before-to-after change.>

## What changed and why

<A few cohesive change themes. Connect each change to its intention and effect.>

## How it works now

<Include only when a short description of the resulting flow or structure makes
the change materially easier to understand.>

## Key decisions

<Include only decisions or inherited constraints that materially shaped the
result, with their reasoning and meaningful trade-offs.>

## Verification and limitations

<What evidence supports the result, what was not verified, and any important
remaining limitation or unfinished work.>
```

Lead with the net result. Merge or omit sections for small changes. For larger
work, preserve a concise overview and add detail only where it helps the human
judge direction, consequences, or risk.

Prefer domain and behavior language over repository topology. Mention a path,
commit, or symbol only when it removes real ambiguity or the user asks for it.
Avoid vague activity statements such as "updated the backend" or "added tests."
State what changed, why it mattered, and what the evidence establishes.

## Completion Check

Before returning the explanation, confirm that:

- the opening states the purpose and meaningful before-to-after result;
- every material change theme is represented without a file-by-file inventory;
- each theme connects what changed with why and to what effect;
- inherited intentions are explained rather than discarded as "just the plan";
- implementation choices are included only when they help assess the result;
- verification claims match evidence actually obtained;
- unknown rationales, unverified behavior, limitations, and unfinished work are
  explicit when material; and
- the report is concise enough to support a fast first-pass judgment.
