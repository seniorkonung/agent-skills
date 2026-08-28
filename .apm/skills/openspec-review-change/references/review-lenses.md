# Risk-Based Review Lenses

Read this reference completely before creating or refreshing the coverage map.
It is a routing guide for engineering judgment, not a checklist to paste into
`review.md`. Apply a lens deeply when evidence makes it relevant, and record a
concise evidence-based reason when it is not applicable.

## Select Lenses From the Change Surface

Build the change surface from all available evidence:

- proposal outcomes and declared scope;
- added, modified, removed, or renamed requirements and scenarios;
- design and ADR decisions, including rejected alternatives and open questions;
- tasks, verification steps, deployment work, and operational work;
- current code, schema, configuration, public interfaces, integrations, and
  project instructions affected by the proposal;
- canonical specs and prior decisions that constrain the change.

Do not infer impact from filenames alone. Follow dependencies and runtime data
flow far enough to identify affected callers, state, trust boundaries, failure
paths, and operators.

Four lenses are always applicable:

1. Intent and scope
2. Behavioral correctness
3. Cross-artifact coherence and traceability
4. Tasks and verification

Every other lens is conditional. A small change still receives an applicability
decision for each conditional lens, but `not-applicable` is a valid and desirable
result when supported by evidence.

## Core Lenses

### Intent and Scope

Review whether the proposal names the actual problem, observable outcome,
affected users or operators, explicit non-goals, and a change boundary narrow
enough to implement coherently.

Look for:

- a solution described without the problem or success condition;
- capabilities implied by tasks but absent from the proposal;
- unrelated refactoring or platform work hidden inside the change;
- named non-goals contradicted by specs, design, or tasks;
- assumptions that materially change scope but were never confirmed.

Evidence should connect stated outcomes to repository reality, existing behavior,
or an explicit human decision.

### Behavioral Correctness

Review the externally observable contract, not only the happy path. Requirements
and scenarios should settle boundary values, invalid inputs, authorization,
empty or missing state, partial failure, retry or cancellation where relevant,
and the behavior of modified or removed capabilities.

Ask whether an implementer and a tester could independently reach the same
conclusion about what must happen. Ambiguity that changes accepted behavior is a
finding, not an implementation detail.

### Cross-Artifact Coherence and Traceability

Trace every material proposal outcome through the actual schema dependency graph:

```text
intent -> requirements -> technical decisions -> implementation tasks -> verification
```

Custom artifacts such as ADRs may sit at different points in this graph. Use the
resolved OpenSpec schema rather than assuming the default file set or ordering.

Check both directions:

- every upstream commitment has downstream implementation and verification;
- every downstream task is justified by an approved upstream commitment;
- terms, invariants, error semantics, and chosen alternatives remain consistent;
- superseded decisions and resolved open questions are updated everywhere they
  affect.

### Tasks and Verification

Tasks must be dependency ordered, independently verifiable, and small enough to
execute without inventing unresolved requirements. Each material requirement,
decision, migration, configuration change, telemetry obligation, compatibility
measure, and rollback step needs an owning task or a documented reason why no
implementation work is required.

Verification must name observable evidence and use repository-supported commands
or procedures. Do not invent commands, defer all testing to a final task, or use
"tests pass" as proof for behavior that needs migration, integration, failure,
operational, accessibility, or rollout verification.

## Conditional Lenses

### Architecture and Module Design

Apply when the change adds or moves responsibilities, introduces a reusable
abstraction, changes dependency direction, crosses subsystem seams, or establishes
a pattern future code will follow.

Review:

- ownership of behavior and data;
- interface size, invariants, error modes, and performance expectations;
- whether the abstraction hides meaningful complexity or merely forwards it;
- dependency direction, coupling, locality, and circularity risk;
- test seams grounded in real variation rather than hypothetical adapters;
- consistency with existing architecture and explicit justification for a new
  pattern.

Do not demand a new abstraction for one stable call path. Do create a finding when
the proposed shape scatters one responsibility, duplicates a canonical mechanism,
or exposes implementation complexity to every caller.

### Public Interfaces and Compatibility

Apply to APIs, events, commands, schemas, shared types, configuration contracts,
file formats, extension points, or behavior consumed outside the owning module.

Review versioning, input and output semantics, defaults, error contracts,
deprecation, backward and forward compatibility, consumer migration, and mixed
version behavior. Identify callers from the repository rather than assuming the
declared list is complete.

### Data and Database Behavior

Apply when persistent or shared state is read, written, constrained, queried,
cached, replicated, retained, or deleted.

Review:

- data model invariants, ownership, nullability, uniqueness, and referential
  integrity;
- transaction boundaries, isolation assumptions, race conditions, and lost
  updates;
- query shapes, indexes, pagination, N+1 risk, unbounded reads, and hot paths;
- retention, deletion, recovery, backup, audit, and privacy requirements;
- cache consistency and the source of truth;
- test data and representative volume.

Do not accept "use the database" as a design. The artifacts should make the
important state and consistency decisions implementable and testable.

### Migrations and Data Transformation

Apply to schema changes, backfills, data conversion, reindexing, storage moves,
or semantic changes to persisted values.

Review:

- compatibility across deploy order and mixed application versions;
- expand/migrate/contract sequencing when zero-downtime compatibility matters;
- backfill batching, throttling, checkpoints, retries, idempotency, and restart;
- locks, table rewrites, resource consumption, and production-scale duration;
- validation before and after migration, including invariant and row-count checks;
- rollback or roll-forward strategy and the point of irreversibility;
- partial-failure recovery, monitoring, ownership, and stop conditions;
- when old columns, formats, or code paths can be removed safely.

