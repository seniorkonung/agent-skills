---
name: planning-and-task-breakdown
description: Convert clear specifications, design decisions, or scoped requirements into a dependency-ordered implementation task artifact with small verifiable tasks, explicit acceptance criteria, verification, dependencies, likely files, and size estimates. Use when creating or revising an implementation checklist, estimating scope, sequencing risky work, or exposing work that can run in parallel.
---

# Planning and Task Breakdown

Decompose approved work into small, ordered tasks that another agent can implement and verify without making unresolved product or architecture decisions.

## Honor the Artifact Contract

- Treat the caller's template, content rules, and output target as authoritative.
- Read the supplied requirements, design decisions, and relevant code before drafting tasks. Re-read source artifacts when they may have changed.
- Produce only the requested task artifact. Do not choose or hard-code its output location, create companion planning documents, or modify implementation code.
- Apply caller-provided context and rules as constraints without copying those instructions into the artifact.
- Ask the user to resolve any unknown that would change scope, architecture, interfaces, or the dependency graph. Do not encode a hidden assumption as a task.

## Build the Task Graph

1. Trace the requested behavior to its requirements and design decisions.
2. Inspect the repository for affected components, existing patterns, test commands, and likely files.
3. Map prerequisites such as contracts, migrations, shared infrastructure, and test fixtures.
4. Order dependencies before their consumers. Place high-risk validation as early as its prerequisites allow.
5. Prefer vertical slices that deliver testable behavior across layers. Keep shared foundations separate only when several slices depend on them.
6. Identify independent tasks that can run in parallel after their shared contracts are fixed.

Each task must produce one coherent outcome and leave the system in a working state. Split a task when its title joins independent outcomes with “and,” it crosses unrelated subsystems, or it cannot be completed and verified in one focused session.

### Example: Order by Dependency

Map prerequisites before numbering tasks:

```text
Shared data contract
├── Server validation
│   └── API endpoint
└── Client types
    └── UI flow
        └── End-to-end verification
```

Build the shared contract before either consumer. After that contract is fixed, server validation and client types may proceed in parallel. Do not place the UI flow before the client types merely because the UI is the visible part of the feature.

### Example: Prefer Vertical Slices

Avoid horizontal slices that postpone integration until the end:

```text
1. Build the entire database layer
2. Build all API endpoints
3. Build all UI components
4. Connect everything and test it
```

Prefer complete, independently verifiable behavior:

```text
1. Registration works end-to-end (storage + API + UI + focused tests)
2. Login works end-to-end (authentication + API + UI + focused tests)
3. Task creation works end-to-end (storage + API + UI + focused tests)
```

Use a horizontal foundation task only when multiple vertical slices genuinely share it.

## Size Tasks

Use only these sizes:

| Size | Typical files | Scope |
|---|---:|---|
| **XS** | 1 | Narrow function, test, or configuration change |
| **S** | 1-2 | One component, endpoint, or focused behavior |
| **M** | 3-5 | One vertical feature slice |

Split work larger than M. Also split a task if it needs more than three acceptance criteria, is likely to take more than roughly two hours, or combines independently verifiable behavior.

### Example: Split Oversized Work

Avoid:

```text
Implement search with filtering, pagination, analytics, documentation, and tests.
```

Prefer:

```text
1. Basic search returns ranked results through the user-facing flow.
2. Filters narrow those results through the same flow.
3. Pagination preserves the query and active filters.
4. Search analytics records the approved events without blocking results.
5. Integration tests and public documentation cover the completed search flow.
```

Each item now has one outcome, a smaller file surface, and an independent verification target.

## Write the Artifact

Group related tasks under numbered level-two headings. Place every tracked task marker at column zero and use hierarchical numbering.

Avoid turning acceptance criteria and verification into additional tracked tasks:

```markdown
## 1. Export

- [ ] 1.1 Implement CSV export
- [ ] Exported CSV opens in spreadsheet applications
- [ ] Export tests pass
```

This hides the actual task contract and makes a tracker report three tasks instead of one.

Prefer one self-contained tracked task with nested, non-checkbox metadata:

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

Apply these rules to every task:

- Make the checkbox line self-contained. An implementer who sees only that line must still understand the required outcome.
- Use a checkbox only for the primary task line. Use ordinary nested bullets for acceptance criteria, verification, dependencies, files, and scope so task trackers do not count metadata as separate work.
- Limit acceptance criteria to specific, observable conditions. Do not restate the full specification.
- Make verification concrete. Use repository commands discovered during inspection, plus a manual check only when automation cannot prove the behavior.
- Reference prerequisite task numbers under **Dependencies**, or write `None`.
- List paths found during repository inspection under **Files likely touched**. If the exact path is genuinely unknown, name the component or area and mark it as approximate; never invent a path.
- Treat the file list and size as planning estimates, not permission to ignore relevant code discovered during implementation.
- Mark a task complete only after its acceptance criteria and verification pass.

## Add Checkpoints

- Add a tracked integration or verification task after every two or three implementation tasks when they form a meaningful phase.
- Add a final tracked task for the relevant end-to-end flow, full build, or broader test suite.
- Keep checkpoint descriptions executable and specific; avoid generic tasks such as “verify everything” or “review with human.”
- Keep independent slices parallelizable by referencing only their real prerequisites.

## Review Before Emitting

Confirm that:

- every requested behavior is covered and every task traces to approved scope;
- no task introduces behavior absent from the requirements or design;
- dependencies reference existing task numbers and the ordering satisfies them;
- every task has acceptance criteria, verification, likely files, and an XS/S/M estimate;
- only primary task lines use checkbox markers;
- no task is larger than M;
- the artifact contains no unresolved decision that would change implementation.

## See Also

Read [definition-of-done.md](definition-of-done.md) before finalizing the task artifact. Use it as the standing completion bar without copying its full checklist into every task: acceptance criteria define task-specific success, while the Definition of Done defines the reusable quality, integration, documentation, and ship-readiness standard.
