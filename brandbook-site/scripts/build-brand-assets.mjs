/**
 * Genera los activos de marca desde `scripts/glyph-library.mjs`.
 *
 *   node scripts/build-brand-assets.mjs
 *
 * Escribe:
 *   app/brand/generated/glyphs.tsx     glifos como JSX
 *   app/brand/generated/palette.ts     colores de familia
 *   public/brand/*.svg                 marca, lockup, favicon, app icon
 *   public/brand/tools/*.svg           un archivo por herramienta
 *   ../public/assets/brand/*.svg       los mismos activos para la aplicación
 *
 * Los archivos generados se versionan: el sitio no los construye en runtime.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  FAMILY_COLORS,
  GLYPHS,
  MARK,
  TOOL_BINDINGS,
} from './glyph-library.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const INK = '#14171A';
const PAPER = '#F7F6F1';
const CHALK = '#F2F4F3';
const SIGNAL = '#63C5FF';
const BANNER =
  '/* Generado por scripts/build-brand-assets.mjs. No editar a mano. */';

const write = async (relative, contents) => {
  const target = join(root, relative);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(
    target,
    contents.endsWith('\n') ? contents : `${contents}\n`,
    'utf8',
  );
  return relative;
};

const ATTRIBUTE_MAP = {
  'stroke-width': 'strokeWidth',
  'stroke-linecap': 'strokeLinecap',
  'stroke-linejoin': 'strokeLinejoin',
  'stroke-dasharray': 'strokeDasharray',
  'fill-rule': 'fillRule',
  'clip-rule': 'clipRule',
};

const toJsx = (markup) =>
  markup
    .replaceAll(
      /([a-z]+(?:-[a-z]+)+)=/g,
      (match, name) => `${ATTRIBUTE_MAP[name] ?? name}=`,
    )
    .replaceAll(/\s*\/>/g, ' />');

const glyphMarkup = (glyph, ink, accent) =>
  glyph.body.replaceAll('{{INK}}', ink).replaceAll('{{ACC}}', accent);

const svgDocument = (inner, { size = 64, viewBox = '0 0 48 48', label }) =>
  [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${viewBox}" role="img" aria-label="${label}">`,
    inner,
    '</svg>',
  ].join('\n');

const markGroup = (ink, arm = ink) =>
  [
    `  <path fill="${ink}" d="${MARK.base}" />`,
    `  <path fill="${arm}" d="${MARK.arm}" />`,
  ].join('\n');

const glyphGroup = (glyph, ink, accent, indent = '  ') =>
  [
    `${indent}<g fill="none" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">`,
    glyphMarkup(glyph, ink, accent)
      .split('\n')
      .map((line) => `${indent}  ${line.trim()}`)
      .join('\n'),
    `${indent}</g>`,
  ].join('\n');

const buildGlyphModule = () => {
  const entries = GLYPHS.map((glyph) => {
    const jsx = toJsx(
      glyphMarkup(glyph, 'currentColor', 'var(--glyph-accent, #14171A)'),
    )
      .split('\n')
      .map((line) => `    ${line.trim()}`)
      .join('\n');
    return `  '${glyph.id}': (\n    <>\n${jsx}\n    </>\n  ),`;
  }).join('\n');

  return `${BANNER}
import type { ReactNode } from 'react';

export type GlyphId =
${GLYPHS.map((glyph) => `  | '${glyph.id}'`).join('\n')};

export const GLYPH_MARK = {
  base: '${MARK.base}',
  arm: '${MARK.arm}',
  solid: '${MARK.solid}',
} as const;

export const GLYPHS: Record<GlyphId, ReactNode> = {
${entries}
};
`;
};

const buildPaletteModule = () => {
  const entries = Object.entries(FAMILY_COLORS)
    .map(
      ([id, value]) =>
        `  ${id}: { day: '${value.day}', night: '${value.night}', label: '${value.label}' },`,
    )
    .join('\n');
  const bindings = TOOL_BINDINGS.map(
    ([tool, glyph, family]) =>
      `  '${tool}': { glyph: '${glyph}', family: '${family}' },`,
  ).join('\n');

  return `${BANNER}
import type { GlyphId } from './glyphs';

export type FamilyId =
${Object.keys(FAMILY_COLORS)
  .map((id) => `  | '${id}'`)
  .join('\n')};

export const FAMILY_COLORS: Record<FamilyId, { day: string; night: string; label: string }> = {
${entries}
};

export const TOOL_BINDINGS: Record<string, { glyph: GlyphId; family: FamilyId }> = {
${bindings}
};
`;
};

