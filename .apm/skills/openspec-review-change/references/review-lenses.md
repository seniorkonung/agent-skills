# Risk-Based Review Lenses

Use this guide to discover material concerns that the proposal may not mention.
Review the four core areas on every change, scan the activation map, then read the
detailed guidance only for conditional areas activated by repository evidence.

Do not copy this catalog into `review.md` or record a verdict for every lens. The
report needs a brief coverage note and concrete findings, not a completed
checklist.

## Build the Change Surface

Use all available evidence:

- the proposal's problem, outcomes, scope, and non-goals;
- added, changed, removed, or renamed requirements and scenarios;
- design decisions, alternatives, assumptions, and open questions;
- tasks, verification, deployment, and operational work;
- affected code, callers, state, configuration, integrations, and tests;
- canonical specs, domain language, and prior decisions.

Follow runtime data flow and dependencies far enough to find affected consumers,
trust boundaries, failure paths, deployment constraints, and operators. An impact
omitted from the proposal may be the most important finding.

## Core Review

### Intent and Scope

Check that the change names the real problem, affected users or operators,
observable success, non-goals, and a coherent boundary. Look for hidden platform
work, tasks unsupported by the proposal, contradictory non-goals, and assumptions
that materially change scope.

### Behavioral Correctness

Check the externally observable contract, including boundaries, invalid input,
authorization, empty state, partial failure, cancellation, retries, and removed
behavior where relevant. An implementer and a tester should independently reach
the same conclusion about what must happen.

### Coherence and Traceability

Trace both directions through the actual schema graph:

```text
intent -> requirements -> decisions -> tasks -> verification
```

Every upstream commitment needs downstream implementation and evidence. Every
downstream task needs upstream justification. Terms, invariants, error semantics,
and selected alternatives should agree across artifacts.

### Tasks and Verification

Check that tasks are dependency ordered, small enough to execute without design
invention, and cover every material requirement, migration, configuration,
telemetry, compatibility, documentation, rollout, and rollback obligation.
Verification should name observable evidence and repository-supported commands or
procedures rather than merely saying that tests pass.

## Conditional Activation Map

| Area | Activate when the change... |
|---|---|
| Architecture | adds or moves responsibility, changes dependency direction, or creates a reusable seam |
| Public interfaces | changes an API, event, command, schema, shared type, configuration contract, or file format |
| Data | reads, writes, constrains, caches, retains, or deletes persistent or shared state |
| Migrations | changes schema or transforms, moves, backfills, or reinterprets existing data |
| Configuration and secrets | varies by environment, tenant, flag, runtime setting, credential, or secret |
| External dependencies | calls a service, queue, webhook, SDK, package, or infrastructure API |
| Reliability and concurrency | performs I/O, async work, retries, scheduling, coordination, or shared-state mutation |
| Security and privacy | crosses a trust boundary, handles untrusted or sensitive data, or changes access |
| Performance and capacity | affects a hot path, query or payload volume, fan-out, storage growth, or a service objective |
| Observability and operations | adds a production path, failure mode, dependency, job, queue, migration, or operator action |
| Delivery and rollback | makes deployment order, staged exposure, persistent state, or reversibility important |
| User experience | changes UI, content, navigation, input, errors, or asynchronous feedback |
| Documentation and domain | changes public behavior, setup, operations, terminology, or a durable design decision |

Use the table as a discovery prompt, not proof of applicability. Inspect the
repository before deciding that an area is irrelevant; absence from the proposal
is not evidence of absence from the change.

## Conditional Review Guidance

### Architecture and Module Design

Review ownership of behavior and data, dependency direction, coupling, interface
invariants, error modes, and test seams. Ask whether a new abstraction actually
hides complexity or only forwards it. Flag scattered responsibility, duplicate
canonical mechanisms, circularity, or an exposed implementation concern that
every caller must now understand. Do not demand an abstraction for one stable
path.

### Public Interfaces and Compatibility

Review inputs, outputs, defaults, error contracts, versioning, deprecation,
consumer migration, and mixed-version behavior. Discover actual callers rather
than trusting a declared consumer list. Include events, configuration, shared
types, and file formats, not only HTTP APIs.

### Data and Database Behavior

