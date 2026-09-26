import { describe, expect, it } from 'vitest';
import { PRODUCT_IDS, PRODUCT_LINKS } from './productLinks';

describe('enlaces de producto', () => {
  it('expone sólo los productos que existen hoy', () => {
    expect(PRODUCT_IDS).toEqual({ fstructure: 'fstructure', fmodel: 'fmodel' });
  });

  it('apunta a las apps publicadas', () => {
    expect(PRODUCT_LINKS.fstructure).toBe('https://klkmoraa.github.io/fstructure/');
    expect(PRODUCT_LINKS.fmodel).toBe('https://klkmoraa.github.io/FModel/');
  });
});
