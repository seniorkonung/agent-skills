import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync, mkdtempSync, writeFileSync, rmSync, cpSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { validateReview } from '../scripts/validate-review.mjs';

const fixture = readFileSync(new URL('fixtures/valid-review.md', import.meta.url), 'utf8');
const expectedData = JSON.parse(readFileSync(new URL('fixtures/valid-review.json', import.meta.url), 'utf8'));
const implementation = fixture.startsWith('# OpenSpec Implementation');
const incompleteResult = implementation ? 'Incomplete' : 'Review incomplete';
const cleanFindings = implementation
  ? 'No unresolved findings remain in the implementation review.'
  : 'No unresolved findings remain in the reviewed change artifacts and relevant repository context.';
const clean = fixture.replace('**Result:** Changes needed', '**Result:** No unresolved findings')
  .replace(/## Findings\n[\s\S]*?(?=## Accepted risks)/, `## Findings\n\n${cleanFindings}\n\n`);

function invalid(source, code) {
  const result = validateReview(source);
  assert.equal(result.valid, false, source);
  assert.equal(result.data, null, 'Never expose partially parsed invalid state');
  assert.ok(result.errors.some(error => error.code === code), JSON.stringify(result.errors));
  for (const error of result.errors) {
    assert.ok(Number.isInteger(error.line) && error.line > 0);
    assert.equal(typeof error.path, 'string');
    assert.ok(error.message.length > 0);
  }
}

test('parses findings, accepted risks, typed fields, and all narrative content', () => {
  const result = validateReview(fixture);
  assert.deepEqual(result.errors, []);
  assert.equal(result.valid, true);
  assert.deepEqual(result.data, expectedData, 'Every recorded field must survive parsing under its documented key');
  assert.equal(result.data.kind, implementation ? 'implementation' : 'change');
  assert.equal(result.data.change, 'persist-export');
  assert.equal(result.data.assessment.formatVersion, 1);
  assert.equal(result.data.findings[0].id, 'F2');
  assert.equal(result.data.findings[0].severity, 'High');
  assert.match(result.data.findings[0].evidence, /acknowledges/);
  assert.equal(result.data.acceptedRisks[0].originatingFinding, 'F1');
  assert.equal(result.data.acceptedRisks[0].acceptanceLifetime, 'Change-scoped');
  assert.match(result.data.reviewCoverage, /legacy rollback/);
  if (implementation) {
    assert.deepEqual(result.data.reviewTarget.reviewablePaths, ['src/export.js', 'specs/export.md']);
    assert.deepEqual(result.data.reviewedIncrement[0].workItems, ['1.1']);
    assert.equal(result.data.passCoverage.length, 3);
    assert.equal(result.data.reviewedIncrement[0].applicableConstraintsAndNonGoals,
      'Preserve the existing success response contract.');
  }
});

test('accepts a clean review with and without accepted risks', () => {
  assert.equal(validateReview(clean).valid, true);
  const noRisks = clean.replace(/## Accepted risks\n[\s\S]*?(?=## Review coverage)/, '')
    .replace(' AR1 remains accepted.', '');
  assert.deepEqual(validateReview(noRisks).data.acceptedRisks, []);
  assert.deepEqual(validateReview(noRisks).data.findings, []);
});

test('normalizes CRLF, BOM, and indented prose continuations', () => {
  const source = fixture.replace('A caller can receive success for a missing export.',
    'A caller can receive success.\n  Storage may still fail.');
  const result = validateReview('\uFEFF' + source.replaceAll('\n', '\r\n'));
  assert.equal(result.valid, true, JSON.stringify(result.errors));
  assert.equal(result.data.findings[0].impact, 'A caller can receive success.\nStorage may still fail.');
});

test('requires explicit incomplete coverage and preserves finding precedence', () => {
  const partial = fixture.replace('**Coverage status:** Complete',
    '**Coverage status:** Incomplete\n**Coverage limitations:** Essential contract was unreadable.');
  assert.equal(validateReview(partial).valid, true);
  const empty = partial.replace('**Result:** Changes needed', `**Result:** ${incompleteResult}`)
    .replace(/## Findings\n[\s\S]*?(?=## Accepted risks)/,
      '## Findings\n\nNo findings confirmed; review incomplete.\n\n');
  assert.equal(validateReview(empty).valid, true);
  invalid(empty.replace('**Coverage limitations:** Essential contract was unreadable.\n', ''), 'required');
  invalid(empty.replace(`**Result:** ${incompleteResult}`, '**Result:** No unresolved findings'), 'result');
});

test('rejects structural ambiguity instead of silently discarding it', () => {
  const cases = [
    [fixture.replace('## Assessment', '## Summary'), 'section'],
    [fixture + '\n## Assessment\n\n**Result:** Changes needed\n', 'duplicate'],
    [fixture.replace('## Assessment\n', ''), 'section'],
    [fixture.replace('**Result:** Changes needed', '**Result:** Changes needed\n**Result:** Changes needed'), 'duplicate'],
    [fixture.replace('**Result:** Changes needed', '**Verdict:** Changes needed'), 'field'],
    [fixture.replace('- **Impact:** A caller can receive success for a missing export.', '- **Impact:**'), 'value'],
    [fixture.replace('- **Impact:**', '- **Impact**:'), 'syntax'],
    [fixture.replace('### F2 · High — Success can precede durable storage', '### F2: High - Success can precede durable storage'), 'entry'],
    [fixture.replace('### F2 · High', '### F0 · High'), 'entry'],
    [fixture.replace('### F2 · High', '### F2 · urgent'), 'entry'],
    [fixture.replace('**Format version:** 1', '**Format version:** 2'), 'value'],
    [fixture.replace('A caller can receive success for a missing export.', '<concrete impact>'), 'placeholder'],
    [fixture.replace('A caller can receive success for a missing export.', 'TBD'), 'placeholder'],
    [fixture.replace('- **Impact:**', 'unowned prose\n- **Impact:**'), 'syntax'],
    [fixture.replace('- **Impact:**', '<!-- hidden state -->\n- **Impact:**'), 'syntax'],
    [fixture.replace('- **Impact:**', '  - **Hidden field:** silently lost\n- **Impact:**'), 'syntax'],
    [fixture.replace('## Review coverage', '#### Review coverage'), 'entry'],
    [fixture.replace('## Findings', '## Accepted risks\n\n## Findings'), 'duplicate'],
    [fixture.replace(/## Review coverage[\s\S]*$/, '## Review coverage\n'), 'required'],
  ];
  for (const [source, code] of cases) invalid(source, code);
});

test('rejects missing required fields and duplicate IDs', () => {
  invalid(fixture.replace(/- \*\*Evidence:\*\*[^\n]*\n/, ''), 'required');
  const finding = fixture.match(/### F2[\s\S]*?(?=## Accepted risks)/)[0];
  invalid(fixture.replace('## Accepted risks', finding + '## Accepted risks'), 'duplicate');
  const risk = fixture.match(/### AR1[\s\S]*?(?=## Review coverage)/)[0];
  invalid(fixture.replace('## Review coverage', risk + '## Review coverage'), 'duplicate');
});

test('enforces risk origins, durable authority records, and assessment visibility', () => {
  invalid(fixture.replace('**Originating finding:** F1', '**Originating finding:** F2'), 'reference');
  invalid(fixture.replace('**Originating finding:** F1', '**Originating finding:** F01'), 'value');
  invalid(fixture.replace('- **Acceptance authority:** The change owner explicitly accepted manual rollback in the review discussion.\n', ''), 'required');
  invalid(fixture.replace('**Acceptance lifetime:** Change-scoped', '**Acceptance lifetime:** Durable'), 'required');
  invalid(fixture.replace('AR1 remains accepted.', 'Known risk remains.'), 'reference');
  invalid(fixture.replace('AR1 remains accepted.', 'AR1 and AR2 remain accepted.'), 'reference');
  const durable = fixture.replace('**Acceptance lifetime:** Change-scoped',
    '**Acceptance lifetime:** Durable\n- **Decision record:** docs/decisions/legacy-rollback.md');
  assert.equal(validateReview(durable).valid, true);
});

test('rejects result and coverage contradictions', () => {
  invalid(fixture.replace('**Result:** Changes needed', '**Result:** No unresolved findings'), 'result');
  invalid(clean.replace('**Result:** No unresolved findings', '**Result:** Changes needed'), 'result');
  invalid(clean.replace('**Result:** No unresolved findings', `**Result:** ${incompleteResult}`), 'result');
  invalid(clean.replace(cleanFindings, 'None.'), 'entry');
});

test('rejects the unfilled template and accepts its complete field vocabulary', () => {
  const template = readFileSync(new URL('../assets/review-template.md', import.meta.url), 'utf8');
  invalid(template, 'placeholder');
  const templateFields = [...template.matchAll(/^(?:- )?\*\*([^*]+):\*\*/gm)].map(match => match[1]);
  const fixtureFields = [...fixture.matchAll(/^(?:- )?\*\*([^*]+):\*\*/gm)].map(match => match[1]);
  let cursor = 0;
  for (const label of fixtureFields) {
    cursor = templateFields.indexOf(label, cursor);
    assert.ok(cursor >= 0, `Fixture field ${label} must occur in template order`);
    cursor++;
  }
});

test('rejects out-of-order fields, duplicate risk origins, and invalid control characters', () => {
  invalid(fixture.replace('**Format version:** 1\n**Result:** Changes needed', '**Result:** Changes needed\n**Format version:** 1'), 'order');
  invalid(fixture.replace('for a missing export.', 'for a missing\u0000export.'), 'syntax');
  invalid(fixture.replace('for a missing export.', 'for a missing\rexport.'), 'syntax');
  const risk = fixture.match(/### AR1[\s\S]*?(?=## Review coverage)/)[0].replace('### AR1', '### AR2');
  invalid(fixture.replace('## Review coverage', risk + '## Review coverage'), 'reference');
});

test('rejects HTML comments hidden inside otherwise valid prose or titles', () => {
  invalid(fixture.replace('for a missing export.', '<!-- hidden --> for a missing export.'), 'syntax');
  invalid(fixture.replace('Success can precede durable storage', 'Success <!-- hidden --> can precede durable storage'), 'syntax');
  invalid(fixture.replace('Reviewed export persistence', 'Reviewed export <!-- hidden --> persistence'), 'syntax');
});

if (implementation) {
  test('allows incomplete passes, unmapped inventory, overlapping units, and SHA-256', () => {
    const partial = fixture.replace('**Coverage status:** Complete',
      '**Coverage status:** Incomplete\n**Coverage limitations:** Independent review is unavailable.')
      .replace('| Independent decision review | Complete |', '| Independent decision review | Incomplete |');
    assert.equal(validateReview(partial).valid, true);
    const unmapped = partial.replace(/## Reviewed increment\n[\s\S]*?(?=## Pass coverage)/,
      '## Reviewed increment\n\nNo review units could be established.\n\n## Unmapped range\n\n- **Unmatched target paths:** ["src/export.js"]\n- **Reason:** The task mapping is uncertain.\n\n');
    assert.equal(validateReview(unmapped).valid, true);
    const unit = fixture.match(/### U1[\s\S]*?(?=## Pass coverage)/)[0].replace('### U1', '### U2');
    assert.equal(validateReview(fixture.replace('## Pass coverage', unit + '## Pass coverage')).valid, true);
    const sha256 = fixture.replaceAll('a'.repeat(40), 'a'.repeat(64)).replaceAll('b'.repeat(40), 'b'.repeat(64));
    assert.equal(validateReview(sha256).valid, true);
    invalid(fixture.replace('**Reviewed head:** ' + 'b'.repeat(40), '**Reviewed head:** ' + 'b'.repeat(64)), 'target');
    invalid(fixture.replace('**Reviewable paths:** ["src/export.js", "specs/export.md"]', '**Reviewable paths:** ["src/export.js", "../specs/export.md"]'), 'value');
    // Discovery owns report exclusion; unrelated delivery docs may have this basename.
    assert.equal(validateReview(fixture.replaceAll('specs/export.md', 'docs/implementation-review.md')).valid, true);
  });

  test('checks exact target identities, path partition, pass statuses, and carried evidence', () => {
    const cases = [
      [fixture.replace('**Base commit:** ' + 'a'.repeat(40), '**Base commit:** aaaaaaa'), 'value'],
      [fixture.replace('**Base commit:** ' + 'a'.repeat(40), '**Base commit:** ' + 'b'.repeat(40)), 'target'],
      [fixture.replace('**OpenSpec change:** persist-export', '**OpenSpec change:** another'), 'target'],
      [fixture.replace('**Target commits:** ["' + 'b'.repeat(40) + '"]', '**Target commits:** 1'), 'value'],
      [fixture.replace('**Implementation target:** ["src/export.js"]', '**Implementation target:** ["src/missing.js"]'), 'target'],
      [fixture.replace('**Implementation target:** ["src/export.js"]', '**Implementation target:** ["src/export.js", "src/export.js"]'), 'value'],
      [fixture.replace('- **Planning evidence paths:** ["specs/export.md"]\n', ''), 'target'],
      [fixture.replace('| Code quality | Complete |', '| Code quality | Incomplete |'), 'coverage'],
      [fixture.replace('| Code quality | Complete |', '| Code quality | Pending |'), 'value'],
      [fixture.replace('| Code quality | Complete |', '| Security | Complete |'), 'table'],
      [fixture.replace('Failure handling and callers inspected at the recorded head.', 'Evidence | unescaped pipe'), 'table'],
      [fixture.replace('**Evidence revisions:** ["' + 'b'.repeat(40) + '"]', '**Evidence revisions:** ["' + 'c'.repeat(40) + '"]'), 'target'],
    ];
    for (const [source, code] of cases) invalid(source, code);
    const carried = fixture.replace('**Evidence revisions:** ["' + 'b'.repeat(40) + '"]',
      '**Evidence revisions:** ["' + 'c'.repeat(40) + '"]')
      .replace('## Accepted risks', '- **Current target relation:** Carried forward; not re-reviewed\n\n## Accepted risks');
    assert.equal(validateReview(carried).valid, true);
  });

  test('round-trips punctuation and escaped newlines in JSON paths', () => {
    const path = 'src/a, b|c"d\\e\nf\u2028\u2029.js';
    const source = fixture.replaceAll('"src/export.js"', JSON.stringify(path));
    const result = validateReview(source);
    assert.equal(result.valid, true, JSON.stringify(result.errors));
    assert.equal(result.data.reviewTarget.reviewablePaths[0], path);
    assert.equal(result.data.reviewedIncrement[0].implementationTarget[0], path);
    const commentPath = 'src/<!-- literal filename -->.js';
    const escaped = JSON.stringify(commentPath).replaceAll('<', '\\u003c').replaceAll('>', '\\u003e');
    const withLiteralCommentPath = validateReview(fixture.replaceAll('"src/export.js"', escaped));
    assert.equal(withLiteralCommentPath.valid, true);
    assert.equal(withLiteralCommentPath.data.reviewTarget.reviewablePaths[0], commentPath);
  });
}

test('CLI reports errors, JSON, usage and I/O failures; works as a standalone installed skill', t => {
  const temp = mkdtempSync(join(tmpdir(), 'review-validator-'));
  t.after(() => rmSync(temp, { recursive: true, force: true }));
  cpSync(new URL('../scripts/', import.meta.url), join(temp, 'scripts'), { recursive: true });
  const report = join(temp, 'report with spaces.md');
  const run = (...args) => spawnSync(process.execPath, [join(temp, 'scripts/validate-review.mjs'), ...args],
    { cwd: temp, encoding: 'utf8' });
  writeFileSync(report, fixture);
  const success = run('--json', report);
  assert.equal(success.status, 0, success.stderr);
  assert.equal(JSON.parse(success.stdout).data.findings[0].id, 'F2');
  assert.equal(success.stderr, '');
  assert.match(run(report).stdout, /valid/i);
  assert.equal(readFileSync(report, 'utf8'), fixture);
  symlinkSync(join(temp, 'scripts'), join(temp, 'linked-scripts'), 'junction');
  const linked = spawnSync(process.execPath, [join(temp, 'linked-scripts/validate-review.mjs'), '--json', report], { encoding: 'utf8' });
  assert.equal(linked.status, 0, linked.stderr);
  assert.equal(JSON.parse(linked.stdout).valid, true);
  const preserved = spawnSync(process.execPath, ['--preserve-symlinks-main', join(temp, 'linked-scripts/validate-review.mjs'), '--json', report], { encoding: 'utf8' });
  assert.equal(preserved.status, 0, preserved.stderr);
  assert.equal(JSON.parse(preserved.stdout).valid, true);
  writeFileSync(report, fixture.replace('**Result:** Changes needed', '**Result:** bogus'));
  const failure = run('--json', report);
  assert.equal(failure.status, 1);
  assert.equal(JSON.parse(failure.stdout).data, null);
  assert.match(run(report).stderr, /report with spaces\.md:\d+.*Result/);
  assert.equal(run().status, 64);
  assert.equal(run('--unknown', report).status, 64);
  assert.equal(run(report, report).status, 64);
  assert.equal(run('--help').status, 0);
  const missing = run('--json', join(temp, 'absent.md'));
  assert.equal(missing.status, 2);
  assert.equal(JSON.parse(missing.stdout).errors[0].code, 'io');
  assert.equal(run('--json', temp).status, 2);
  writeFileSync(report, Buffer.from([0xc3, 0x28]));
  assert.equal(run('--json', report).status, 2);
});
