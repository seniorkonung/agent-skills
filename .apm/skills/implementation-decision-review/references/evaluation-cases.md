# Decision Review Evaluation Cases

Use these cases when changing the skill. Compare the unchanged and candidate
skill on the same bounded fixtures. Judge the findings and evidence gathered,
including file reads; repeating the rules in a final answer is not enough.
Use fresh runs when available. A walkthrough by the author is useful but does
not establish how reliably another model will execute the skill.

## 1. A Supported Finding With Incomplete Coverage

**Request:** Review report creation and cleanup under the supplied brief and
committed target.

**Fixture:** `src/create.js` returns success before awaiting storage; a rejected
write therefore leaves no retrievable report. The brief says that reported
success means the report is retrievable. Reviewing the separate cleanup path
requires `src/retention.js`, which changed in the same range but is outside the
assigned paths.

**Expected:** Report the supported creation finding with `Changes needed` and
`Coverage: Incomplete`. Name the missing cleanup dependency and request a corrected
target from the caller without reading it. Do not lose the creation finding or
claim cleanup was cleared. Do not present one preferred fix as the required
property.

**Near miss:** If only cleanup is in the target and no supported finding exists,
return `Incomplete` with no speculative finding.

## 2. A Plausible Concern Defeated by Evidence

**Request:** Assess whether this committed cache decision is a defensible way to
serve the stated outcome; binding constraints are `none known`.

**Fixture:** The changed cache module appears unbounded when read alone. An
unchanged caller restricts keys to a fixed internal enumeration; this is the only
entry point. A separate unchanged legacy module has a real leak unrelated to the
changed mechanism. The reviewer prefers a different cache library.

**Expected:** Check that the caller is unchanged before reading its committed
content. Omit the unsupported growth finding, unrelated legacy leak, and library
preference. With complete coverage and no other issue, return
`No substantive findings`.

**Variant:** The diff adds an entry point accepting arbitrary user keys. Trace
that path and report the now-supported resource growth problem.

## 3. Worktree Contents Differ From the Reviewed Commits

**Request:** Review the supplied immutable base, head, and paths. There are local
edits; review only the committed increment.

**Fixture:** The committed target has a success-before-storage failure. An
uncommitted edit fixes it. An unchanged committed caller also has an uncommitted
edit that changes its behavior. One assigned filename contains `*`, and another
changed filename matches that pattern but belongs to another unit.

**Expected:** Use literal, separately quoted path arguments. Read target and
context content from the supplied commits; find the committed failure and do not
read the other unit's file. A successful unchanged-path check is not evidence
that the worktree copy is unchanged. A failed Git check is not permission to read.

## 4. A Design Choice Disguised as a Constraint

**Request:** Review delivery reliability. Binding constraints: use the new queue
because that is the implementation we chose. All other brief fields are present.

**Expected:** Ask the caller to supply neutral intent or the independent authority
for that constraint; return `Incomplete` before assessing the code under a
manufactured premise. Do not inspect design documents to reconstruct an answer.

**Variant:** The brief instead states an established external protocol contract
and explains its existing consumers. Respect that constraint while reviewing the
mechanism. It can rule out an incompatible alternative without disproving a
failure of the current implementation.

## 5. Wrong Review Context or Wrong Job

- The current context implemented the change and is asked to forget its history:
  disclose failed isolation and return `Incomplete`.
- The user asks to reconcile OpenSpec tasks and persist F2: route to the
  coordinator; this skill does not own review state or artifact changes.
- A fresh reviewer receives a valid neutral brief and exact target: perform the
  assessment without demanding planning documents, an approval round, or a merge
  verdict.
