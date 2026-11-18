# Prepare the Independent Reviewer's Brief

Read this when preparing the independent decision pass. The reviewer needs to
understand what the work must achieve without being taught to defend the chosen
solution. You need the complete planning context to make that distinction;
withholding context from yourself would only make the brief less accurate.

## Separate Outcomes from Choices

Classify relevant source material before writing the brief:

| Material | Treatment |
|---|---|
| Undesirable current behavior, desired result, affected actor or boundary | Include as intent |
| A limit imposed independently of this solution, with an identifiable reason | Include as a binding constraint |
| Explicitly excluded outcomes or scope | Include as non-goals when needed |
| Tasks, technologies, algorithms, module boundaries, expected files, design rationale, previous findings, preferred fixes | Withhold as solution or review context |

A constraint is binding because of its authority, not because a design document
calls it a requirement. An existing public protocol, an independently established
security policy, or a deployment restriction may bind the solution. A technology
selected by the implementer usually does not. Explain why a constraint applies;
if none is established, write `none known`.

For each proposed constraint, ask: **Would an alternative that achieves the same
outcome still have to satisfy this limit?** If the answer depends only on the
chosen design, keep it out of the brief. Do not turn a preferred mechanism into a
non-goal to make it unreviewable.

## Example

Suppose the design proposes a queue and polling worker to avoid reporting
completion before a report has been stored.

This brief would steer the review toward approving that mechanism:

> Check that the queue and worker correctly implement reliable report creation.

Instead, give the reviewer the outcome and established compatibility boundary:

```text
Problem: Automation can receive success although no retrievable report exists.
Desired outcome: Reported success means the report can be retrieved.
Affected boundary: Calling automation and the report service.
Binding constraints: Existing callers rely on the public exit-code contract;
its meanings must remain compatible.
Non-goals: Changing report contents.
Review target:
  Repository root: <absolute root>
  Base: <full commit ID>
  Head: <full commit ID>
  Paths: <complete list of assigned changed delivery and test paths>
```

The reviewer may conclude that the queue is appropriate, find a failure in it,
or identify a simpler solution. The brief does not choose that conclusion.

## Check Before Dispatch

- Cross-check the brief against proposal, requirements, design, and other
  applicable artifacts. Preserve relevant constraints spread across those files.
- Include only outcomes attributable to the reviewed increment. Untouched future
  work supplies context, not additional delivery obligations.
- Keep source citations and synthesis notes in your context. Send the brief and
  exact target, not planning documents, work-item IDs, previous findings, accepted
  risks, commit descriptions, or implementation discussion.
- For overlapping units, include a complete intent section per unit and one
  shared target containing the union of their assigned paths.
- If sources disagree in a way that changes valid solutions, identify the
  unresolved decision and mark dependent coverage incomplete. Do not resolve
  the conflict by copying the implemented behavior into the desired outcome.
