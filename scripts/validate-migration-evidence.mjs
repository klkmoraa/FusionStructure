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
  'github-governance-current.json',
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
const requiredBaselineCommit = 'c1824c016e163cf22652565ea486f3a1c0928c5b';
const requiredBaselineTag = 'monolith-cutover-20260903';
const requiredTagObjectOid = '028dbf915b369439eafd5ea9e53c6e1f6eed92d2';
const requiredOriginalAuditCommit = '4a7ad17f2aef8e9e74bc556ca184f9b079dde12a';
const requiredRemote = 'https://github.com/klkmoraa/FusionStructure.git';
const requiredRemoteVerificationCommand = 'git ls-remote origin refs/tags/monolith-cutover-20260903 refs/tags/monolith-cutover-20260903^{}';
const requiredToolchain = {
  node: 'v24.19.0',
  npm: '11.17.0',
  nodeVersionFile: '.nvmrc',
};
const requiredCiEvidence = {
  provider: 'github-actions',
  workflow: 'CI',
  runId: 33807212560,
  event: 'push',
  headBranch: 'main',
  headSha: requiredBaselineCommit,
  status: 'completed',
  conclusion: 'success',
  createdAt: '2026-09-03T21:18:21Z',
  updatedAt: '2026-09-03T21:19:53Z',
  url: 'https://github.com/klkmoraa/FusionStructure/actions/runs/33807212560',
};
const requiredTestEvidence = {
  command: 'npm.cmd run test',
  baselineSourceTestFiles: 34,
  baselineTestCases: 159,
  passedSourceTestFiles: 34,
  passedTestCases: 159,
  failedSourceTestFiles: 0,
  failedTestCases: 0,
};
const requiredGithubLimitationMessage = 'Upgrade to GitHub Pro or make this repository public to enable this feature.';
const requiredAssetSelectionDescription = 'All committed static media and font/license assets under artifacts/qa, brandbook-site/public, docs/assets, motion/landing-loop/assets, public/assets, public/fonts, plus public/favicon.svg.';
const requiredAssetExtensions = ['jpg', 'jpeg', 'png', 'svg', 'webm', 'mp4', 'woff2', 'txt'];
const requiredFixtureScope = 'Existing committed files below fixture or test-data directories at the baseline; TypeScript fixture builders are source code and are not duplicated here.';
const requiredGovernanceNote = 'CODEOWNERS records accountability only; it does not enforce protected review.';
const requiredHistoricalGovernance = {
  schemaVersion: 1,
  observedAt: '2026-09-03T18:27:15-06:00',
  repository: 'klkmoraa/FusionStructure',
  visibility: 'private',
  enforcement: {
    branchProtection: {
      endpoint: 'GET /repos/klkmoraa/FusionStructure/branches/main/protection',
      httpStatus: 403,
      message: requiredGithubLimitationMessage,
      documentationUrl: 'https://docs.github.com/rest/branches/branch-protection#get-branch-protection',
      enforced: false,
    },
    rulesets: {
      endpoint: 'GET /repos/klkmoraa/FusionStructure/rulesets',
      httpStatus: 403,
      message: requiredGithubLimitationMessage,
      documentationUrl: 'https://docs.github.com/rest/repos/rules#get-all-repository-rulesets',
      enforced: false,
    },
  },
  interimRule: {
    repositorySplitAllowed: false,
    reason: 'No split while branch protection or ruleset enforcement is unavailable.',
    simulatedEnforcement: false,
    repositoryMadePublic: false,
    planPurchased: false,
  },
  repositoriesCreatedOrPushed: [],
  note: requiredGovernanceNote,
};
const requiredCurrentRepository = {
  endpoint: 'GET /repos/klkmoraa/FusionStructure',
  httpStatus: 200,
  fullName: 'klkmoraa/FusionStructure',
  visibility: 'public',
  defaultBranch: 'main',
};
const requiredCurrentBranchProtection = {
  endpoint: 'GET /repos/klkmoraa/FusionStructure/branches/main/protection',
  httpStatus: 200,
  enforced: true,
  requiredConversationResolution: true,
  requiredLinearHistory: true,
  allowForcePushes: false,
  allowDeletions: false,
  enforceAdmins: false,
  ownerBypassRetained: true,
};
const requiredCurrentStatusChecks = {
  strict: true,
  contexts: ['Puerta de calidad'],
};
const requiredCurrentPullRequestReviews = {
  requiredApprovingReviewCount: 1,
  dismissStaleReviews: true,
  requireCodeOwnerReviews: true,
  requireLastPushApproval: true,
};
const requiredCurrentRulesets = {
  endpoint: 'GET /repos/klkmoraa/FusionStructure/rulesets',
  httpStatus: 200,
  activeRulesetCount: 0,
  activeEnforcement: 'branch-protection',
};
const requiredCurrentRepositorySplit = {
  allowed: true,
  simulatedEnforcement: false,
  requiresCurrentGovernanceValidation: true,
};
const requiredCurrentGovernanceNote = 'Branch protection is the active enforcement. Administrators, including the repository owner, retain bypass because enforceAdmins is false.';

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
    const name = basename(path);
    if (records.has(name)) throw new Error(`Duplicate JSON record basename: ${name}`);
    try {
      records.set(name, JSON.parse(readFileSync(path, 'utf8')));
    } catch (error) {
      throw new Error(`Failed to parse JSON record ${name}: ${error.message}`);
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
const fixturePathPattern = /(?:^|\/)(?:fixtures?|test-data)\//;

const hasExactFields = (record, requiredFields) => record && Object.entries(requiredFields)
  .every(([key, value]) => record[key] === value);
const hasExactStructure = (record, expected) => {
  if (Array.isArray(expected)) {
    return Array.isArray(record)
      && record.length === expected.length
      && expected.every((value, index) => hasExactStructure(record[index], value));
  }
  if (expected && typeof expected === 'object') {
    if (!record || typeof record !== 'object' || Array.isArray(record)) return false;
    const recordKeys = Object.keys(record).sort();
    const expectedKeys = Object.keys(expected).sort();
    return recordKeys.length === expectedKeys.length
      && expectedKeys.every((key, index) => recordKeys[index] === key && hasExactStructure(record[key], expected[key]));
  }
  return record === expected;
};
const isIsoTimestamp = (value) => typeof value === 'string'
  && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(value)
  && Number.isFinite(Date.parse(value));

const validateManifestStructure = (manifest, baselineCommit) => {
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
  }
};

