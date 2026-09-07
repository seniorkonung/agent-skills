# OpenSpec Implementation Review: <change-name>

## Assessment

**Format version:** 1
**Result:** Changes needed
**Coverage status:** Complete
**Coverage limitations:** <missing required pass, target, or verification evidence; omit when complete>
**Summary:** <highest-impact current conclusion; name each retained AR identifier>

## Review target

- **Baseline ref:** <tracking or user-supplied local ref>
- **Base commit:** <full base SHA>
- **Reviewed head:** <full HEAD SHA>
- **Target commits:** ["<full commit SHA>"]
- **Reviewable paths:** ["<exact repository-relative path>"]
- **OpenSpec change:** <same change name as the title>
- **OpenSpec schema:** <schema name>
- **Target scope:** Complete pre-push range
- **Baseline freshness:** Local ref state; no fetch performed
- **Planning evidence paths:** ["<reviewable path used as planning context; omit field when none>"]
- **Excluded worktree state:** ["<excluded dirty path; omit field when clean>"]

## Reviewed increment

### U1 · <short intended outcome>

- **Work items:** ["<attributable task ID or stable label>"]
- **Requirements and scenarios:** ["<affected ID or stable label>"]
- **Affected boundary:** <actor or system boundary>
- **Implementation target:** ["<exact changed delivery or test path in the recorded range>"]
- **Applicable constraints and non-goals:** <mechanism-neutral summary>
- **Excluded change scope:** <untouched future work; omit when obvious>

## Unmapped range

- **Unmatched target paths:** ["<unmapped reviewable path; omit section when none>"]
- **Reason:** <mapping uncertainty or evidence of unrelated work>

## Pass coverage

| Pass | Status | Evidence or limitation |
|---|---|---|
| Independent decision review | Complete | <fresh reviewer and exact path boundary for every unit or overlap group> |
| OpenSpec conformance | Complete | <verification and validation commands, results, execution location and revision> |
| Code quality | Complete | <areas and checks covered at the recorded revision> |

## Findings

### F1 · High — <concise problem>

- **Evidence:** <specific paths, lines, behavior, and repository facts>
- **Evidence revisions:** ["<full evidence commit SHA>"]
- **Impact:** <concrete failure, rework, or engineering harm>
- **Required outcome:** <what must become true without prescribing one fix>
- **Earliest source of truth:** implementation/tests
- **Affected artifacts:** ["<artifact ID, path, or stable code-area label>"]
- **Decision needed:** <focused human choice and why; omit when unnecessary>
- **Current target relation:** Carried forward; not re-reviewed

## Accepted risks

### AR1 · <concise residual-risk condition>

- **Evidence:** <specific paths, behavior, and repository facts>
- **Evidence revisions:** ["<full evidence commit SHA>"]
- **Potential impact:** <concrete failure or engineering harm that remains possible>
- **Acceptance rationale:** <why remediation does not justify its cost or trade-offs>
- **Scope and assumptions:** <exact boundary within which acceptance applies>
- **Reopen when:** <observable changes that invalidate acceptance>
- **Acceptance authority:** <the explicit human decision or its durable source>
- **Originating finding:** <original F identifier, which must no longer be active>
- **Acceptance lifetime:** Change-scoped
- **Decision record:** <durable project artifact; required for Durable lifetime, otherwise optional>
- **Current target relation:** Carried forward; not re-reviewed

## Review coverage

<important paths, runtime boundaries, requirements, and activated risk areas examined>
