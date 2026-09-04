# Evaluating Agent Skills

Read this reference when a specific uncertainty, reported failure, or operational
claim warrants behavioral testing. Match evaluation effort to the question, risk,
and user's time and token constraints.

## Choose an Evaluation Level

| Question | Useful evidence |
|---|---|
| Is the artifact well formed and consistent with the requirements? | Structural validation and careful review of the text, resources, and diff |
| Are the routing and decision boundaries clear? | Inspect realistic positive and near-miss examples; run a focused case if ambiguity remains |
| Does a change fix a reported behavior or improve an uncertain outcome? | A focused run; compare with the unchanged skill when the claim is improvement |
| Does an integration or safety property hold in operation? | An isolated test of that property and explicit untested boundaries |

Text review is a valid outcome when it answers the question. Do not turn the
number of edited lines into a required number of model runs. If the user limits
evaluation, complete the useful checks within that scope and state the remaining
uncertainty without claiming unobserved behavior.

## Define the Claim First

State the question or claim before choosing prompts. Examples:

- The agent asks about the decision-maker when that information is missing and
  changes what a status-report skill should produce.
- A debugging skill investigates root cause instead of patching the first symptom.
- A database-maintenance skill defaults to a dry-run and refuses unauthorized
  production writes.
- A description activates for pull-request review but not for prose editing.

Prefer observable decisions and artifacts over exact phrases or heading names.
Do not make an eval pass only because the agent repeated language from the skill.

## Build Realistic Cases

Start with the case most likely to answer the question. Add another only when it
covers a distinct uncertainty or guards against an obvious overfit. Useful choices
include:

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

Keep the model, instructions outside the skill, tools, and starting inputs the
same. Preserve the unchanged skill before editing when a comparison is planned.
Use separate contexts and output locations so one run does not inherit another's
answers or modified files. Vary the model only when that difference is the question.

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

The description is a routing interface. Review it against realistic pairs:

- different phrasings that should activate the skill;
- adjacent tasks using similar words that should not;
- cases where another skill or mechanism should win;
- narrow edits that should activate the skill but remain on its fast path.

Run a routing check when inspection leaves uncertainty or a misfire was reported.
A task with the skill explicitly loaded checks execution, not automatic discovery.

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

When runs were performed, inspect transcripts as well as final artifacts. A
polished result may hide wasted work, silent assumptions, unsafe attempts, or
accidental success. One successful run supports only the case observed; it does
not establish reliability across other contexts.

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

Revise the skill when inspection finds a concrete defect, a requirement changes,
or a run exposes a general problem:

- replace a weak model or explanation before adding exceptions;
- add a reusable script when several runs independently recreate the same
  deterministic helper;
- move conditional detail to a reference when it burdens unrelated runs;
- tighten the description when routing cases fail;
- remove instructions that add work without changing outcomes.

Recheck the affected instructions and resources after a revision. If a run exposed
the failure, repeat that case to check the fix. Expand only when a new failure or
unresolved question justifies the cost.

Stop when the question is answered, the user's evaluation limit is reached, or
additional iterations no longer add useful evidence. Report observed variation,
limitations, and unresolved risks rather than optimizing indefinitely.

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