const validateManifestSources = (manifest, baselineCommit, baselineTreeEntries) => {
  const baselinePaths = new Set();
  for (const entry of baselineTreeEntries) {
    let path = entry.path;
    baselinePaths.add(path);
    while (path.includes('/')) {
      path = path.slice(0, path.lastIndexOf('/'));
      baselinePaths.add(path);
    }
  }
  for (const entry of manifest.entries) {
    if (entry.status !== 'planned' && !baselinePaths.has(entry.source_path)) {
      throw new Error(`${entry.source_path} is absent from baseline ${baselineCommit}; mark it planned or correct the path`);
    }
  }
};

const validateBaselineRecord = (baseline) => {
  const commit = baseline?.baseline?.commit;
  const tag = baseline?.baseline?.tag;
  if (baseline?.schemaVersion !== 1) throw new Error('baseline.json schemaVersion must be 1');
  if (!isIsoTimestamp(baseline.recordedAt)) throw new Error('baseline.json recordedAt must be an ISO timestamp');
  if (commit !== requiredBaselineCommit) throw new Error(`Baseline commit must equal ${requiredBaselineCommit}`);
  if (tag !== requiredBaselineTag) throw new Error(`Baseline tag must equal ${requiredBaselineTag}`);
  if (baseline.baseline?.tagKind !== 'annotated') throw new Error('Baseline tag kind must be annotated');
  if (baseline.baseline?.tagObjectOid !== requiredTagObjectOid) throw new Error('Baseline tag object OID does not match the required annotated tag');
  if (baseline.baseline?.remote !== requiredRemote) throw new Error('Baseline remote does not match the required repository');
  if (baseline.baseline?.remoteVerification?.tagRefOid !== requiredTagObjectOid) throw new Error('Remote tag object OID does not match the required annotated tag');
  if (baseline.baseline?.remoteVerification?.dereferencedCommit !== requiredBaselineCommit) throw new Error('Remote tag dereference does not match the required baseline');
  if (baseline.baseline?.remoteVerification?.command !== requiredRemoteVerificationCommand || !isIsoTimestamp(baseline.baseline?.remoteVerification?.verifiedAt)) {
    throw new Error('Remote tag verification evidence is incomplete');
  }
  if (baseline?.historicalEvidence?.originalAuditCommit !== requiredOriginalAuditCommit) {
    throw new Error(`Original audit commit must equal ${requiredOriginalAuditCommit}`);
  }
  if (baseline.historicalEvidence.role !== 'historical-evidence-only' || baseline.historicalEvidence.implementationBase !== false) {
    throw new Error('Original audit commit must remain historical evidence only');
  }
  if (!hasExactFields(baseline.toolchain, requiredToolchain) || typeof baseline.toolchain?.nodeVersionFileValue !== 'string') {
    throw new Error('baseline.json toolchain evidence is incomplete');
  }
  if (baseline.packageLock?.path !== 'package-lock.json' || baseline.packageLock?.digestAlgorithm !== 'sha256' || baseline.packageLock?.source !== 'git blob at baseline commit') {
    throw new Error('baseline.json package-lock evidence is incomplete');
  }
  if (baseline.tree?.gitObjectFormat !== 'sha1' || baseline.tree?.canonicalInventoryAlgorithm !== 'sha256(git ls-tree -r -z BASELINE)') {
    throw new Error('baseline.json tree evidence is incomplete');
  }
  if (!hasExactFields(baseline.ci, requiredCiEvidence)) throw new Error('baseline.json CI evidence is incomplete');
  if (!hasExactFields(baseline.tests, requiredTestEvidence) || !isIsoTimestamp(baseline.tests?.observedAt)) {
    throw new Error('Baseline test counts do not match the frozen evidence');
  }
};

