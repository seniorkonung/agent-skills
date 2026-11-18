---
description: Requires every requirement, scenario, test, task, document, decision record, handler, or abstraction an agent adds to carry a concrete justification, and treats unjustified additions as defects equal to omissions. Use when creating, planning, implementing, or reviewing any project artifact.
---

### Proven necessity

Every element you add must prove that it is needed: a requirement, scenario, test, task, document section, decision record, code path, failure handler, abstraction, or configuration option. An unjustified element is a defect of the same class as a missing one. It costs every later reader, reviewer, and change, and it hides the elements that matter.

#### Admit an element only with its justification

Before adding an element, state its justification in your reasoning or report, not in the artifact. If you cannot state it, do not add the element.

| Element | Justification |
|---|---|
| Requirement or scenario | The product decision it records, its reachable trigger, and the outcome a user or consumer observes |
| Failure handling | The real source of the failure in the current system, and why the mechanism that owns that failure does not already handle it |
| Test | The plausible, costly regression it catches that no other test catches |
| Task, document, or decision record | The required outcome that cannot be reached or preserved without it |
| Abstraction, option, or extension point | The current caller or requirement that needs it |

- A case is reachable when a user action, adversarial input, an environment event, or a failure that the system's actual dependencies and architecture can produce leads to it. A state the architecture rules out is not a case to specify, handle, or test.
- Specify, implement, and test a shared mechanism — failure presentation, retries, localization, accessibility, persistence guarantees — once, where it is owned. Elements that rely on it do not restate it.
- When the justification depends on product value, scope, or priority, ask the human. Do not add the element as a precaution.

#### Review in both directions

- Report excess with the same rigor and severity scale as gaps: unreachable cases, duplicates, restatements of a shared mechanism, implementation mechanics presented as requirements, and speculative generality.
- A gap finding must show how the missing case is reached in the current system. Without that evidence, raise it as a question, not as a finding.

#### Precedence

This instruction decides whether an element is needed; other instructions and skills decide how to build what is needed. When their guidance pushes toward completeness — cover every edge case, handle every failure, test simple code — apply it only to elements that pass this instruction.
