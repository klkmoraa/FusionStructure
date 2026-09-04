import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { afterEach, describe, expect, test } from 'vitest';

const repoRoot = resolve(import.meta.dirname, '..', '..');
const validatorPath = resolve(repoRoot, 'scripts', 'validate-migration-evidence.mjs');
const migrationDirectory = resolve(repoRoot, 'migration');
const recordNames = [
  'assets-inventory.json',
  'baseline.json',
  'fixture-digests.json',
  'github-governance.json',
  'github-governance-current.json',
] as const;
const temporaryDirectories: string[] = [];

const makeTemporaryDirectory = () => {
  const directory = mkdtempSync(resolve(tmpdir(), 'fusionstructure-migration-evidence-'));
  temporaryDirectories.push(directory);
  return directory;
};

const runValidator = (...args: string[]) => spawnSync(process.execPath, [validatorPath, ...args], {
  cwd: repoRoot,
  encoding: 'utf8',
});

const copyRecords = () => {
  const directory = makeTemporaryDirectory();
  for (const name of recordNames) copyFileSync(resolve(migrationDirectory, name), resolve(directory, name));
  return directory;
};

const mutateRecord = (name: typeof recordNames[number], mutate: (record: Record<string, any>) => void) => {
  const directory = copyRecords();
  const path = resolve(directory, name);
  const record = JSON.parse(readFileSync(path, 'utf8')) as Record<string, any>;
  mutate(record);
  writeFileSync(path, `${JSON.stringify(record, null, 2)}\n`);
  return directory;
};

const expectRecordsRejected = (directory: string, expectedMessage: string) => {
  const result = runValidator('--records-dir', directory);
  expect(result.status).toBe(1);
  expect(result.stderr).toContain(expectedMessage);
};

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

