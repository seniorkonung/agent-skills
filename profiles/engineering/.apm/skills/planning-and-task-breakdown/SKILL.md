---
name: planning-and-task-breakdown
description: Convert clear specifications, design decisions, or scoped requirements into a dependency-ordered implementation task artifact with small verifiable tasks, explicit acceptance criteria, verification, dependencies, likely files, and size estimates. Use when creating or revising an implementation checklist, estimating scope, sequencing risky work, or exposing work that can run in parallel.
---

# Planning and Task Breakdown

## Overview

Decompose work into small, verifiable tasks with explicit acceptance criteria. Every task should be small enough to implement, test, and verify in a single focused session.

## When to Use

- You have a spec, design, or clear requirements and need implementable tasks
- A task feels too large or vague to start
- Work needs to be parallelized across multiple agents or sessions
- You need to communicate scope to a human
- The implementation order is not obvious
- Another workflow asks for an implementation task artifact

**When NOT to use:** Single-file changes with obvious scope, or when the supplied spec already contains well-defined, implementation-ready tasks.

## The Planning Process

### Step 1: Analyze Before Implementation

Before writing implementation code, operate in read-only mode:

- Read the spec, design decisions, and relevant codebase sections
- Identify existing patterns and conventions
- Map dependencies between components
- Note risks and unknowns
- Re-read supplied artifacts when they may have changed

Treat the caller's template, content rules, and output target as authoritative. Produce only the requested task artifact at the caller-supplied target. Do not hard-code an output path, create companion planning documents, or modify implementation code.

If an unknown would change scope, architecture, interfaces, or the task graph, resolve it with the user before drafting tasks. Do not hide unresolved decisions inside task descriptions.

### Step 2: Identify the Dependency Graph

Map what depends on what:

```text
Database schema
    │
    ├── API models/types
    │       │
    │       ├── API endpoints
    │       │       │
    │       │       └── Frontend API client
    │       │               │
    │       │               └── UI components
    │       │
    │       └── Validation logic
    │
    └── Seed data / migrations
```

Implement prerequisites before their consumers. After a shared contract is fixed, independent branches may proceed in parallel. Place high-risk validation as early as its prerequisites allow.

### Step 3: Slice Vertically

Instead of building all the database, then all the API, then all the UI, build one complete feature path at a time.

**Bad — horizontal slicing:**

```text
Task 1: Build the entire database schema
Task 2: Build all API endpoints
Task 3: Build all UI components
Task 4: Connect everything
```

**Good — vertical slicing:**

```text
Task 1: User can create an account (schema + API + UI + focused tests)
Task 2: User can log in (auth + API + UI + focused tests)
Task 3: User can create a task (schema + API + UI + focused tests)
Task 4: User can view the task list (query + API + UI + focused tests)
```

Each vertical slice delivers working, testable functionality. Use a horizontal foundation task only when multiple slices genuinely share it.

### Step 4: Write Tasks

Group related tasks under numbered level-two headings. Place each primary task checkbox at column zero and use hierarchical numbering.

Each task follows this structure:

```markdown
## 1. Export

- [ ] 1.1 Add CSV export that produces a downloadable UTF-8 file for the current result set
  - **Acceptance criteria:**
    - The export contains the visible columns in the documented order
    - Values containing commas, quotes, or line breaks are escaped correctly
  - **Verification:**
    - Run `repository-focused-test-command -- csv-export`
    - Open a generated fixture in a spreadsheet application
  - **Dependencies:** None
  - **Files likely touched:** `src/export/csv.ts`, `tests/export/csv.test.ts`
  - **Estimated scope:** S (1-2 files)
```

Make the checkbox line self-contained: an implementer who sees only that line must still understand the required outcome. Use ordinary nested bullets for metadata.

**Bad — metadata becomes separate tracked tasks:**

```markdown
- [ ] 1.1 Implement CSV export
- [ ] Exported CSV opens in spreadsheet applications
- [ ] Export tests pass
```

This reports three tasks instead of one and separates the completion contract from the implementation task.

**Good — one tracked task with nested metadata:**

```markdown
- [ ] 1.1 Implement CSV export for the current result set
  - **Acceptance criteria:**
    - The generated file opens correctly in supported spreadsheet applications
  - **Verification:**
    - Run the focused export tests and inspect one generated fixture
  - **Dependencies:** None
  - **Files likely touched:** `src/export/csv.ts`, `tests/export/csv.test.ts`
  - **Estimated scope:** S (1-2 files)
```

