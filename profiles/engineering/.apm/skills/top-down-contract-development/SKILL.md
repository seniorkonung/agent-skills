---
name: top-down-contract-development
description: >-
  Organize software around independently understandable modules, explicit
  dependencies, and contracts shaped by their consumers. Use when deciding where
  a module boundary belongs or whether to extract one, shaping a contract beyond
  its type signature, separating use from assembly, sequencing work around agreed
  contracts rather than finished implementations, diagnosing mixed abstraction
  levels or leaked dependency internals during review, or when another skill
  needs this module and contract model. Not for routine edits inside an
  established boundary. Applies across languages and frameworks.
---

# Top-Down Contract Development

## Purpose

Make it possible for a person to choose a module and work on its implementation
while understanding only its responsibility and the contracts of its immediate
dependencies. Apply this model throughout planning, design, implementation, and
review, including when an agent performs all the work.

The central test is:

> Can a reader understand and check this module's behavior from its implementation
> and the contracts it uses, without opening those dependencies' implementations?

Treat this as a design discipline that shapes the current task. Preserve the
requested artifact and scope: a planning request produces a plan, a review
produces findings, and a narrow fix does not initiate an architectural rewrite.
Apply the discipline within existing project constraints and conventions.

## The Recursive Module Model

Describe each module through three things:

- **Provided behavior:** what its callers can rely on.
- **Required capabilities:** what it needs from its immediate dependencies.
- **Implementation:** the decisions and mechanics it owns.

A module can be a function, object, UI element, or package. These are conceptual
roles, not prescribed language constructs or directory types. A contract includes
the facts needed for correct use, beyond a type signature.

Start from the behavior needed by a consumer. Express its implementation in terms
of meaningful operations, reuse suitable existing capabilities, and define the
missing contracts from the consumer's needs. Apply the same reasoning inside
each dependency that needs implementation. Stop decomposing when the remaining
responsibility is directly understandable and implementable with ordinary code
or an appropriate existing library.

An atomic module owns one coherent responsibility that can be explained and
checked separately. Size alone does not establish atomicity. A simple public
interface may hide substantial behavior composed from smaller internal modules.

## Keep Abstraction Levels Consistent

Keep the decisions of a scenario together. Put the mechanics of its operations
inside the implementations responsible for those operations. A step that decides
whether a tool is available should not also construct shell invocations or parse
platform-specific process output.

For each operation, identify the knowledge it requires. If a reader must switch
from the scenario's concepts to the details of a separate mechanism, give that
mechanism a clear home and contract. Moving code behind a vague method name does
not help if callers still need to know its internals to use it correctly.

Conditions, iteration, ordinary data construction, and simple local calculations
can express the current responsibility directly. Use local helpers for details
that belong to that responsibility. Introduce an explicit dependency when a
capability should be independently implementable or checkable, or when it hides
an external effect or a separately evolving mechanism. Independent human work
on a consumer is a concrete reason for this separation; a second production
implementation or several existing callers is not a prerequisite.

Every extracted module should reduce what its consumer must understand or
provide a useful boundary for independent work. To test an existing or proposed
boundary, mentally remove it and inline the implementation into its consumer. If
the consumer becomes simpler, the boundary was a pass-through. If the consumer
then mixes abstraction levels, or the same knowledge reappears in several
consumers, the boundary earns its place. Avoid chains of renamed calls,
interfaces for every helper, and arbitrary limits on function length. There is
no universal numbering of abstraction levels or required number of layers.

## Make Contracts Sufficient for Local Reasoning

Expose only the operations needed by the consumer. Use the language's ordinary
means: a function parameter may be enough for one operation; a related set may
use an interface, protocol, record of functions, or another idiomatic mechanism.

Specify inputs, meaningful outcomes, observable effects, and failure behavior.
Include ordering, atomicity, cancellation, concurrency, or resource ownership
when they affect correct use. Keep those guarantees with the contract so callers
and implementers do not have to reconstruct them from code or conversation.

Keep related operations together when they share an invariant. For example,
splitting a required atomic state change into independently successful writes
can invalidate the scenario even when every small function is easy to read.

Keep transport and library details inside the module responsible for that
mechanism. A domain operation should not require its caller to understand HTTP
response objects or database handles. A module whose responsibility is HTTP may
use HTTP concepts directly; a UI contract may use its framework's UI types.

Treat contracts as commitments to consumers. If implementation constraints
invalidate a promised guarantee, surface the concrete conflict and resolve the
necessary revision with the contract's owner. Do not silently weaken a supplied
contract or disguise a product decision as an implementation detail.

## Separate Use from Assembly

Pass required capabilities explicitly at the module boundary. Keep selection and
construction of concrete implementations in the application's or subsystem's
assembly code. Application logic should not obtain arbitrary dependencies from
a global service locator or receive the entire application object.

Use ordinary functions, constructors, and existing composition facilities. A
small program can have one straightforward assembly function. Introduce a
registration DSL, dependency injection framework, or module registry only when
an actual project requirement justifies it. Direct use of local helpers, standard
libraries, and mechanism-specific SDKs does not require universal injection.