const validateBaselineGitEvidence = (baseline, root) => {
  const commit = baseline.baseline.commit;
  const tag = baseline.baseline.tag;
  runGit(root, ['cat-file', '-e', `${requiredBaselineCommit}^{commit}`]);
  runGit(root, ['cat-file', '-e', `${requiredOriginalAuditCommit}^{commit}`]);
  if (runGit(root, ['cat-file', '-t', tag]).trim() !== 'tag') throw new Error(`${tag} is not an annotated tag`);
  if (runGit(root, ['rev-parse', tag]).trim() !== requiredTagObjectOid) throw new Error('Local annotated tag object OID does not match the frozen evidence');
  if (runGit(root, ['rev-parse', `${tag}^{}`]).trim() !== commit) throw new Error(`${tag} does not dereference to baseline commit`);

  const nodeVersionFile = runGit(root, ['show', `${commit}:${requiredToolchain.nodeVersionFile}`]);
  if (baseline.toolchain.nodeVersionFileValue !== nodeVersionFile.trim()) {
    throw new Error('baseline.json toolchain evidence is incomplete');
  }

  const packageLock = runGit(root, ['show', `${commit}:package-lock.json`], 'buffer');
  if (sha256(packageLock) !== baseline.packageLock.sha256) throw new Error('Baseline package-lock SHA-256 does not match');
  if (packageLock.length !== baseline.packageLock.bytes) throw new Error('Baseline package-lock byte count does not match');
  if (runGit(root, ['rev-parse', `${commit}^{tree}`]).trim() !== baseline.tree.gitTreeOid) throw new Error('Baseline Git tree OID does not match');
  const treeListing = runGit(root, ['ls-tree', '-r', '-z', commit], 'buffer');
  if (sha256(treeListing) !== baseline.tree.canonicalInventorySha256) throw new Error('Baseline canonical tree inventory SHA-256 does not match');
  const baselineTreeEntries = parseTreeEntries(root, commit);
  const baselineTestFileCount = baselineTreeEntries
    .filter((entry) => /^src\/.*\.(?:test|spec)\.(?:ts|tsx)$/.test(entry.path)).length;
  if (baselineTestFileCount !== baseline.tests.baselineSourceTestFiles) throw new Error('Baseline source test-file count does not match the baseline tree');
  return baselineTreeEntries;
};

const validateAssetRecord = (record) => {
  if (record?.schemaVersion !== 1
    || record.baselineCommit !== requiredBaselineCommit
    || record.selection?.description !== requiredAssetSelectionDescription
    || JSON.stringify(record.selection?.extensions) !== JSON.stringify(requiredAssetExtensions)
    || record.inventoryDigestAlgorithm !== 'sha256(path + NUL + gitBlobOid + NUL + decimalBytes + LF, ordered by path)') {
    throw new Error('Asset inventory evidence is incomplete');
  }
};

