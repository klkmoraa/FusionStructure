import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

/**
 * tokens.css es una copia exacta de FusionStructureBrand/tokens/tokens.css.
 * Si el canon cambia: copia el archivo nuevo y actualiza este hash. Nunca se edita aquí.
 */
const CANON_SHA256 = '4119761733590e4f1c47fed801a3b007b6eb5fd5a79c2974e5ed954574a23675';

describe('tokens del canon', () => {
  const css = readFileSync(new URL('./tokens.css', import.meta.url), 'utf8');

  it('son idénticos a FusionStructureBrand', () => {
    expect(createHash('sha256').update(css).digest('hex')).toBe(CANON_SHA256);
  });

  it('traen el núcleo verde, las familias y Noche', () => {
    expect(css).toContain('--fs-brand-accent: #1AA57A;');
    expect(css).toContain('--fs-family-analisis: #ED4B46;');
    expect(css).toContain('--fs-family-modelo: #7657D5;');
    expect(css).toContain(':root[data-theme="noche"]');
  });
});
