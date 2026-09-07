# OpenSpec Change Review: persist-export

## Assessment

**Format version:** 1
**Result:** Changes needed
**Coverage status:** Complete
**Summary:** Export acknowledgement can precede storage. AR1 remains accepted.

**Validation:** openspec validate persist-export passed; runtime behavior was not tested.

## Findings

### F2 · High — Success can precede durable storage

- **Evidence:** src/export.js acknowledges a request before its write completes.
- **Impact:** A caller can receive success for a missing export.
- **Required change:** Align the contract, design, work, and verification on durable acknowledgement.

## Accepted risks

### AR1 · Legacy rollback remains manual

- **Evidence:** The legacy deployment has no automatic rollback path.
- **Potential impact:** Recovery takes longer during the deprecation window.
- **Acceptance rationale:** Automation costs more than the bounded remaining exposure.
- **Scope and assumptions:** Legacy deployments during September 2026 only.
- **Reopen when:** The deprecation deadline is extended or new legacy deployments appear.
- **Acceptance authority:** The change owner explicitly accepted manual rollback in the review discussion.
- **Originating finding:** F1
- **Acceptance lifetime:** Change-scoped

## Review coverage

Reviewed export persistence, failure handling, callers, and legacy rollback.