const validateAssetsAgainstBaseline = (record, baseline, baselineTreeEntries) => {
  const expected = baselineTreeEntries
    .filter((entry) => assetPathPattern.test(entry.path))
    .map(({ path, gitBlobOid, bytes }) => ({ path, gitBlobOid, bytes }));
  if (JSON.stringify(record.assets) !== JSON.stringify(expected)) throw new Error('Asset inventory does not match the baseline tree');
  const digestSource = expected.map((asset) => `${asset.path}\0${asset.gitBlobOid}\0${asset.bytes}\n`).join('');
  if (sha256(digestSource) !== record.inventorySha256) throw new Error('Asset inventory SHA-256 does not match');
  const totalBytes = expected.reduce((sum, asset) => sum + asset.bytes, 0);
  if (record.totalBytes !== totalBytes || baseline.assets.totalBytes !== totalBytes) throw new Error('Asset inventory total bytes do not match');
  if (baseline.assets.inventoryFile !== 'migration/assets-inventory.json' || record.inventorySha256 !== baseline.assets.inventorySha256 || record.assets.length !== baseline.assets.count) {
    throw new Error('Asset inventory summary does not match baseline.json');
  }
};

const validateFixtureRecord = (record) => {
  if (record?.schemaVersion !== 1 || record.scope !== requiredFixtureScope || record.digestAlgorithm !== 'sha256' || !Array.isArray(record.fixtures)) {
    throw new Error('fixture-digests.json evidence is incomplete');
  }
  if (record.baselineCommit !== requiredBaselineCommit) throw new Error('Fixture baselineCommit does not match the required baseline');
};

const validateFixturesAgainstBaseline = (record, baselineTreeEntries, root) => {
  const expected = baselineTreeEntries.filter((entry) => fixturePathPattern.test(entry.path));
  if (record.fixtures.length !== expected.length || record.fixtures.some((fixture, index) => fixture.path !== expected[index]?.path)) {
    throw new Error('Fixture inventory does not match the complete baseline selection');
  }
  for (let index = 0; index < expected.length; index += 1) {
    const fixture = record.fixtures[index];
    const expectedFixture = expected[index];
    if (fixture.gitBlobOid !== expectedFixture.gitBlobOid) throw new Error(`Fixture Git blob OID does not match baseline: ${fixture.path}`);
    const content = runGit(root, ['show', `${requiredBaselineCommit}:${fixture.path}`], 'buffer');
    if (content.length !== expectedFixture.bytes || fixture.bytes !== expectedFixture.bytes || sha256(content) !== fixture.sha256) {
      throw new Error(`Fixture digest does not match baseline: ${fixture.path}`);
    }
  }
};

const validateHistoricalGovernance = (governance) => {
  if (!hasExactStructure(governance, requiredHistoricalGovernance)) {
    throw new Error('GitHub governance record must preserve the exact HTTP 403 no-split limitation');
  }
};

const validateCurrentGovernance = (governance) => {
  const { observedAt, ...record } = governance ?? {};
  const expected = {
    schemaVersion: 1,
    repository: requiredCurrentRepository,
    enforcement: {
      branchProtection: {
        ...requiredCurrentBranchProtection,
        requiredStatusChecks: requiredCurrentStatusChecks,
        requiredPullRequestReviews: requiredCurrentPullRequestReviews,
      },
      rulesets: requiredCurrentRulesets,
    },
    repositorySplit: requiredCurrentRepositorySplit,
    repositoriesCreatedOrPushed: [],
    note: requiredCurrentGovernanceNote,
  };
  if (!isIsoTimestamp(observedAt) || !hasExactStructure(record, expected)) {
    throw new Error('Current GitHub governance record must preserve the observed public protected gate');
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
  const assets = records.get('assets-inventory.json');
  const fixtures = records.get('fixture-digests.json');
  validateBaselineRecord(baseline);
  validateManifestStructure(manifest, baseline.baseline.commit);
  validateAssetRecord(assets);
  validateFixtureRecord(fixtures);
  validateHistoricalGovernance(records.get('github-governance.json'));
  validateCurrentGovernance(records.get('github-governance-current.json'));

  const baselineTreeEntries = validateBaselineGitEvidence(baseline, options.root);
  validateManifestSources(manifest, baseline.baseline.commit, baselineTreeEntries);
  validateAssetsAgainstBaseline(assets, baseline, baselineTreeEntries);
  validateFixturesAgainstBaseline(fixtures, baselineTreeEntries, options.root);

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