describe('migration evidence validator', () => {
  test('accepts the complete checked-in Phase 0 evidence set', () => {
    const result = runValidator();

    expect(result.status, result.stderr).toBe(0);
    expect(result.stdout).toMatch(/Migration evidence valid:/);
  });

  test('rejects a claimed public split gate when its required review evidence is weakened', () => {
    expectRecordsRejected(
      mutateRecord('github-governance-current.json', (record) => {
        record.enforcement.branchProtection.requiredPullRequestReviews.requiredApprovingReviewCount = 0;
      }),
      'Current GitHub governance record must preserve the observed public protected gate',
    );
  });

  test.each([
    ['required status check', (record: Record<string, any>) => { record.enforcement.branchProtection.requiredStatusChecks.contexts = []; }],
    ['repository creation', (record: Record<string, any>) => { record.repositoriesCreatedOrPushed = ['fusionstructure-solver-2d']; }],
    ['owner bypass disclosure', (record: Record<string, any>) => { record.enforcement.branchProtection.ownerBypassRetained = false; }],
  ])('rejects a current public/protected gate with altered %s evidence', (_label, mutate) => {
    expectRecordsRejected(
      mutateRecord('github-governance-current.json', mutate),
      'Current GitHub governance record must preserve the observed public protected gate',
    );
  });

  test('requires current governance evidence separately from the immutable historical limitation', () => {
    const directory = copyRecords();
    rmSync(resolve(directory, 'github-governance-current.json'));

    const result = runValidator('--records-dir', directory);

    expect(result.status).toBe(1);
    expect(result.stderr).toContain('Missing required JSON record: github-governance-current.json');
  });

  test('rejects a non-planned manifest source missing from the baseline', () => {
    const directory = makeTemporaryDirectory();
    const manifestPath = resolve(directory, 'missing-source.yml');
    writeFileSync(manifestPath, [
      'schema_version: 1',
      'baseline_commit: c1824c016e163cf22652565ea486f3a1c0928c5b',
      'entries:',
      '  - id: missing-source',
      '    source_path: src/does-not-exist',
      '    current_owner: solver-2d',
      '    intended_destination: fusionstructure-solver-2d',
      '    migration_wave: 1',
      '    status: retained',
      '',
    ].join('\n'));

    const result = runValidator('--manifest', manifestPath);

    expect(result.status).toBe(1);
    expect(result.stderr).toContain('src/does-not-exist is absent from baseline');
  });

  test('accepts a retained manifest directory present in the baseline tree', () => {
    const directory = makeTemporaryDirectory();
    const manifestPath = resolve(directory, 'baseline-directory.yml');
    writeFileSync(manifestPath, [
      'schema_version: 1',
      'baseline_commit: c1824c016e163cf22652565ea486f3a1c0928c5b',
      'entries:',
      '  - id: workflows-directory',
      '    source_path: .github',
      '    current_owner: platform',
      '    intended_destination: fusionstructure-platform',
      '    migration_wave: 1',
      '    status: retained',
      '',
    ].join('\n'));

    const result = runValidator('--manifest', manifestPath);

    expect(result.status, result.stderr).toBe(0);
  });

  test('rejects malformed machine-readable JSON records', () => {
    const directory = makeTemporaryDirectory();
    writeFileSync(resolve(directory, 'broken.json'), '{"schemaVersion":');

    const result = runValidator('--records-dir', directory);

    expect(result.status).toBe(1);
    expect(result.stderr).toContain('Failed to parse JSON record broken.json');
  });

  test.each([
    ['baseline commit', (record: Record<string, any>) => { record.baseline.commit = 'a4a1834723b20c4ad82ea606213ff08f29222e9a'; }, 'Baseline commit must equal c1824c016e163cf22652565ea486f3a1c0928c5b'],
    ['tag name', (record: Record<string, any>) => { record.baseline.tag = 'wrong-cutover-tag'; }, 'Baseline tag must equal monolith-cutover-20260903'],
    ['tag object', (record: Record<string, any>) => { record.baseline.tagObjectOid = '0000000000000000000000000000000000000000'; }, 'Baseline tag object OID does not match the required annotated tag'],
    ['remote dereference', (record: Record<string, any>) => { record.baseline.remoteVerification.dereferencedCommit = record.historicalEvidence.originalAuditCommit; }, 'Remote tag dereference does not match the required baseline'],
    ['original audit commit', (record: Record<string, any>) => { record.historicalEvidence.originalAuditCommit = 'a4a1834723b20c4ad82ea606213ff08f29222e9a'; }, 'Original audit commit must equal 4a7ad17f2aef8e9e74bc556ca184f9b079dde12a'],
  ])('pins the required %s instead of trusting coordinated record edits', (_label, mutate, message) => {
    expectRecordsRejected(mutateRecord('baseline.json', mutate), message);
  });

  test.each([
    ['toolchain schema', (record: Record<string, any>) => { delete record.toolchain.npm; }, 'baseline.json toolchain evidence is incomplete'],
    ['CI schema', (record: Record<string, any>) => { delete record.ci.runId; }, 'baseline.json CI evidence is incomplete'],
    ['test counts', (record: Record<string, any>) => { record.tests.baselineTestCases = 0; }, 'Baseline test counts do not match the frozen evidence'],
    ['package-lock byte count', (record: Record<string, any>) => { record.packageLock.bytes += 1; }, 'Baseline package-lock byte count does not match'],
    ['asset total bytes', (record: Record<string, any>) => { record.totalBytes += 1; }, 'Asset inventory total bytes do not match'],
  ])('rejects incomplete or inconsistent %s evidence', (_label, mutate, message) => {
    const recordName = _label === 'asset total bytes' ? 'assets-inventory.json' : 'baseline.json';
    expectRecordsRejected(mutateRecord(recordName, mutate), message);
  });

  test.each([
    ['baseline timestamp', 'baseline.json', (record: Record<string, any>) => { record.recordedAt = 'not-a-date'; }, 'baseline.json recordedAt must be an ISO timestamp'],
    ['asset selection schema', 'assets-inventory.json', (record: Record<string, any>) => { delete record.selection.extensions; }, 'Asset inventory evidence is incomplete'],
    ['fixture scope', 'fixture-digests.json', (record: Record<string, any>) => { delete record.scope; }, 'fixture-digests.json evidence is incomplete'],
    ['governance semantics note', 'github-governance.json', (record: Record<string, any>) => { record.note = 'enforced'; }, 'GitHub governance record must preserve the exact HTTP 403 no-split limitation'],
  ])('rejects an incomplete %s', (_label, recordName, mutate, message) => {
    expectRecordsRejected(mutateRecord(recordName as typeof recordNames[number], mutate), message);
  });

  test.each([
    ['baseline commit', (record: Record<string, any>) => { record.baselineCommit = record.fixtures[0].sha256; }, 'Fixture baselineCommit does not match the required baseline'],
    ['Git blob OID', (record: Record<string, any>) => { record.fixtures[0].gitBlobOid = '0000000000000000000000000000000000000000'; }, 'Fixture Git blob OID does not match baseline'],
    ['complete inventory', (record: Record<string, any>) => { record.fixtures = []; }, 'Fixture inventory does not match the complete baseline selection'],
  ])('reconstructs and validates fixture %s', (_label, mutate, message) => {
    expectRecordsRejected(mutateRecord('fixture-digests.json', mutate), message);
  });

  test.each([
    ['branch protection enforcement', (record: Record<string, any>) => { record.enforcement.branchProtection.enforced = true; }],
    ['simulated enforcement', (record: Record<string, any>) => { record.interimRule.simulatedEnforcement = true; }],
    ['created repositories', (record: Record<string, any>) => { record.repositoriesCreatedOrPushed = ['fusionstructure-solver-2d']; }],
    ['altered limitation message', (record: Record<string, any>) => { record.enforcement.rulesets.message = 'enforced'; }],
  ])('rejects a governance record claiming %s', (_label, mutate) => {
    expectRecordsRejected(
      mutateRecord('github-governance.json', mutate),
      'GitHub governance record must preserve the exact HTTP 403 no-split limitation',
    );
  });

  test('rejects duplicate JSON record basenames instead of silently overwriting one', () => {
    const directory = copyRecords();
    const nestedDirectory = resolve(directory, 'nested');
    mkdirSync(nestedDirectory);
    copyFileSync(resolve(directory, 'baseline.json'), resolve(nestedDirectory, 'baseline.json'));

    const result = runValidator('--records-dir', directory);

    expect(result.status).toBe(1);
    expect(result.stderr).toContain('Duplicate JSON record basename: baseline.json');
  });
});
