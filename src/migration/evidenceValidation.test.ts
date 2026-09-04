import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { afterEach, describe, expect, test } from 'vitest';

const repoRoot = resolve(import.meta.dirname, '..', '..');
const validatorPath = resolve(repoRoot, 'scripts', 'validate-migration-evidence.mjs');
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

  test('rejects malformed machine-readable JSON records', () => {
    const directory = makeTemporaryDirectory();
    writeFileSync(resolve(directory, 'broken.json'), '{"schemaVersion":');

    const result = runValidator('--records-dir', directory);

    expect(result.status).toBe(1);
    expect(result.stderr).toContain('Failed to parse JSON record broken.json');
  });
});