Keep state and resource ownership explicit where relevant: who creates a
resource, shares it, and disposes of it. Assembly supplies dependencies and
manages their lifetimes; scenario decisions remain in their owning modules.

Organize files around responsibilities using the project's conventions. A small
consumer-specific contract can live beside the consumer. Move it to an
independent file when needed to prevent cycles or imports of unrelated runtime
code. Consumer ownership describes who defines the requirements; it does not
require lower-level code to import a UI or application entry point.

Reuse a shared contract when consumers require the same semantics. Do not merge
contracts merely because their signatures match. Avoid mandatory global layer
directories, one file per interface, and directory trees that copy a dependency
graph. Shared dependencies need not belong beneath a single consumer.

## Apply the Model at the Current Stage

**Planning and design:** begin with the requested behavior and the relevant
existing code. Identify the modules that own the decisions and the capabilities
they need. At task granularity, make the provided behavior, required contracts,
and meaningful verification clear. At phase granularity, use these boundaries
to shape outcomes without expanding every interface or inventing file lists.
Use the existing planning format rather than creating a separate module catalog.

Distinguish dependency on an agreed contract from dependency on a working
implementation. Once a contract is agreed, its consumer and implementation can
often be developed independently. Schedule real assembly and integration
verification within the requested deliverable. Validate uncertain capabilities
early when they could invalidate the contracts; top-down reasoning does not
require a rigid top-to-bottom implementation order.

Derive infrastructure work from actual capability requirements. Reuse existing
facilities and libraries. Each new server, repository abstraction, logging
wrapper, or factory should have a concrete consumer or operational requirement.
Keep necessary reliability and failure handling inside the relevant work rather
than postponing them or building a speculative infrastructure foundation.

**Implementation:** write the chosen module against its required contracts and
check its observable behavior. Develop its dependencies with the same model,
within the authorized scope. When the request is for one module, report remaining
implementations and connections; when it is for a working capability, complete
the required implementations, assembly, and integration. Never use fake success
responses to conceal missing production behavior.

Before a real dependency exists, choose the test replacement from what that
dependency actually is:

| Dependency | How to check the consumer |
|---|---|
| Pure computation or in-memory state | Call it directly; no replacement needed |
| Has a faithful local stand-in, such as an in-memory database or filesystem | Run the stand-in in the checks |
| A service you own, behind a network or process boundary | Check against an in-process implementation of the contract |
| A third party you do not control | Supply a controlled implementation of your own contract, not of their client library |

A replacement establishes that the consumer honors the contract. It never
establishes that the real dependency does, so keep a check that exercises the
real connection within the requested scope.

**Review:** apply the central local-reasoning test to the changed modules and
relevant contracts. Identify the specific knowledge leaking across a boundary,
missing promise, or unnecessary indirection. Check the relevant implementations
and real connections to verify that promises are actually met; a readable
consumer alone does not establish system correctness. For existing code, propose
the smallest relevant correction and preserve unrelated architecture.

## Example: A Tool-Availability Step

This language-neutral pseudocode illustrates the relationships, not a required
syntax, registration helper, or framework:

```text
contract CommandChecker:
    checkCommand(name) -> async boolean
    true: a named executable is discoverable in the configured environment
    false: that executable is not discoverable
    failure: the check itself could not be completed

provide Step checkMise(requires commands: CommandChecker):
    startMessage = "Checking mise availability"

    run():
        if await commands.checkCommand("mise"):
            return success("Mise is available")
        return error("Mise is unavailable")
```

For this example, `Step.run` allows an unexpected check failure to propagate to
the step runner, which reports execution failures. The unavailable result and a
failed inspection are distinct. A project that needs a successful tool invocation
instead of executable discovery must state that different promise in its
contract.

The person writing `checkMise` chooses the command and the user-facing results.
They need the `Step` and `CommandChecker` contracts, not knowledge of process
launching or operating-system differences.

The checker implementation owns executable discovery. It can use an existing
library directly, or require another capability if that creates a useful
independent responsibility. Assembly supplies the real checker to the step.
Neither a custom `implementation<Step>` helper nor an HTTP server follows from
this requirement alone.

## Check the Result

- The reader can explain each changed module using its responsibility and the
  contracts it uses, without investigating dependency internals.
- Scenario decisions and mechanism details have clear owners; extracted modules
  reduce the knowledge needed locally without introducing empty indirection.
- Contracts cover the observable guarantees needed by consumers, and actual
  implementations satisfy them. Distinct failure meanings remain distinguishable.
- Consumer checks exercise outcomes and relevant failures. Dependency checks
  verify contract behavior; integration checks exercise the real connections.
  Test replacements alone do not establish that those connections work.
- Plans distinguish contract prerequisites from implementation prerequisites and
  include the necessary assembly and verification within the requested scope.
- Report the checks actually performed and any unfinished implementations or
  connections. Do not present an isolated module as a working end-to-end feature.
