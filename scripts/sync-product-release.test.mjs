import { strict as assert } from 'node:assert';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import test from 'node:test';

import {
  assertCleanWorktree,
  assertRecordedCommit,
  assertResolvedTag,
  assertRepositoryIdentity,
  buildSyncPlan,
  synchronizeMappedPaths,
  validateReleaseManifest,
  validateReleaseRef,
} from './sync-product-release.mjs';

const manifest = {
  schemaVersion: 1,
  products: {
    fstructure: {
      repository: 'klkmoraa/fstructure',
      releaseTag: 'v0.1.1',
      commit: '4bb9728577af858e3b3d759936780476bedcba61',
      pagesUrl: 'https://klkmoraa.github.io/fstructure/',
      contractVersions: { projectFormat: '0.1', algorithm: 'solver2d-corpus-v1' },
      gate: { command: 'npm.cmd run check', result: 'passed' },
      paths: [{ source: 'src/engine', target: 'src/engine' }],
    },
  },
};

test('accepts immutable semantic release tags and rejects branches', () => {
  assert.equal(validateReleaseRef('v1.2.3'), 'v1.2.3');
  assert.equal(validateReleaseRef('v1.2.3-beta.2'), 'v1.2.3-beta.2');
  assert.throws(() => validateReleaseRef('main'), /semantic release tag/);
});

test('requires the fetched ref to resolve from a real tag to HEAD', () => {
  const commit = '4bb9728577af858e3b3d759936780476bedcba61';
  assert.doesNotThrow(() => assertResolvedTag({ ref: 'v0.1.1', tagCommit: commit, headCommit: commit }));
  assert.throws(() => assertResolvedTag({ ref: 'v0.1.1', tagCommit: '', headCommit: commit }), /tag/);
  assert.throws(
    () => assertResolvedTag({ ref: 'v0.1.1', tagCommit: '1111111111111111111111111111111111111111', headCommit: commit }),
    /does not resolve/,
  );
});

test('rejects a recorded tag that was moved to a different commit', () => {
  const recorded = '4bb9728577af858e3b3d759936780476bedcba61';
  assert.doesNotThrow(() => assertRecordedCommit({ recordedRef: 'v0.1.1', requestedRef: 'v0.1.1', recordedCommit: recorded, fetchedCommit: recorded }));
  assert.throws(() => assertRecordedCommit({
    recordedRef: 'v0.1.1',
    requestedRef: 'v0.1.1',
    recordedCommit: recorded,
    fetchedCommit: '1111111111111111111111111111111111111111',
  }), /moved/);
  assert.doesNotThrow(() => assertRecordedCommit({
    recordedRef: 'v0.1.1',
    requestedRef: 'v0.1.2',
    recordedCommit: recorded,
    fetchedCommit: '1111111111111111111111111111111111111111',
  }));
});

test('rejects an unknown product before any fetch', () => {
  assert.throws(() => buildSyncPlan(manifest, 'space3d', 'v0.1.1'), /Unknown product/);
});

test('rejects repository identity mismatches', () => {
  assert.doesNotThrow(() => assertRepositoryIdentity('https://github.com/klkmoraa/fstructure.git', 'klkmoraa/fstructure'));
  assert.throws(() => assertRepositoryIdentity('https://github.com/other/fstructure.git', 'klkmoraa/fstructure'), /Repository mismatch/);
});

test('rejects dirty worktrees', () => {
  assert.doesNotThrow(() => assertCleanWorktree(''));
  assert.throws(() => assertCleanWorktree(' M src/App.tsx\n'), /clean worktree/);
});

test('rejects bootstrap and local Foundation targets', () => {
  const reserved = structuredClone(manifest);
  reserved.products.fstructure.paths = [{ source: 'src/App.tsx', target: 'src/App.tsx' }];
  assert.throws(() => validateReleaseManifest(reserved), /reserved target/);

  reserved.products.fstructure.paths = [{ source: 'src/foundation', target: 'src/foundation' }];
  assert.throws(() => validateReleaseManifest(reserved), /reserved target/);

  reserved.products.fstructure.paths = [{ source: 'scripts', target: 'scripts' }];
  assert.throws(() => validateReleaseManifest(reserved), /not owned/);
});

test('rejects overlapping ownership across products', () => {
  const overlapping = structuredClone(manifest);
  overlapping.products.space3d = {
    ...structuredClone(manifest.products.fstructure),
    repository: 'klkmoraa/fusionstructure-space3d',
    paths: [{ source: 'src/engine/solver.ts', target: 'src/engine/solver.ts' }],
  };
  assert.throws(() => validateReleaseManifest(overlapping), /overlapping target/);
});

test('requires traceable contracts, gate evidence, commit and public URL fields', () => {
  for (const missingField of ['commit', 'contractVersions', 'gate']) {
    const incomplete = structuredClone(manifest);
    delete incomplete.products.fstructure[missingField];
    assert.throws(() => validateReleaseManifest(incomplete), new RegExp(missingField));
  }

  const missingAlgorithm = structuredClone(manifest);
  delete missingAlgorithm.products.fstructure.contractVersions.algorithm;
  assert.throws(() => validateReleaseManifest(missingAlgorithm), /algorithm/);

  const invalidPagesUrl = structuredClone(manifest);
  invalidPagesUrl.products.fstructure.pagesUrl = 'http://localhost:4173';
  assert.throws(() => validateReleaseManifest(invalidPagesUrl), /pagesUrl/);
});

test('builds a deterministic copy plan for a known product', () => {
  const plan = buildSyncPlan(manifest, 'fstructure', 'v0.1.1');
  assert.equal(plan.repository, 'klkmoraa/fstructure');
  assert.equal(plan.ref, 'v0.1.1');
  assert.deepEqual(plan.paths, [{ source: 'src/engine', target: 'src/engine' }]);
});

test('preflights every source before replacing any destination', () => {
  const fixtureRoot = mkdtempSync(resolve(tmpdir(), 'fusionstructure-sync-test-'));
  const sourceRoot = resolve(fixtureRoot, 'source');
  const targetRoot = resolve(fixtureRoot, 'target');
  const transactionRoot = resolve(fixtureRoot, 'transaction');
  mkdirSync(resolve(sourceRoot, 'src/engine'), { recursive: true });
  mkdirSync(resolve(targetRoot, 'src/engine'), { recursive: true });
  writeFileSync(resolve(sourceRoot, 'src/engine/value.ts'), 'new\n');
  writeFileSync(resolve(targetRoot, 'src/engine/value.ts'), 'old\n');

  try {
    assert.throws(() => synchronizeMappedPaths({
      sourceRoot,
      targetRoot,
      transactionRoot,
      mappings: [
        { source: 'src/engine', target: 'src/engine' },
        { source: 'src/missing', target: 'src/missing' },
      ],
    }), /missing allowlisted path/);
    assert.equal(readFileSync(resolve(targetRoot, 'src/engine/value.ts'), 'utf8'), 'old\n');
  } finally {
    rmSync(fixtureRoot, { recursive: true, force: true });
  }
});
