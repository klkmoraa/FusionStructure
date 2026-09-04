import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import { basename, isAbsolute, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const scriptDirectory = resolve(fileURLToPath(new URL('.', import.meta.url)));
const defaultRoot = resolve(scriptDirectory, '..');
const requiredRecordNames = [
  'assets-inventory.json',
  'baseline.json',
  'fixture-digests.json',
  'github-governance.json',
];
const requiredEntryFields = [
  'id',
  'source_path',
  'current_owner',
  'intended_destination',
  'migration_wave',
  'status',
];
const allowedStatuses = new Set(['retained', 'candidate', 'planned']);

const parseArguments = (argumentsList) => {
  const options = {
    root: defaultRoot,
    manifest: undefined,
    recordsDirectory: undefined,
  };

  for (let index = 0; index < argumentsList.length; index += 1) {
    const argument = argumentsList[index];
    const value = argumentsList[index + 1];
    if (!['--root', '--manifest', '--records-dir'].includes(argument) || !value) {
      throw new Error(`Unknown or incomplete argument: ${argument}`);
    }
    if (argument === '--root') options.root = resolve(value);
    if (argument === '--manifest') options.manifest = resolve(value);
    if (argument === '--records-dir') options.recordsDirectory = resolve(value);
    index += 1;
  }

  options.manifest ??= resolve(options.root, 'migration', 'path-manifest.yml');
  options.recordsDirectory ??= resolve(options.root, 'migration');
  return options;
};

const parseScalar = (rawValue, lineNumber) => {
  const value = rawValue.trim();
  if (value === '') throw new Error(`Missing YAML value at line ${lineNumber}`);
  if (value.startsWith('"')) {
    try {
      return JSON.parse(value);
    } catch {
      throw new Error(`Invalid quoted YAML scalar at line ${lineNumber}`);
    }
  }
  if (/^-?\d+$/.test(value)) return Number.parseInt(value, 10);
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value === 'null') return null;
  return value;
};

const parsePathManifest = (source) => {
  const document = { entries: [] };
  let currentEntry;
  const lines = source.replaceAll('\r\n', '\n').split('\n');

  for (let index = 0; index < lines.length; index += 1) {
    const lineNumber = index + 1;
    const line = lines[index];
    if (line.includes('\t')) throw new Error(`Tabs are not allowed in path manifest at line ${lineNumber}`);
    if (line.trim() === '' || line.trimStart().startsWith('#')) continue;

    let match = line.match(/^([a-z_]+):\s*(.*)$/);
    if (match) {
      const [, key, rawValue] = match;
      if (key === 'entries') {
        if (rawValue.trim() !== '') throw new Error(`entries must be a YAML sequence at line ${lineNumber}`);
        continue;
      }
      document[key] = parseScalar(rawValue, lineNumber);
      continue;
    }

    match = line.match(/^  - ([a-z_]+):\s*(.*)$/);
    if (match) {
      currentEntry = { [match[1]]: parseScalar(match[2], lineNumber) };
      document.entries.push(currentEntry);
      continue;
    }

    match = line.match(/^    ([a-z_]+):\s*(.*)$/);
    if (match && currentEntry) {
      currentEntry[match[1]] = parseScalar(match[2], lineNumber);
      continue;
    }

    throw new Error(`Unsupported path manifest YAML at line ${lineNumber}: ${line}`);
  }

  return document;
};

const collectJsonFiles = (directory) => readdirSync(directory, { withFileTypes: true })
  .flatMap((entry) => {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) return collectJsonFiles(path);
    return entry.isFile() && entry.name.endsWith('.json') ? [path] : [];
  })
  .sort();

const parseJsonRecords = (directory) => {
  const records = new Map();
  for (const path of collectJsonFiles(directory)) {
    try {
      records.set(basename(path), JSON.parse(readFileSync(path, 'utf8')));
    } catch (error) {
      throw new Error(`Failed to parse JSON record ${basename(path)}: ${error.message}`);
    }
  }
  return records;
};

const runGit = (root, args, encoding = 'utf8') => {
  const result = spawnSync('git', args, { cwd: root, encoding });
  if (result.status !== 0) {
    const detail = typeof result.stderr === 'string' ? result.stderr.trim() : 'git command failed';
    throw new Error(`${detail || 'git command failed'} [git ${args.join(' ')}]`);
  }
  return result.stdout;
};

const gitPathExists = (root, commit, sourcePath) => {
  const result = spawnSync('git', ['cat-file', '-e', `${commit}:${sourcePath}`], {
    cwd: root,
    encoding: 'utf8',
  });
  return result.status === 0;
};

const sha256 = (value) => createHash('sha256').update(value).digest('hex');

const parseTreeEntries = (root, commit) => {
  const raw = runGit(root, ['ls-tree', '-r', '-l', '-z', commit], 'buffer');
  return raw.toString('utf8').split('\0').filter(Boolean).map((record) => {
    const match = record.match(/^(\d+) blob ([0-9a-f]+)\s+(\d+)\t(.+)$/s);
    if (!match) throw new Error(`Unsupported git tree record: ${record}`);
    return { mode: match[1], gitBlobOid: match[2], bytes: Number(match[3]), path: match[4] };
  });
};

const assetPathPattern = /^(?:(?:artifacts\/|brandbook-site\/public\/|docs\/assets\/|motion\/landing-loop\/assets\/|public\/(?:assets\/|fonts\/)).*\.(?:jpe?g|png|svg|webm|mp4|woff2|txt)|public\/favicon\.svg)$/i;