Never use checkboxes for acceptance criteria, verification, dependencies, files, or scope. Task trackers must count only primary task lines.

### Step 5: Order and Checkpoint

Arrange tasks so that:

1. Dependencies are satisfied
2. Each task leaves the system in a working state
3. Verification checkpoints occur after every two or three implementation tasks when they form a meaningful phase
4. High-risk work appears early enough to fail fast
5. Independent slices reference only their real prerequisites

Add explicit tracked checkpoints:

```markdown
## 3. Checkpoint: Foundation

- [ ] 3.1 Verify the completed foundation before starting dependent feature work
  - **Acceptance criteria:**
    - All focused tests pass
    - The application builds without errors
    - The foundational flow works end-to-end
  - **Verification:**
    - Run `repository-focused-test-command`
    - Run `repository-build-command`
  - **Dependencies:** 1.1, 1.2, 2.1
  - **Files likely touched:** None (verification only)
  - **Estimated scope:** XS
```

Add a final checkpoint for the relevant end-to-end flow, full build, or broader test suite. Avoid vague checkpoints such as "verify everything."

## Task Sizing Guidelines

| Size | Files | Scope | Example |
|---|---:|---|---|
| **XS** | 1 | Single function, test, or config change | Add a validation rule |
| **S** | 1-2 | One component or endpoint | Add a focused API endpoint |
| **M** | 3-5 | One vertical feature slice | User registration flow |
| **L** | 5-8 | Too large; break it down | Search with filters and pagination |
| **XL** | 8+ | Too large; break it down | Entire subsystem |

Emit only XS, S, and M tasks. Treat L and XL as signals that further decomposition is required.

Break a task down further when:

- It would take more than one focused session, roughly two or more hours
- You cannot describe its acceptance criteria in three or fewer bullets
- It touches more than about five files
- It crosses two or more independent subsystems
- Its title joins independent outcomes with "and"

**Bad — oversized task:**

```text
Implement search with filtering, pagination, analytics, documentation, and tests.
```

**Good — smaller outcomes:**

```text
1. Basic search returns ranked results through the user-facing flow.
2. Filters narrow those results through the same flow.
3. Pagination preserves the query and active filters.
4. Search analytics records the approved events without blocking results.
5. Integration tests and public documentation cover the completed search flow.
```

## Output Artifact

- Follow the caller-provided template and output target
- Produce one task artifact, not separate plan and todo documents
- Group related tasks under numbered headings
- Use `- [ ] N.M ...` only for primary tracked tasks
- Include acceptance criteria, verification, dependencies, likely files, and estimated scope under every task
- Apply caller-provided context and rules as constraints without copying those instructions into the artifact

## Parallelization Opportunities

- **Safe to parallelize:** Independent vertical slices, tests for already-defined behavior, documentation
- **Must be sequential:** Migrations, shared contracts, shared state changes, dependency chains
- **Needs coordination:** Features that share an API or data contract; define the contract first, then parallelize consumers

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "I'll figure it out as I go" | Unresolved decisions discovered during implementation cause rework. |
| "The tasks are obvious" | Writing them down exposes hidden dependencies and missing verification. |
| "Planning is overhead" | A short dependency-aware plan prevents tangled implementation. |
| "I can hold it all in my head" | Written tasks survive session boundaries and context compaction. |

## Red Flags

- Starting implementation before the task artifact is ready
- Tasks that say "implement the feature" without a concrete outcome
- Acceptance criteria or verification written as separate checkboxes
- Missing verification steps or invented test commands
- All tasks sized L or XL
- No checkpoints between meaningful phases
- Dependencies missing or ordered after their consumers
- File paths invented without repository inspection
- Tasks that introduce behavior outside the approved requirements or design

## Verification

Before finalizing the artifact, confirm:

- [ ] Every task has specific acceptance criteria
- [ ] Every task has a concrete verification step
- [ ] Task dependencies are identified and ordered correctly
- [ ] Likely files come from repository inspection and are clearly estimates
- [ ] Every emitted task is XS, S, or M
- [ ] Only primary task lines use checkbox markers in the output artifact
- [ ] Checkpoints exist between meaningful phases and at final integration
- [ ] Every requested behavior is covered without adding unapproved scope
- [ ] The human has reviewed and approved the task artifact before implementation

## See Also

Read [definition-of-done.md](../../../references/definition-of-done.md) before finalizing the task artifact. Acceptance criteria answer "did we build the right thing?" The Definition of Done supplies the reusable quality, integration, documentation, and ship-readiness bar. Apply it without copying the full checklist into every task.
