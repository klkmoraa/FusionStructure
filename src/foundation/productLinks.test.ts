import { describe, expect, it } from 'vitest';
import { PRODUCT_IDS, PRODUCT_LINKS } from './productLinks';

describe('local Web product links', () => {
  it('keeps the independently deployed products identified locally', () => {
    expect(PRODUCT_IDS).toEqual({
      fstructure: 'fstructure',
      space3d: 'space3d',
    });
  });

  it('keeps the public Solver 2D URL unchanged', () => {
    expect(PRODUCT_LINKS.fstructure).toBe('https://klkmoraa.github.io/fstructure/');
  });

  it('keeps the public Solver 3D URL available to the portal', () => {
    expect(PRODUCT_LINKS.space3d).toBe('https://github.com/klkmoraa/fusionstructure-space3d');
  });
});
