import { describe, expect, it } from 'vitest';
import { BRAND_CANON_LINK, BRANDBOOK_LINKS, PRODUCT_IDS, PRODUCT_LINKS } from './productLinks';

describe('enlaces de producto', () => {
  it('expone sólo los productos que existen hoy', () => {
    expect(PRODUCT_IDS).toEqual({ fstructure: 'fstructure', fmodel: 'fmodel' });
  });

  it('apunta a las apps publicadas', () => {
    expect(PRODUCT_LINKS.fstructure).toBe('https://klkmoraa.github.io/fstructure/');
    expect(PRODUCT_LINKS.fmodel).toBe('https://klkmoraa.github.io/FModel/');
  });

  it('enlaza cada brandbook de familia y el canon', () => {
    expect(BRANDBOOK_LINKS.fstructure).toMatch(/fstructure\/tree\/main\/docs\/brandbook$/);
    expect(BRANDBOOK_LINKS.fmodel).toMatch(/FModel\/tree\/main\/docs\/brandbook$/);
    expect(BRAND_CANON_LINK).toBe('https://klkmoraa.github.io/FusionStructureBrand/');
  });
});