const run = async () => {
  const written = [];

  written.push(
    await write('app/brand/generated/glyphs.tsx', buildGlyphModule()),
  );
  written.push(
    await write('app/brand/generated/palette.ts', buildPaletteModule()),
  );

  written.push(
    await write(
      'public/brand/fusionstructure-mark.svg',
      svgDocument(markGroup(INK, SIGNAL), { label: 'FusionStructure' }),
    ),
  );
  written.push(
    await write(
      'public/brand/fusionstructure-mark-mono.svg',
      svgDocument(markGroup(INK), { label: 'FusionStructure monocromo' }),
    ),
  );
  written.push(
    await write(
      'public/brand/fusionstructure-mark-inverse.svg',
      svgDocument(markGroup(CHALK, SIGNAL), {
        label: 'FusionStructure inverso',
      }),
    ),
  );
  written.push(
    await write(
      'public/brand/fusionstructure-app-icon.svg',
      svgDocument(
        [
          `  <rect width="48" height="48" rx="11" fill="${INK}" />`,
          `  <g transform="translate(4.5 3) scale(0.8125)">`,
          markGroup(CHALK, SIGNAL),
          '  </g>',
        ].join('\n'),
        { label: 'Icono de aplicación de FusionStructure' },
      ),
    ),
  );
  written.push(
    await write(
      'public/favicon.svg',
      svgDocument(
        [
          `  <rect width="48" height="48" rx="10" fill="${INK}" />`,
          `  <g transform="translate(5 4) scale(0.79)">`,
          markGroup(CHALK, SIGNAL),
          '  </g>',
        ].join('\n'),
        { label: 'FusionStructure' },
      ),
    ),
  );

  // Marca de módulo de FStructure (el solver 2D): el glifo del módulo dentro
  // del contenedor de familia. Un módulo no repite la marca madre.
  const solverGlyph = [
    '  <g fill="none" stroke-linecap="round" stroke-linejoin="round">',
    `    <path d="M13 19h22" stroke="{{INK}}" stroke-width="2" opacity="0.34" />`,
    `    <path d="M13 19c6.5 0 8 13 11 13s4.5-13 11-13" stroke="{{INK}}" stroke-width="2.6" />`,
    '  </g>',
    `  <circle cx="13" cy="19" r="2.1" fill="{{INK}}" />`,
    `  <circle cx="35" cy="19" r="2.1" fill="{{INK}}" />`,
  ].join('\n');
  const solverMark = (ink) =>
    [
      `  <rect x="2" y="2" width="44" height="44" rx="11" fill="none" stroke="${FAMILY_COLORS.analisis.day}" stroke-width="2" stroke-opacity="0.55" />`,
      solverGlyph.replaceAll('{{INK}}', ink),
    ].join('\n');

  written.push(
    await write(
      '../public/assets/brand/solver-2d-mark.svg',
      svgDocument(solverMark(INK), { label: 'FStructure' }),
    ),
  );
  written.push(
    await write(
      '../public/assets/brand/solver-2d-mark-inverse.svg',
      svgDocument(solverMark(CHALK), { label: 'FStructure inverso' }),
    ),
  );
  written.push(
    await write(
      '../public/assets/brand/solver-2d-lockup.svg',
      [
        '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="56" viewBox="0 0 300 56" role="img" aria-label="FStructure">',
        '  <g transform="translate(0 4)">',
        markGroup(INK, SIGNAL),
        '  </g>',
        `  <text x="60" y="35" font-family="'Space Grotesk','Inter',system-ui,sans-serif" font-size="26" font-weight="600" letter-spacing="-0.4" fill="${INK}">FStructure</text>`,
        `  <text x="61" y="49" font-family="'IBM Plex Mono',ui-monospace,monospace" font-size="9.5" letter-spacing="1.6" fill="#5C6A6F">SOLVER 2D · FUSIONSTRUCTURE</text>`,
        '</svg>',
      ].join('\n'),
    ),
  );

  const lockup = [
    `  <g transform="translate(0 4)">`,
    markGroup(INK, SIGNAL),
    '  </g>',
    `  <text x="60" y="35" font-family="'Space Grotesk','Inter',system-ui,sans-serif" font-size="26" font-weight="600" letter-spacing="-0.4" fill="${INK}">FusionStructure</text>`,
    `  <text x="61" y="49" font-family="'IBM Plex Mono',ui-monospace,monospace" font-size="9.5" letter-spacing="1.6" fill="#5C6A6F">MAKE COMPLEXITY LEGIBLE</text>`,
  ].join('\n');
  written.push(
    await write(
      'public/brand/fusionstructure-lockup.svg',
      [
        '<svg xmlns="http://www.w3.org/2000/svg" width="330" height="56" viewBox="0 0 330 56" role="img" aria-label="FusionStructure">',
        lockup,
        '</svg>',
      ].join('\n'),
    ),
  );

  const glyphById = new Map(GLYPHS.map((glyph) => [glyph.id, glyph]));

  // La aplicación usa la marca y seis glifos de familia con nombres estables.
  const APP_FAMILY_MARKS = [
    ['analysis', 'solver2d', 'analisis'],
    ['model', 'bim', 'modelo'],
    ['civil', 'terrain', 'civil'],
    ['project', 'project', 'proyecto'],
    ['connections', 'connectors', 'interop'],
    ['learning', 'classroom', 'aprendizaje'],
  ];

  written.push(
    await write(
      '../public/assets/brand/fusionstructure-mark.svg',
      svgDocument(markGroup(INK, SIGNAL), { label: 'FusionStructure' }),
    ),
  );
  written.push(
    await write(
      '../public/assets/brand/fusionstructure-mark-inverse.svg',
      svgDocument(markGroup(CHALK, SIGNAL), {
        label: 'FusionStructure inverso',
      }),
    ),
  );
  written.push(
    await write(
      '../public/favicon.svg',
      svgDocument(
        [
          `  <rect width="48" height="48" rx="10" fill="${INK}" />`,
          `  <g transform="translate(5 4) scale(0.79)">`,
          markGroup(CHALK, SIGNAL),
          '  </g>',
        ].join('\n'),
        { label: 'FusionStructure' },
      ),
    ),
  );

  for (const [name, glyphId, family] of APP_FAMILY_MARKS) {
    const glyph = glyphById.get(glyphId);
    if (!glyph) throw new Error(`Glifo desconocido para ${name}: ${glyphId}`);
    const color = FAMILY_COLORS[family];
    // Dos variantes por familia: la aplicación las intercambia por tema, igual
    // que hace con la marca. El archivo es transparente, así que la tinta debe
    // cambiar con el papel que queda debajo.
    const variants = [
      { suffix: '', stroke: color.day, ink: INK },
      { suffix: '-inverse', stroke: color.night, ink: CHALK },
    ];
    for (const variant of variants) {
      const inner = [
        `  <rect x="1" y="1" width="62" height="62" rx="15" fill="none" stroke="${variant.stroke}" stroke-opacity="0.4" />`,
        '  <g transform="translate(8 8)">',
        glyphGroup(glyph, variant.stroke, variant.ink, '  '),
        '  </g>',
      ].join('\n');
      written.push(
        await write(
          `../public/assets/brand/tools/${name}${variant.suffix}.svg`,
          svgDocument(inner, {
            viewBox: '0 0 64 64',
            label: `FusionStructure ${name}`,
          }),
        ),
      );
    }
  }
  for (const [tool, glyphId, family] of TOOL_BINDINGS) {
    const glyph = glyphById.get(glyphId);
    if (!glyph) throw new Error(`Glifo desconocido para ${tool}: ${glyphId}`);
    const color = FAMILY_COLORS[family];
    if (!color) throw new Error(`Familia desconocida para ${tool}: ${family}`);
    const inner = [
      `  <rect x="1" y="1" width="62" height="62" rx="15" fill="${PAPER}" stroke="${color.day}" stroke-opacity="0.35" />`,
      '  <g transform="translate(8 8)">',
      glyphGroup(glyph, color.day, INK, '  '),
      '  </g>',
    ].join('\n');
    written.push(
      await write(
        `public/brand/tools/${tool}.svg`,
        svgDocument(inner, {
          viewBox: '0 0 64 64',
          label: `FusionStructure ${tool}`,
        }),
      ),
    );
  }

  console.log(`${written.length} archivos escritos`);
};

await run();
