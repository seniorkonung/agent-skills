# Evaluating Agent Skills

Read this reference when a new or changed skill is expected to alter agent
decisions, produce important artifacts, enforce discipline, or interact with
external state. Match evaluation effort to the claim and risk.

## Choose an Evaluation Level

| Change | Minimum useful evidence |
|---|---|
| Typo, link, or exact mechanical wording | Structural validation and focused diff |
| Trigger description or narrow instruction | Positive and near-miss trigger cases; focused behavioral check |
| New workflow or substantial rewrite | Realistic with-skill runs, baseline comparison, and human review |
| Safety-critical or stateful workflow | Comparative runs plus isolated integration tests, rollback checks, and explicit untested boundaries |

A larger test suite is not automatically better. Every case should distinguish a
useful skill from baseline model behavior or expose a realistic failure.

## Define the Claim First

State what the skill is supposed to improve before choosing prompts. Examples:

- The agent asks about the decision-maker before drafting a status-report skill.
- A debugging skill investigates root cause instead of patching the first symptom.
- A database-maintenance skill defaults to a dry-run and refuses unauthorized
  production writes.
- A description activates for pull-request review but not for prose editing.

Prefer observable decisions and artifacts over exact phrases or heading names.
Do not make an eval pass only because the agent repeated language from the skill.

## Build Realistic Cases

For a substantial change, start with two or three prompts that vary in wording and
context:

- a central case the skill clearly owns;
- an ambiguous or pressured case likely to expose the failure;
- a near-miss that should not activate the skill or should take a fast path.

Use concrete constraints, file paths, inputs, and stakes when they are relevant.
Avoid quiz prompts such as "What does the skill say?" The run should require the
agent to make the decision the skill is meant to improve.

## Compare Against a Baseline

Run the same prompt under comparable conditions:

1. **Baseline:** no skill for a new capability, or the unchanged skill for an
   update.
2. **Candidate:** the new or revised skill.
3. **Review:** compare observable outcomes, unnecessary work, safety, time, and
   context use.

Consider independent subagents when complexity or risk makes separate context
valuable and delegation is available and authorized. Give them only the task,
skill path, input artifacts, permitted resources, and output location. Do not
reveal the expected winner, suspected bug, or author's reasoning. Sequential
evaluation is valid when it is sufficient or delegation is unavailable,
unauthorized, or disproportionate; acknowledge when the evaluator has more
context than an independent agent would.

Keep baselines that already behave well. A skill that adds ceremony, tokens, or
constraints without improving the outcome is a regression even if it follows its
own instructions perfectly.

## Evaluate Triggering Separately

The description is a routing interface. Test it with realistic pairs:

- different phrasings that should activate the skill;
- adjacent tasks using similar words that should not;
- cases where another skill or mechanism should win;
- narrow edits that should activate the skill but remain on its fast path.

When the harness exposes trigger optimization, use it as an optional enhancement.
Keep a human-reviewed set of positive and negative queries, and avoid optimizing
only against obvious keyword matches.

## Review Quality Without Fake Precision

Use programmatic assertions for deterministic properties such as:

- required files exist;
- frontmatter is valid;
- generated data matches a schema;
- a dry-run made no writes;
- every planned mutation has a rollback record.

Use human or rubric-based review for judgment such as clarity, usefulness,
appropriate pushback, or visual quality. Explain the rubric before interpreting
the results. A subjective score should guide discussion, not masquerade as a
measurement with production certainty.

Inspect transcripts as well as final artifacts. A polished result may hide wasted
work, silent assumptions, unsafe attempts, or accidental success.

## Test Stateful Skills Safely

Testing authorization is not mutation authorization. Progress through the safest
representative layers available:

1. Test pure matching, planning, validation, and transformation logic with
   fixtures.
2. Test integrations against fakes, mocks, or local emulators where appropriate.
3. Use a disposable resource or isolated database matching the real engine and
   schema.
4. Rehearse with synthetic or properly authorized sanitized production-shaped
   data.
5. Perform read-only discovery or a dry-run against the target environment only
   when authorized.
6. Run a bounded write canary only with explicit approval, monitoring, rollback,
   and a defined stop condition.

Verify relevant failure properties:

- least privilege and target-environment checks;
- idempotency and retry behavior;
- transaction and partial-failure handling;
- rollback or compensation after downstream side effects;
- concurrency and stale-plan detection;
- batch limits, rate limits, and invariant-based stops;
- audit evidence without leaked secrets or sensitive data.

If a safe representative layer does not exist, stop at the strongest available
evidence and state exactly what remains untested. Do not use production to close a
confidence gap the user did not authorize.

## Iterate From Evidence

Revise the skill only when a run exposes a general problem:

- replace a weak model or explanation before adding exceptions;
- add a reusable script when several runs independently recreate the same
  deterministic helper;
- move conditional detail to a reference when it burdens unrelated runs;
- tighten the description when routing cases fail;
- remove instructions that add work without changing outcomes.

Repeat the affected cases after a revision. Expand the suite only after the small
set produces a stable improvement.

Stop when the user is satisfied, the important cases show no meaningful gap, or
additional iterations no longer improve the result. Report variance, limitations,
and unresolved risks rather than optimizing indefinitely.

## Capability Fallbacks

| Preferred capability | Portable fallback |
|---|---|
| Parallel subagent runs | Sequential isolated runs |
| Browser or MCP review viewer | Present prompts, artifacts, results, and feedback in conversation |
| Trigger optimizer | Human-reviewed positive and near-miss query set |
| Repository validator | Manual frontmatter, naming, link, and resource checks |
| Disposable cloud environment | Local emulator, fixture-driven plan test, or explicit untested boundary |

The evaluation is complete when the evidence supports the claim actually being
made, not when every optional tool has been used.
