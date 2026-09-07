// Bundled identically in both review skills so either directory installs alone.
// Keep the two copies aligned when changing the versioned report contract.
import { readFileSync, realpathSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const COMPLETE = ['Complete', 'Incomplete'];
const RELATION = ['Carried forward; not re-reviewed'];
const SHA = /^(?:[a-f0-9]{40}|[a-f0-9]{64})$/;
const FINDING_ID = /^F[1-9][0-9]*$/;
const PLACEHOLDER = /^(?:<[^<>\n]+>|TODO|TBD|FIXME)$/;
const keyFor = label => label[0].toLowerCase() + label.slice(1).replace(/[ -]([a-z])/g, (_, c) => c.toUpperCase());
const field = (label, type = 'text', optional = false) => ({ label, key: keyFor(label), type, optional });

function schemaFor(kind) {
  const implementation = kind === 'implementation';
  const assessment = [
    field('Format version', 'version'),
    field('Result', ['Changes needed', implementation ? 'Incomplete' : 'Review incomplete', 'No unresolved findings']),
    field('Coverage status', COMPLETE),
    field('Coverage limitations', 'text', true),
    field('Summary'),
    ...implementation ? [] : [field('Validation')],
  ];
  const evidence = [field('Evidence'), ...implementation ? [field('Evidence revisions', 'shas')] : []];
  const relation = implementation ? [field('Current target relation', RELATION, true)] : [];
  const findings = [
    ...evidence, field('Impact'),
    ...implementation ? [
      field('Required outcome'),
      field('Earliest source of truth', ['implementation/tests', 'task/verification', 'design/ADR', 'requirement/proposal', 'separate change']),
      field('Affected artifacts', 'strings'),
    ] : [field('Required change')],
    field('Decision needed', 'text', true), ...relation,
  ];
  const risks = [
    ...evidence, field('Potential impact'), field('Acceptance rationale'),
    field('Scope and assumptions'), field('Reopen when'), field('Acceptance authority'),
    field('Originating finding', 'findingId'),
    field('Acceptance lifetime', ['Change-scoped', 'Durable']),
    field('Decision record', 'text', true), ...relation,
  ];
  return [
    { name: 'Assessment', type: 'fields', fields: assessment, prefix: '' },
    ...implementation ? [
      { name: 'Review target', type: 'fields', fields: [
        field('Baseline ref'), field('Base commit', 'sha'), field('Reviewed head', 'sha'),
        field('Target commits', 'shas'), field('Reviewable paths', 'paths'),
        field('OpenSpec change'), field('OpenSpec schema'),
        field('Target scope', ['Complete pre-push range', 'User-requested bounded range']),
        field('Baseline freshness', ['Local ref state; no fetch performed']),
        field('Planning evidence paths', 'paths', true),
        field('Excluded worktree state', 'paths', true),
      ] },
      { name: 'Reviewed increment', type: 'entries', id: 'U', empty: 'No review units could be established.', fields: [
        field('Work items', 'labels'), field('Requirements and scenarios', 'labels'),
        field('Affected boundary'), field('Implementation target', 'paths'),
        field('Applicable constraints and non-goals'), field('Excluded change scope', 'text', true),
      ] },
      { name: 'Unmapped range', type: 'fields', optional: true, fields: [
        field('Unmatched target paths', 'paths'), field('Reason'),
      ] },
      { name: 'Pass coverage', type: 'passes' },
    ] : [],
    { name: 'Findings', type: 'entries', id: 'F', fields: findings },
    { name: 'Accepted risks', type: 'entries', id: 'AR', fields: risks, optional: true },
    { name: 'Review coverage', type: 'prose' },
  ].map(section => ({ ...section, key: keyFor(section.name) }));
}

/** Parse the restricted Markdown grammar. Invalid input never exposes partial data. */
export function createValidator(kind) {
  if (!['change', 'implementation'].includes(kind)) throw new Error(`Unknown review kind: ${kind}`);
  const schema = schemaFor(kind);
  return function validateReview(source) {
    const errors = [];
    const locations = new Map();
    const error = (line, path, code, message) => errors.push({ line, path, code, message });
    const locate = path => {
      let parent = path;
      while (parent && !locations.has(parent)) {
        const dot = parent.lastIndexOf('.');
        parent = dot < 0 ? '' : parent.slice(0, dot);
      }
      return locations.get(parent) ?? 1;
    };
    const problem = (path, code, message) => error(locate(path), path, code, message);
    if (typeof source !== 'string') {
      error(1, 'document', 'syntax', 'Expected UTF-8 Markdown text.');
      return { valid: false, errors, data: null };
    }
    const lines = source.replace(/^\uFEFF/, '').replaceAll('\r\n', '\n').split('\n')
      .map((raw, index) => ({ raw, line: index + 1 }));
    for (const item of lines) {
      const { raw, line } = item;
      if (/[\x00-\x08\x0b-\x1f\x7f]/.test(raw)) error(line, 'document', 'syntax', 'Control characters are not allowed; encode them inside JSON strings.');
      if (/<!--|-->/.test(raw)) error(line, 'document', 'syntax', 'HTML comment delimiters are not allowed; escape literal angle brackets as entities in prose or Unicode escapes in JSON.');
      item.raw = raw.trimEnd();
    }
    const nonblank = lines.filter(item => item.raw !== '');
    const titlePrefix = `# OpenSpec ${kind === 'change' ? 'Change' : 'Implementation'} Review: `;
    const title = nonblank.shift();
    const change = title?.raw.startsWith(titlePrefix) ? title.raw.slice(titlePrefix.length).trim() : '';
    if (!change || PLACEHOLDER.test(change)) error(title?.line ?? 1, 'change', 'title', `Expected "${titlePrefix}<change-name>" with a real change name.`);
    const data = { kind, change };
    const sections = new Map();
    let current;
    let lastSection = -1;
    for (const item of nonblank) {
      const heading = /^## (.+)$/.exec(item.raw);
      if (heading) {
        const name = heading[1];
        const index = schema.findIndex(section => section.name === name);
        current = undefined;
        if (index < 0) {
          error(item.line, name, 'section', `Unknown section "${name}"; use the template's exact headings.`);
          continue;
        }
        if (sections.has(name)) {
          error(item.line, name, 'duplicate', `Section "${name}" occurs more than once.`);
          continue;
        }
        if (index < lastSection) error(item.line, name, 'order', `Section "${name}" is out of template order.`);
        lastSection = index;
        current = [];
        sections.set(name, current);
        locations.set(schema[index].key, item.line);
      } else if (current) {
        current.push(item);
      } else {
        error(item.line, 'document', 'section', 'Content must belong to a recognized section; no preamble or extra sections.');
      }
    }

    function value(raw, spec, path, line) {
      const fail = (code, message) => { error(line, path, code, message); return undefined; };
      if (!raw.trim()) return fail('value', `${spec.label} must not be empty.`);
      if (PLACEHOLDER.test(raw)) return fail('placeholder', `Replace the placeholder in ${spec.label} with review evidence.`);
      if (spec.type === 'text') return raw;
      if (raw.includes('\n')) return fail('value', `${spec.label} must be on one physical line.`);
      if (Array.isArray(spec.type)) {
        return spec.type.includes(raw) ? raw : fail('value', `${spec.label} must be one of: ${spec.type.join(' | ')}.`);
      }
      if (spec.type === 'version') return raw === '1' ? 1 : fail('value', 'Format version must be 1; migrate older reports explicitly.');
      if (spec.type === 'sha') return SHA.test(raw) ? raw : fail('value', `${spec.label} must be a full lowercase 40- or 64-character commit ID.`);
      if (spec.type === 'findingId') return FINDING_ID.test(raw) ? raw : fail('value', 'Originating finding must be F followed by a positive integer without leading zeroes.');
      let parsed;
      try { parsed = JSON.parse(raw); } catch { return fail('value', `${spec.label} must be a JSON array of strings on one line.`); }
      if (!Array.isArray(parsed) || parsed.some(item => typeof item !== 'string' || !item.trim()) ||
          (spec.type !== 'labels' && parsed.length === 0) || new Set(parsed).size !== parsed.length) {
        return fail('value', `${spec.label} must be a JSON array of unique nonempty strings${spec.type === 'labels' ? '; [] is allowed for unmapped labels' : ', with at least one element'}.`);
      }
      if (parsed.some(item => PLACEHOLDER.test(item))) return fail('placeholder', `Replace placeholders in ${spec.label}.`);
      if (spec.type === 'shas' && parsed.some(item => !SHA.test(item))) return fail('value', `${spec.label} must contain full lowercase commit IDs.`);
      if (spec.type === 'paths' && parsed.some(item => item.includes('\0') || item.startsWith('/') || /^(?:[A-Za-z]:[\\/])/.test(item) || item.split('/').some(part => ['', '.', '..'].includes(part)))) {
        return fail('value', `${spec.label} must contain exact repository-relative Git paths without empty, dot, or parent components.`);
      }
      return parsed;
    }

    function fields(body, specs, path, prefix = '- ') {
      const result = {};
      const seen = new Set();
      const records = [];
      let currentField;
      let lastField = -1;
      for (const item of body) {
        const match = /^(\- )?\*\*([^*]+):\*\*(?: ([^\n]*))?$/.exec(item.raw);
        if (match && (match[1] ?? '') === prefix) {
          const index = specs.findIndex(spec => spec.label === match[2]);
          currentField = undefined;
          if (index < 0) { error(item.line, path, 'field', `Unknown field "${match[2]}" in ${path}.`); continue; }
          const spec = specs[index];
          const fieldPath = `${path}.${spec.key}`;
          if (seen.has(spec.key)) { error(item.line, fieldPath, 'duplicate', `${spec.label} occurs more than once.`); continue; }
          if (index < lastField) error(item.line, fieldPath, 'order', `${spec.label} is out of template order.`);
          lastField = index;
          seen.add(spec.key);
          locations.set(fieldPath, item.line);
          currentField = { spec, path: fieldPath, raw: match[3] ?? '', line: item.line };
          records.push(currentField);
        } else if (item.raw.startsWith('  ') && currentField?.spec.type === 'text' &&
            !/^(?:[-*+] |\d+[.)] |[#>|`~]|\*\*|<!)|\*\*[^*]+:\*\*/.test(item.raw.trimStart())) {
          currentField.raw += '\n' + item.raw.slice(2);
        } else {
          currentField = undefined;
          error(item.line, path, 'syntax', `Expected ${prefix}**Field:** value or a prose continuation indented by two spaces.`);
        }
      }
      for (const record of records) result[record.spec.key] = value(record.raw, record.spec, record.path, record.line);
      for (const spec of specs) {
        if (!spec.optional && !seen.has(spec.key)) problem(`${path}.${spec.key}`, 'required', `Missing required field ${spec.label}.`);
      }
      return result;
    }

    function entries(body, section) {
      const { key: path, id } = section;
      const clean = kind === 'change'
        ? 'No unresolved findings remain in the reviewed change artifacts and relevant repository context.'
        : 'No unresolved findings remain in the implementation review.';
      const empty = id === 'F'
        ? data.assessment?.coverageStatus === 'Incomplete' ? 'No findings confirmed; review incomplete.' : clean
        : section.empty;
      if (empty && body.length === 1 && body[0].raw === empty) return [];
      const pattern = id === 'F'
        ? /^### (F[1-9][0-9]*) · (Critical|High|Medium|Low) — (\S.*)$/
        : new RegExp(`^### (${id}[1-9][0-9]*) · (\\S.*)$`);
      const records = [];
      const seen = new Set();
      let record;
      for (const item of body) {
        const match = pattern.exec(item.raw);
        if (match) {
          const entryId = match[1];
          const entryPath = `${path}.${entryId}`;
          if (seen.has(entryId)) error(item.line, entryPath, 'duplicate', `Duplicate ID ${entryId}.`);
          seen.add(entryId);
          locations.set(entryPath, item.line);
          record = { id: entryId, title: match[id === 'F' ? 3 : 2], body: [] };
          if (id === 'F') record.severity = match[2];
          if (PLACEHOLDER.test(record.title)) error(item.line, entryPath, 'placeholder', 'Replace the entry title placeholder.');
          records.push(record);
        } else if (item.raw.startsWith('#') || !record) {
          error(item.line, path, 'entry', `Expected a canonical ${id}<n> entry${empty ? ` or exactly "${empty}"` : ''}.`);
          record = undefined;
        } else {
          record.body.push(item);
        }
      }
      if (records.length === 0) problem(path, 'required', `Section ${section.name} must contain entries${empty ? ' or its exact empty-state sentence' : '; omit it when none exist'}.`);
      return records.map(({ body: entryBody, ...entry }) => ({ ...entry, ...fields(entryBody, section.fields, `${path}.${entry.id}`) }));
    }

    function passes(body, path) {
      const names = ['Independent decision review', 'OpenSpec conformance', 'Code quality'];
      if (body[0]?.raw !== '| Pass | Status | Evidence or limitation |' ||
          !/^\|\s*-{3,}\s*\|\s*-{3,}\s*\|\s*-{3,}\s*\|$/.test(body[1]?.raw ?? '') || body.length !== 5) {
        problem(path, 'table', 'Pass coverage requires the exact header, separator, and three ordered pass rows.');
      }
      return body.slice(2).map((item, index) => {
        const cells = item.raw.split('|');
        const rowPath = `${path}.${index}`;
        locations.set(rowPath, item.line);
        if (cells.length !== 5 || cells[0] !== '' || cells[4] !== '' || cells[1].trim() !== names[index]) {
          error(item.line, rowPath, 'table', `Expected pass "${names[index] ?? '(no extra pass)'}" and exactly three cells; use &#124; for a literal pipe.`);
          return {};
        }
        return {
          pass: cells[1].trim(),
          status: value(cells[2].trim(), field('Status', COMPLETE), rowPath, item.line),
          evidence: value(cells[3].trim(), field('Evidence or limitation'), rowPath, item.line),
        };
      });
    }

    for (const section of schema) {
      const body = sections.get(section.name);
      if (!body) {
        if (!section.optional) problem(section.key, 'required', `Missing required section ${section.name}.`);
        else if (section.type === 'entries') data[section.key] = [];
        continue;
      }
      if (section.type === 'fields') data[section.key] = fields(body, section.fields, section.key, section.prefix);
      if (section.type === 'entries') data[section.key] = entries(body, section);
      if (section.type === 'passes') data[section.key] = passes(body, section.key);
      if (section.type === 'prose') {
        if (body.length === 0) problem(section.key, 'required', 'Review coverage must describe what was inspected.');
        for (const item of body) {
          if (/^\s*(?:[#>|`~]|[-*+] |\d+[.)] |<!)|\*\*[^*]+:\*\*/.test(item.raw)) {
            error(item.line, section.key, 'syntax', 'Review coverage accepts prose only; put structured state in its designated fields.');
          }
          if (PLACEHOLDER.test(item.raw)) error(item.line, section.key, 'placeholder', 'Replace review coverage placeholders.');
        }
        data[section.key] = body.map(item => item.raw).join('\n');
      }
    }

    // Only check cross-field invariants after structural parsing succeeds.
    if (errors.length === 0) {
      const assessment = data.assessment;
      const incomplete = assessment.coverageStatus === 'Incomplete';
      if (incomplete && !assessment.coverageLimitations) problem('assessment.coverageLimitations', 'required', 'Incomplete coverage requires Coverage limitations.');
      if (!incomplete && assessment.coverageLimitations) problem('assessment.coverageLimitations', 'coverage', 'Coverage limitations is reserved for incomplete required coverage; record non-blocking tool limitations in Validation or coverage evidence.');
      const expectedResult = data.findings.length ? 'Changes needed'
        : incomplete ? kind === 'change' ? 'Review incomplete' : 'Incomplete' : 'No unresolved findings';
      if (assessment.result !== expectedResult) problem('assessment.result', 'result', `Result must be "${expectedResult}" for the recorded findings and coverage.`);
      const activeIds = new Set(data.findings.map(entry => entry.id));
      const riskIds = new Set(data.acceptedRisks.map(entry => entry.id));
      for (const id of assessment.summary.match(/\bAR[1-9][0-9]*\b/g) ?? []) {
        if (!riskIds.has(id)) problem('assessment.summary', 'reference', `Summary names ${id}, which is absent from Accepted risks.`);
      }
      const origins = new Set();
      for (const risk of data.acceptedRisks) {
        const path = `acceptedRisks.${risk.id}`;
        if (activeIds.has(risk.originatingFinding) || origins.has(risk.originatingFinding)) problem(`${path}.originatingFinding`, 'reference', 'An originating finding cannot also be active or belong to another accepted risk.');
        origins.add(risk.originatingFinding);
        if (risk.acceptanceLifetime === 'Durable' && !risk.decisionRecord) problem(`${path}.decisionRecord`, 'required', 'Durable acceptance requires a Decision record.');
        if (!new RegExp(`\\b${risk.id}\\b`).test(assessment.summary)) problem('assessment.summary', 'reference', `Summary must name accepted risk ${risk.id}.`);
      }
      if (kind === 'implementation') {
        const target = data.reviewTarget;
        if (target.openSpecChange !== data.change) problem('reviewTarget.openSpecChange', 'target', 'OpenSpec change must match the report title.');
        if (target.baseCommit === target.reviewedHead) problem('reviewTarget.baseCommit', 'target', 'Base and reviewed head must differ.');
        const hashes = [target.baseCommit, target.reviewedHead, ...target.targetCommits];
        if (hashes.some(sha => sha.length !== target.baseCommit.length) ||
            !target.targetCommits.includes(target.reviewedHead) || target.targetCommits.includes(target.baseCommit)) {
          problem('reviewTarget.targetCommits', 'target', 'Target commits must use one hash format, include the reviewed head, and exclude the base.');
        }
        if (data.passCoverage.some(pass => pass.status === 'Incomplete') && !incomplete) problem('assessment.coverageStatus', 'coverage', 'An incomplete pass requires Coverage status: Incomplete.');
        if (data.reviewedIncrement.length === 0 && !incomplete) problem('reviewedIncrement', 'coverage', 'Missing review units require incomplete coverage.');
        const inventory = new Set(target.reviewablePaths);
        const planning = new Set(target.planningEvidencePaths ?? []);
        const unmapped = new Set(data.unmappedRange?.unmatchedTargetPaths ?? []);
        const delivery = new Set(data.reviewedIncrement.flatMap(unit => unit.implementationTarget));
        for (const [path, paths] of [
          ['reviewTarget.planningEvidencePaths', planning],
          ['unmappedRange.unmatchedTargetPaths', unmapped],
          ...data.reviewedIncrement.map(unit => [`reviewedIncrement.${unit.id}.implementationTarget`, unit.implementationTarget]),
        ]) {
          for (const item of paths) if (!inventory.has(item)) problem(path, 'target', `Path ${JSON.stringify(item)} is outside Reviewable paths.`);
        }
        for (const item of inventory) {
          const roles = [planning, unmapped, delivery].filter(group => group.has(item)).length;
          if (roles !== 1) problem('reviewTarget.reviewablePaths', 'target', `Path ${JSON.stringify(item)} needs exactly one role: planning evidence, review units, or unmapped.`);
        }
        for (const [section, entries] of [['findings', data.findings], ['acceptedRisks', data.acceptedRisks]]) {
          for (const entry of entries) {
            if (!entry.currentTargetRelation && entry.evidenceRevisions.some(sha => sha !== target.baseCommit && sha !== target.reviewedHead)) {
              problem(`${section}.${entry.id}.evidenceRevisions`, 'target', 'Current evidence must cite base/head; older evidence requires Current target relation: Carried forward; not re-reviewed.');
            }
          }
        }
      }
    }
    return { valid: errors.length === 0, errors, data: errors.length === 0 ? data : null };
  };
}

/** Read only the supplied file. JSON diagnostics are the same as the import API. */
export function runCli(moduleUrl, validateReview) {
  if (!process.argv[1]) return;
  try {
    if (realpathSync(process.argv[1]) !== realpathSync(fileURLToPath(moduleUrl))) return;
  } catch {
    // Importing from an embedded/virtual entry point must not invoke the CLI.
    return;
  }
  const usage = 'Usage: node validate-review.mjs [--json] <review-file>\nExit codes: 0 valid, 1 invalid report, 2 file/encoding error, 64 invalid arguments.\n';
  const args = process.argv.slice(2);
  if (args.length === 1 && args[0] === '--help') { process.stdout.write(usage); return; }
  const json = args.includes('--json');
  const files = args.filter(arg => arg !== '--json');
  if (files.length !== 1 || files[0].startsWith('-') || args.filter(arg => arg === '--json').length > 1) {
    process.stderr.write(usage);
    process.exitCode = 64;
    return;
  }
  const file = files[0];
  let result;
  try {
    if (!statSync(file).isFile()) throw new Error('Expected a regular review file.');
    const source = new TextDecoder('utf-8', { fatal: true }).decode(readFileSync(file));
    result = validateReview(source);
    process.exitCode = result.valid ? 0 : 1;
  } catch (error) {
    result = { valid: false, errors: [{ line: 1, path: 'document', code: 'io', message: error.message }], data: null };
    process.exitCode = 2;
  }
  if (json) process.stdout.write(JSON.stringify({ file, ...result }, null, 2) + '\n');
  else if (result.valid) process.stdout.write(`${file}: valid review format v1 (${result.data.findings.length} findings, ${result.data.acceptedRisks.length} accepted risks).\n`);
  else for (const error of result.errors) process.stderr.write(`${file}:${error.line} [${error.code}] ${error.path}: ${error.message}\n`);
}
