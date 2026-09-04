import { describe, expect, it } from 'vitest';

import * as externalHandoff from './planar2dToSpace3d';
import { createLosslessPlanar2DFixture, createLossyPlanar2DFixture } from './planar2dToSpace3d.fixtures';

describe('planar 2D to Space3D external handoff', () => {
  it('exposes a versioned proposal constructor at the external boundary', () => {
    expect(typeof externalHandoff.preparePlanar2DToSpace3DHandoff).toBe('function');
    expect(externalHandoff.preparePlanar2DToSpace3DHandoff(createLosslessPlanar2DFixture())).toMatchObject({
      version: 1,
      kind: 'planar-2d-to-space3d-handoff',
    });
  });

  it('creates a deterministic, lossless candidate handoff from the same planar snapshot', () => {
    const source = createLosslessPlanar2DFixture();
    const first = externalHandoff.preparePlanar2DToSpace3DHandoff(source);
    const second = externalHandoff.preparePlanar2DToSpace3DHandoff(structuredClone(source));

    expect(first).toMatchObject({
      kind: 'planar-2d-to-space3d-handoff',
      version: 1,
      source: {
        system: 'solver2d',
        projectId: 'fixture-planar-lossless',
        schemaVersion: 7,
        hash: { algorithm: 'fnv1a-32', value: expect.stringMatching(/^[0-9a-f]{8}$/) },
        reference: expect.stringMatching(/^solver2d:fixture-planar-lossless:fnv1a-32:/),
      },
      candidateModel: {
        id: 'space3d-from-fixture-planar-lossless',
        analysisSpace: 'space-3d',
        schemaVersion: 1,
        nodes: [],
        members: [],
      },
      lossReport: { status: 'lossless', entries: [] },
    });
    expect(first.mapping).toEqual([{
      id: 'project:fixture-planar-lossless->project:space3d-from-fixture-planar-lossless',
      source: { entityKind: 'project', entityId: 'fixture-planar-lossless' },
      target: { entityKind: 'project', entityId: 'space3d-from-fixture-planar-lossless' },
      disposition: 'preserved',
    }]);
    expect(second).toEqual(first);
  });

  it('keeps stable entity mappings and reports changed or omitted semantics without inventing 3D values', () => {
    const source = createLossyPlanar2DFixture();
    const before = structuredClone(source);
    const handoff = externalHandoff.preparePlanar2DToSpace3DHandoff(source);

    expect(source).toEqual(before);
    expect(handoff.candidateModel.members).toEqual([expect.objectContaining({
      id: 'M1', i: 'N1', j: 'N2', E: 200_000_000, A: 0.01, Iz: 8e-5,
      G: 0, Iy: 0, J: 0,
    })]);
    expect(handoff.candidateModel.nodes).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'N1', x: 0, y: 0, z: 0 }),
      expect.objectContaining({ id: 'N2', x: 4, y: 0, z: 0 }),
    ]));
    expect(handoff.mapping.find((entry) => entry.id === 'member:M1->member:M1')).toMatchObject({
      disposition: 'transformed',
      source: { entityKind: 'member', entityId: 'M1' },
      target: { entityKind: 'member', entityId: 'M1' },
    });
    expect(handoff.mapping).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'node:N1->node:N1', disposition: 'preserved' }),
      expect.objectContaining({ id: 'load:NL1->load:NL1', disposition: 'preserved' }),
      expect.objectContaining({ id: 'case:LC1->case:LC1', disposition: 'preserved' }),
      expect.objectContaining({ id: 'combination:CO1->combination:CO1', disposition: 'preserved' }),
      expect.objectContaining({ id: 'load:ML1->none', disposition: 'omitted', target: null }),
    ]));
    expect(handoff.lossReport).toMatchObject({ status: 'review-required' });
    expect(handoff.lossReport.entries).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: 'truss-member-as-frame:member:M1:type',
        code: 'truss-member-as-frame',
        classification: 'changed-semantics',
        source: { entityKind: 'member', entityId: 'M1', field: 'type' },
        target: { entityKind: 'member', entityId: 'M1', field: 'type' },
      }),
      expect.objectContaining({
        id: 'pending-shear-modulus:member:M1:G',
        code: 'pending-shear-modulus',
        classification: 'missing-required-property',
        source: { entityKind: 'member', entityId: 'M1', field: 'G' },
      }),
      expect.objectContaining({
        id: 'dropped-member-load:load:ML1:memberLoads',
        code: 'dropped-member-load',
        classification: 'omitted-semantics',
        source: { entityKind: 'load', entityId: 'ML1', field: 'memberLoads' },
        target: null,
      }),
    ]));
  });

  it('returns a deterministic cancellation record instead of delivering a declined candidate', () => {
    const handoff = externalHandoff.preparePlanar2DToSpace3DHandoff(createLossyPlanar2DFixture());
    const cancel = externalHandoff.cancelPlanar2DToSpace3DHandoff;

    expect(typeof cancel).toBe('function');
    if (typeof cancel !== 'function') return;
    expect(cancel(handoff)).toEqual({
      kind: 'planar-2d-to-space3d-handoff-cancellation',
      version: 1,
      status: 'cancelled',
      handoffId: handoff.handoffId,
      sourceReference: handoff.source.reference,
      reason: 'user-cancelled-before-open',
    });
  });

  it('compares a working 3D model against the handoff candidate without reaching back into the 2D source', () => {
    const handoff = externalHandoff.preparePlanar2DToSpace3DHandoff(createLossyPlanar2DFixture());
    const matches = externalHandoff.space3DMatchesPlanarHandoff;

    expect(typeof matches).toBe('function');
    if (typeof matches !== 'function') return;
    expect(matches({ ...handoff.candidateModel, nodes: [...handoff.candidateModel.nodes, {
      id: 'N3', x: 1, y: 1, z: 1, restraints: { ux: false, uy: false, uz: false, rx: false, ry: false, rz: false },
    }] }, handoff)).toBe(true);
    expect(matches({
      ...handoff.candidateModel,
      nodes: handoff.candidateModel.nodes.map((node) => node.id === 'N1' ? { ...node, x: 1 } : node),
    }, handoff)).toBe(false);
  });

  it('keeps one-release rollback behind an explicit, default-on feature flag', () => {
    expect(externalHandoff.EXTERNAL_2D_TO_3D_HANDOFF_FLAG).toBe('VITE_FUSION_EXTERNAL_2D_TO_3D_HANDOFF');
    expect(externalHandoff.isExternal2DTo3DHandoffEnabled('false')).toBe(false);
    expect(externalHandoff.isExternal2DTo3DHandoffEnabled(undefined)).toBe(true);
  });
});
