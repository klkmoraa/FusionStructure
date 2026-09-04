import { strict as assert } from 'node:assert';
import test from 'node:test';

import {
  assertCleanWorktree,
  assertResolvedTag,
  assertRepositoryIdentity,
  buildSyncPlan,
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