Review ownership, invariants, nullability, uniqueness, referential integrity,
transactions, isolation, races, query shapes, indexes, pagination, retention,
deletion, recovery, audit, privacy, cache consistency, and representative volume.
The important consistency and lifecycle decisions must be implementable and
testable rather than hidden behind "use the database."

### Migrations and Data Transformation

Review deploy ordering and mixed-version compatibility; batching, throttling,
checkpoints, retries, and idempotency; locks, rewrites, resource use, and duration;
pre/post validation; partial-failure recovery; rollback or roll-forward; progress
monitoring, ownership, and stop conditions. Identify irreversible points. A
reversible DDL statement is not a rollback plan for destroyed or transformed
data.

### Configuration, Secrets, and Feature Flags

Review ownership, schema, validation, defaults, precedence, reload behavior, and
environment parity. For secrets, cover sourcing, rotation, redaction, and least
privilege. For flags, cover both-state testing, targeting, rollout, ownership,
expiry, and cleanup. Flag configuration used only to avoid a stable design
decision.

### External Integrations and Dependencies

Review authentication, authorization, validation, timeouts, retries, idempotency,
quotas, backpressure, pagination, ordering, duplicates, contract drift, fallback,
and operator visibility. For new dependencies, also inspect maintenance,
provenance, versioning, lifecycle scripts, licensing when relevant, and exit
strategy. Use official sources for version-sensitive claims.

### Reliability, Concurrency, and Failure Handling

Review failure atomicity, idempotency, races, duplicate and out-of-order work,
timeouts, cancellation, bounded retries, overload, backpressure, restart recovery,
poison work, dead letters, and operator intervention. State which invariants must
survive partial completion.

### Security and Privacy

Identify assets, actors, trust boundaries, and credible abuse cases. Review input
and output handling, resource-level authorization, least privilege, secrets and
PII exposure, tenant isolation, auditability, denial-of-service limits, data
lifecycle, and safe failure. Controls must trace into requirements, tasks, and
verification rather than appear as generic security prose.

### Performance and Capacity

Review workload assumptions, algorithmic and query cost, fan-out, bounds, budgets,
capacity limits, caching trade-offs, degradation, and measurement with
representative data. Require optimization only when evidence identifies a
plausible risk or target.

### Observability and Operations

Start with questions an operator must answer when the new path fails. Review
structured logs, bounded-cardinality metrics, traces and correlation, health or
progress signals, dashboards, actionable alerts, runbooks, and explicit
verification that telemetry works. Ensure telemetry avoids secrets and sensitive
data. Flag production behavior that cannot be detected, diagnosed, or safely
stopped; do not demand bespoke telemetry for static or documentation-only work.

### Delivery, Rollout, and Rollback

Review prerequisites, deployment order, compatibility windows, staged rollout,
health signals, advance/hold/rollback criteria, rollback mechanics,
irreversibility, cleanup, and ownership. "Deploy normally" is insufficient when
state or mixed versions can make rollback unsafe.

### User Experience and Accessibility

Review the complete flow, including empty, loading, error, success, recovery, and
destructive-action states. Cover keyboard and assistive-technology behavior,
focus, semantics, localization, and responsive behavior according to the
project's supported platforms and standards.

### Documentation and Domain Model

Review which source of truth must change, whether terminology matches canonical
domain language, whether a durable decision needs an ADR, and whether docs and
tasks describe the intended final system rather than the change history.

## Calibrate Findings

| Severity | Plausible impact |
|---|---|
| `critical` | Data loss, exploitable access, irreversible corruption, catastrophic outage, or fundamentally wrong behavior without safe containment |
| `high` | A missing material requirement, invariant, migration property, compatibility measure, or production failure path likely to cause serious harm or rework |
| `medium` | A bounded gap that materially weakens correctness, maintainability, testability, or operability |
| `low` | A concrete local issue worth resolving before implementation without threatening the primary outcome |

Every finding needs evidence, impact, and an observable required change. Preserve
the human's decision space when constraints do not make one implementation
clearly preferable.

Avoid checklist theater: do not demand every practice on every change, invent
findings to populate a report, or lower engineering quality merely because a
change is labelled an MVP. Match depth to credible impact.