const validateManifest = (manifest, root, baselineCommit) => {
  if (manifest.schema_version !== 1) throw new Error('path-manifest.yml schema_version must be 1');
  if (manifest.baseline_commit !== baselineCommit) throw new Error('Manifest baseline_commit does not match baseline.json');
  if (!Array.isArray(manifest.entries) || manifest.entries.length === 0) throw new Error('Manifest entries must not be empty');

  const ids = new Set();
  for (const entry of manifest.entries) {
    for (const field of requiredEntryFields) {
      if (entry[field] === undefined || entry[field] === '') throw new Error(`Manifest entry is missing ${field}`);
    }
    if (ids.has(entry.id)) throw new Error(`Duplicate manifest id: ${entry.id}`);
    ids.add(entry.id);
    if (!allowedStatuses.has(entry.status)) throw new Error(`Unsupported manifest status for ${entry.id}: ${entry.status}`);
    if (typeof entry.migration_wave !== 'number' || entry.migration_wave < 0) throw new Error(`Invalid migration_wave for ${entry.id}`);
    if (isAbsolute(entry.source_path) || entry.source_path.split('/').includes('..')) throw new Error(`Unsafe manifest source path: ${entry.source_path}`);
    if (entry.status !== 'planned' && !gitPathExists(root, baselineCommit, entry.source_path)) {
      throw new Error(`${entry.source_path} is absent from baseline ${baselineCommit}; mark it planned or correct the path`);
    }
  }
};

const validateBaseline = (baseline, root) => {
  const commit = baseline?.baseline?.commit;
  const tag = baseline?.baseline?.tag;
  if (!/^[0-9a-f]{40}$/.test(commit ?? '')) throw new Error('baseline.json has an invalid baseline commit');
  if (baseline?.historicalEvidence?.originalAuditCommit === commit) throw new Error('Original audit commit must remain historical evidence only');
  runGit(root, ['cat-file', '-e', `${commit}^{commit}`]);
  runGit(root, ['cat-file', '-e', `${baseline.historicalEvidence.originalAuditCommit}^{commit}`]);
  if (runGit(root, ['cat-file', '-t', tag]).trim() !== 'tag') throw new Error(`${tag} is not an annotated tag`);
  if (runGit(root, ['rev-parse', `${tag}^{}`]).trim() !== commit) throw new Error(`${tag} does not dereference to baseline commit`);

  const packageLock = runGit(root, ['show', `${commit}:package-lock.json`], 'buffer');
  if (sha256(packageLock) !== baseline.packageLock.sha256) throw new Error('Baseline package-lock SHA-256 does not match');
  if (runGit(root, ['rev-parse', `${commit}^{tree}`]).trim() !== baseline.tree.gitTreeOid) throw new Error('Baseline Git tree OID does not match');
  const treeListing = runGit(root, ['ls-tree', '-r', '-z', commit], 'buffer');
  if (sha256(treeListing) !== baseline.tree.canonicalInventorySha256) throw new Error('Baseline canonical tree inventory SHA-256 does not match');
};

const validateAssets = (record, baseline, root) => {
  const expected = parseTreeEntries(root, baseline.baseline.commit)
    .filter((entry) => assetPathPattern.test(entry.path))
    .map(({ path, gitBlobOid, bytes }) => ({ path, gitBlobOid, bytes }));
  if (JSON.stringify(record.assets) !== JSON.stringify(expected)) throw new Error('Asset inventory does not match the baseline tree');
  const digestSource = expected.map((asset) => `${asset.path}\0${asset.gitBlobOid}\0${asset.bytes}\n`).join('');
  if (sha256(digestSource) !== record.inventorySha256) throw new Error('Asset inventory SHA-256 does not match');
  if (record.inventorySha256 !== baseline.assets.inventorySha256 || record.assets.length !== baseline.assets.count) {
    throw new Error('Asset inventory summary does not match baseline.json');
  }
};

const validateFixtures = (record, baseline, root) => {
  if (!Array.isArray(record.fixtures)) throw new Error('fixture-digests.json fixtures must be an array');
  for (const fixture of record.fixtures) {
    const content = runGit(root, ['show', `${baseline.baseline.commit}:${fixture.path}`], 'buffer');
    if (content.length !== fixture.bytes || sha256(content) !== fixture.sha256) {
      throw new Error(`Fixture digest does not match baseline: ${fixture.path}`);
    }
  }
};

export const validateMigrationEvidence = (argumentsList = []) => {
  const options = parseArguments(argumentsList);
  const records = parseJsonRecords(options.recordsDirectory);
  for (const name of requiredRecordNames) {
    if (!records.has(name)) throw new Error(`Missing required JSON record: ${name}`);
  }

  const baseline = records.get('baseline.json');
  const manifest = parsePathManifest(readFileSync(options.manifest, 'utf8'));
  validateBaseline(baseline, options.root);
  validateManifest(manifest, options.root, baseline.baseline.commit);
  validateAssets(records.get('assets-inventory.json'), baseline, options.root);
  validateFixtures(records.get('fixture-digests.json'), baseline, options.root);

  const governance = records.get('github-governance.json');
  if (governance?.interimRule?.repositorySplitAllowed !== false || governance?.enforcement?.branchProtection?.httpStatus !== 403 || governance?.enforcement?.rulesets?.httpStatus !== 403) {
    throw new Error('GitHub governance record must preserve the HTTP 403 no-split limitation');
  }

  return {
    jsonRecordCount: records.size,
    manifestEntryCount: manifest.entries.length,
    fixtureCount: records.get('fixture-digests.json').fixtures.length,
    assetCount: records.get('assets-inventory.json').assets.length,
  };
};

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const result = validateMigrationEvidence(process.argv.slice(2));
    process.stdout.write(`Migration evidence valid: ${result.jsonRecordCount} JSON records, ${result.manifestEntryCount} manifest entries, ${result.fixtureCount} fixtures, ${result.assetCount} assets.\n`);
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}
