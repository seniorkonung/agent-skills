# Validator Interface

Read this only when consuming reports programmatically or maintaining the
validator. Report authors use the template and the validation step in `SKILL.md`.

The validator requires Node.js 18+ and built-in modules only. It reads one named
file and does not write files or use Git, OpenSpec, or the network.

```sh
node "<skill-root>/scripts/validate-review.mjs" --json "<report-path>"
```

`--json` prints `{file, valid, errors, data}` to stdout. Without it, the CLI prints
success or diagnostics with file, 1-based line, field path, code, and explanation.
Exit codes: `0` valid, `1` invalid report, `2` file/UTF-8 error, `64` invalid
arguments. `--help` prints usage. Argument errors print usage to stderr even with
`--json`. Use `./` for a filename beginning with `-`.

## Parsed Data

On success, `data` contains `kind`, `change`, `assessment`, `findings`,
`acceptedRisks`, and `reviewCoverage`, plus the implementation-specific sections
where applicable. Section and field keys use lower camel case (`Required change`
becomes `requiredChange`; `OpenSpec change` becomes `openSpecChange`). Hyphens also
collapse: `Applicable constraints and non-goals` becomes
`applicableConstraintsAndNonGoals`. Entry objects contain `id`, `title`, finding
`severity`, and their named fields. IDs and prose remain strings; the format
version is a number and JSON lists remain arrays.
Optional fields are absent; `findings` and `acceptedRisks` are always arrays.
`reviewCoverage` is a string. Blank lines and trailing whitespace are discarded;
prose continuation lines join with `\n` after removing their two-space indent.
No semantic Markdown rendering or extraction from narrative strings is performed.

On failure, `data` is `null`, with diagnostics shaped as
`{line, path, code, message}` in `errors`. Never consume partially parsed state.
Diagnostics cover structural errors first, then cross-field consistency once the
structure is valid; fix and rerun to expose subsequent issues. Consumers can also
import `validateReview(text)` from `scripts/validate-review.mjs`; it returns the
same `{valid, errors, data}` result without reading files or running the CLI.

Implementation reports also contain `reviewTarget` (object), `reviewedIncrement`
(entry array), `passCoverage` (array of `{pass, status, evidence}`), and optional
`unmappedRange` (object). Derive commit/path counts from their array lengths.
The validator checks internal consistency; it does not compare the report with Git.

## Maintenance

The executable contract is `scripts/review-format.mjs`; the template and JSON
fixtures illustrate it. The two review skills bundle identical engine copies so
either installs independently. Update both copies, templates, and regression tests
together. An incompatible contract change needs a new format version and an
explicit migration. Validation performs no automatic migration.