A reversible DDL statement is not a complete rollback plan when the migration
changes or destroys data.

### Configuration, Secrets, and Feature Flags

Apply when behavior varies by environment, tenant, deployment, runtime setting,
secret, or feature flag.

Review:

- configuration ownership, schema, type, validation, documented defaults, and
  failure on invalid or missing values;
- precedence and whether startup, reload, or per-request evaluation is intended;
- safe defaults and environment parity;
- secret sourcing, rotation, redaction, and least-privilege access;
- flag targeting, both-state testing, rollout, ownership, expiry, and cleanup;
- whether configuration is being used to avoid making a stable design decision.

### External Integrations and Dependencies

Apply to network services, queues, webhooks, SDKs, packages, infrastructure APIs,
or data controlled by another system.

Review the trust and failure boundary: authentication, authorization, validation,
timeouts, retry policy, idempotency, rate and quota limits, backpressure,
pagination, ordering, duplicate delivery, contract drift, fallback, and operator
visibility. For a new dependency, also review maintenance, provenance, version
pinning, lifecycle scripts, licensing when relevant, and exit strategy.

Use official documentation for version-sensitive claims. Record source and
access date in the finding or decision evidence rather than copying large
external guides into the artifacts.

### Reliability, Concurrency, and Failure Handling

Apply when the change performs I/O, asynchronous work, distributed coordination,
retries, scheduling, background processing, shared-state mutation, or long-running
work.

Review failure atomicity, idempotency, duplicate and out-of-order delivery,
timeouts, cancellation, bounded retries and backoff, overload behavior,
backpressure, recovery after restart, poison work, dead-letter handling, and
operator intervention. State which invariants survive partial completion.

### Security and Privacy

Apply when the change crosses a trust boundary, handles untrusted input,
authenticates or authorizes, changes permissions, processes sensitive data,
executes generated content, or integrates with an external party.

Review assets and actors, abuse cases, input and output handling, authorization at
the resource boundary, least privilege, secret and PII exposure, tenant isolation,
auditability, denial-of-service limits, data lifecycle, and safe failure. Security
controls must trace into requirements, design, tasks, and tests rather than appear
as a generic checklist item.

### Performance and Capacity

Apply when the change affects a hot path, query volume, payload size, fan-out,
storage growth, concurrency, startup, rendering, or a known service objective.

Review workload assumptions, algorithmic and query cost, bounds, budgets,
capacity limits, caching tradeoffs, degradation behavior, and how performance will
be measured with representative data. Do not require optimization without a
plausible risk or target.

### Observability and Operations

Apply when the change runs in production and introduces a new critical path,
failure mode, dependency, background job, queue, migration, or operational
decision.

Start from questions an operator will need to answer. Review structured events,
bounded-cardinality metrics, traces across relevant boundaries, correlation,
health or progress signals, dashboards, actionable alerts, runbooks, and explicit
verification that telemetry works. Ensure telemetry avoids secrets and sensitive
data.

Do not require bespoke telemetry for a static documentation-only change. Do flag
a production workflow whose failure cannot be detected, diagnosed, or safely
stopped.

### Delivery, Rollout, and Rollback

Apply when deployment order, user exposure, persistent state, infrastructure,
feature flags, or a high-blast-radius behavior change matters.

Review prerequisites, staged rollout, compatibility window, health signals,
advance/hold/rollback criteria, rollback mechanics, irreversibility, cleanup, and
ownership. A statement such as "deploy normally" is insufficient when order or
state changes can make rollback unsafe.

### User Experience and Accessibility

Apply when users interact with new or changed UI, content, navigation, input,
errors, or asynchronous feedback.

Review complete user flows, empty/loading/error/success states, keyboard and
assistive-technology behavior, focus, semantics, localization, responsive
behavior, destructive-action safeguards, and usable recovery. Match depth to the
project's supported platforms and accessibility standard.

### Documentation and Domain Model

Apply when public behavior, setup, operations, terminology, or a durable
architectural decision changes.

Review which source of truth must change, whether domain terms match the canonical
glossary, whether an ADR records a genuinely durable decision and rationale, and
whether documentation tasks describe the final system rather than change history.

## Calibrate Findings

Assign severity from plausible impact, not the amount of text required to fix it:

| Severity | Use when |
|---|---|
| `critical` | The plan permits data loss, exploitable access, irreversible corruption, catastrophic outage, or implementation of fundamentally wrong behavior without a safe containment path. |
| `high` | A material requirement, invariant, migration property, compatibility measure, or production failure path is missing and likely to cause serious rework or operational harm. |
| `medium` | The gap materially weakens correctness, maintainability, testability, or operability but has bounded impact or a practical workaround. |
| `low` | A concrete, local quality gap is worth resolving before implementation but does not threaten the design or primary outcome. |

Every finding must contain specific evidence, a concrete impact, and an
observable required outcome. Recommend an implementation only when constraints
make it clearly preferable; otherwise preserve the human's decision space.

## Prevent Checklist Theater

- Do not copy this lens catalog into `review.md` as boilerplate.
- Do not treat missing sections as findings when the information is clear and
  testable elsewhere in the artifact graph.
- Do not require every production practice for every repository or change.
- Do not mark a lens `not-applicable` merely because the proposal forgot to
  mention it; inspect code and data flow first.
- Do not inflate a low-risk concern to force remediation.
- Do not lower engineering quality because a change is called an MVP or
  prototype; reduce capability scope when project instructions require
  production readiness.
- Use installed specialist skills as optional depth references when available,
  but keep this workflow functional without them.
