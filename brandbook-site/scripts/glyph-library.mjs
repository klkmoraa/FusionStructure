/**
 * Biblioteca de glifos de FusionStructure.
 *
 * Cada glifo se dibuja en una caja de 48x48 con el mismo lenguaje:
 * miembros con peralte variable, nudos marcados y trazo de 2.6.
 * `INK` es el color de familia y `ACC` el grafito de apoyo; el
 * generador (`scripts/build-brand-assets.mjs`) sustituye ambos.
 */

/**
 * Colores de familia. Son una escala emparentada con las señales de
 * resultado, pero más profunda: la señal pertenece al dato, la familia
 * pertenece a la herramienta. `day` funciona sobre papel; `night` sobre
 * carbón.
 */
export const FAMILY_COLORS = {
  nucleo: { day: '#3F4A50', night: '#AEB9BE', label: 'Núcleo' },
  analisis: { day: '#1B75B0', night: '#63C5FF', label: 'Análisis' },
  modelo: { day: '#B8412F', night: '#FF8E80', label: 'Modelo' },
  civil: { day: '#277654', night: '#55C990', label: 'Civil' },
  proyecto: { day: '#8A6110', night: '#F3C553', label: 'Proyecto' },
  interop: { day: '#6A57C8', night: '#9B87FF', label: 'Interoperabilidad' },
  aprendizaje: { day: '#B44A7E', night: '#EF7AB9', label: 'Aprendizaje' },
};

/**
 * Enlace herramienta -> glifo -> familia, usado para escribir los SVG de
 * `public/brand/tools/`. El catálogo con prosa, estado y referentes vive en
 * `app/brand/catalog.ts` y usa los mismos identificadores.
 */
export const TOOL_BINDINGS = [
  ['proyecto', 'project', 'nucleo'],
  ['calidad', 'quality', 'nucleo'],
  ['memoria', 'memo', 'nucleo'],
  ['intercambio', 'exchange', 'nucleo'],
  ['biblioteca', 'library', 'nucleo'],
  ['offline', 'offline', 'nucleo'],
  ['asistencia', 'assist', 'nucleo'],
  ['fs-a01', 'solver2d', 'analisis'],
  ['fs-a02', 'solver3d', 'analisis'],
  ['fs-a03', 'fem', 'analisis'],
  ['fs-a04', 'materials', 'analisis'],
  ['fs-m01', 'cad', 'modelo'],
  ['fs-m02', 'bim', 'modelo'],
  ['fs-m03', 'detail', 'modelo'],
  ['fs-c01', 'terrain', 'civil'],
  ['fs-c02', 'geotech', 'civil'],
  ['fs-c03', 'water', 'civil'],
  ['fs-p01', 'docs', 'proyecto'],
  ['fs-p02', 'cost', 'proyecto'],
  ['fs-p03', 'schedule', 'proyecto'],
  ['fs-i01', 'connectors', 'interop'],
  ['fs-l01', 'classroom', 'aprendizaje'],
  ['fs-l02', 'research', 'aprendizaje'],
  ['fs-l03', 'lab', 'aprendizaje'],
  ['fs-l04', 'mentoring', 'aprendizaje'],
];

export const MARK = {
  // Ménsula: un pórtico en voladizo con peralte decreciente que forma una F.
  solid: 'M8 5h9v38H8z M17 5h24v5.5L17 14z M17 21h17v5L17 30z',
  // Miembro acentuado (brazo inferior) para la versión con señal.
  arm: 'M17 21h17v5L17 30z',
  base: 'M8 5h9v38H8z M17 5h24v5.5L17 14z',
};

const g = (strings, ...values) =>
  String.raw({ raw: strings }, ...values).trim();

/** @type {ReadonlyArray<{ id: string; body: string }>} */
export const GLYPHS = [
  {
    id: 'project',
    body: g`
      <path d="M24 13v8M24 27v8M13 24h8M27 24h8" stroke="{{INK}}" />
      <rect x="19" y="19" width="10" height="10" rx="2" fill="{{ACC}}" stroke="none" />
      <path d="M20 6h8v7h-8zM20 35h8v7h-8zM6 20h7v8H6zM35 20h7v8h-7z" stroke="{{INK}}" />
    `,
  },
  {
    id: 'quality',
    body: g`
      <path d="M8 18h32M8 30h32" stroke="{{INK}}" stroke-dasharray="3 3.5" opacity=".55" />
      <path d="M8 26c6 0 8-12 14-12s6 10 10 10 4-6 8-6" stroke="{{INK}}" />
      <path d="m17 38 5 5 10-11" stroke="{{ACC}}" />
    `,
  },
  {
    id: 'memo',
    body: g`
      <path d="M11 5h17l8 8v20H11z" stroke="{{INK}}" />
      <path d="M28 5v8h8" stroke="{{INK}}" />
      <path d="M17 19h13M17 25h9" stroke="{{INK}}" opacity=".6" />
      <circle cx="31" cy="35" r="6" stroke="{{ACC}}" />
      <path d="M28 40.5 27 46l4-2 4 2-1-5.5" stroke="{{ACC}}" stroke-linejoin="round" />
    `,
  },
  {
    id: 'exchange',
    body: g`
      <path d="M8 9h16l6 6v9" stroke="{{INK}}" />
      <path d="M24 15h6" stroke="{{INK}}" opacity=".6" />
      <path d="M40 39H24l-6-6v-9" stroke="{{INK}}" />
      <path d="M24 33h-6" stroke="{{INK}}" opacity=".6" />
      <path d="M31 24H17" stroke="{{ACC}}" />
      <path d="m35 20 5 4-5 4M13 20l-5 4 5 4" stroke="{{ACC}}" />
    `,
  },
  {
    id: 'library',
    body: g`
      <path d="M9 10h12M15 10v12M9 22h12" stroke="{{INK}}" />
      <path d="M27 10h12v12H27z" stroke="{{INK}}" />
      <path d="M9 28h6v14M9 42h12" stroke="{{ACC}}" />
      <path d="M27 30h12M33 30v12M27 42h12" stroke="{{INK}}" />
    `,
  },
  {
    id: 'offline',
    body: g`
      <rect x="6" y="12" width="36" height="22" rx="3" stroke="{{INK}}" />
      <path d="M16 40h16M24 34v6" stroke="{{INK}}" />
      <path d="M17 23h5l3-5 4 9 2-4h4" stroke="{{ACC}}" />
      <path d="M38 6 8 40" stroke="{{ACC}}" opacity=".35" />
    `,
  },
  {
    id: 'assist',
    body: g`
      <rect x="7" y="11" width="34" height="26" rx="3" stroke="{{INK}}" />
      <path d="m14 20 5 4-5 4" stroke="{{ACC}}" />
      <path d="M24 28h10" stroke="{{ACC}}" />
      <path d="M31 8v6M28 11h6" stroke="{{INK}}" />
    `,
  },
  {
    id: 'solver2d',
    body: g`
      <path d="M9 14h30M9 14v22M39 14v22" stroke="{{INK}}" />
      <path d="M5 40h8l-4-4zM35 40h8l-4-4z" fill="{{INK}}" stroke="none" />
      <path d="M15 5v5M24 5v5M33 5v5" stroke="{{ACC}}" />
      <path d="m13 10 2 3 2-3M22 10l2 3 2-3M31 10l2 3 2-3" fill="{{ACC}}" stroke="none" />
      <path d="M11 21c8 0 6 9 13 9s5-9 13-9" stroke="{{ACC}}" />
      <circle cx="9" cy="14" r="2.6" fill="{{INK}}" stroke="none" />
      <circle cx="39" cy="14" r="2.6" fill="{{INK}}" stroke="none" />
    `,
  },
  {
    id: 'solver3d',
    body: g`
      <path d="M24 8 40 16v16l-16 8-16-8V16z" stroke="{{INK}}" />
      <path d="M24 8v16m0 0 16-8m-16 8-16-8m16 8v16" stroke="{{INK}}" opacity=".55" />
      <circle cx="24" cy="24" r="3.4" fill="{{ACC}}" stroke="none" />
      <path d="M24 24 36 18M24 24l-9 9M24 24v-9" stroke="{{ACC}}" />
    `,
  },
  {
    id: 'fem',
    body: g`
      <path d="M8 10h32v28H8z" stroke="{{INK}}" />
      <path d="M18 10v28M29 10v28M8 20h32M8 29h32" stroke="{{INK}}" opacity=".5" />
      <path d="M18 20h11v9H18z" fill="{{ACC}}" stroke="none" opacity=".9" />
      <circle cx="18" cy="20" r="2.2" fill="{{INK}}" stroke="none" />
      <circle cx="29" cy="29" r="2.2" fill="{{INK}}" stroke="none" />
    `,
  },
  {
    id: 'materials',
    body: g`
      <path d="M7 9h13M13.5 9v17M7 26h13" stroke="{{INK}}" />
      <path d="M7 33h13M7 40h13" stroke="{{INK}}" opacity=".45" />
      <path d="M27 42V22" stroke="{{INK}}" stroke-width="7" stroke-linecap="butt" />
      <path d="M38 42V14" stroke="{{ACC}}" stroke-width="7" stroke-linecap="butt" opacity=".85" />
      <path d="M23 14h20" stroke="{{ACC}}" stroke-dasharray="3 3" />
    `,
  },
  {
    id: 'cad',
    body: g`
      <path d="M9 32 20 17l8 6 11-13" stroke="{{INK}}" />
      <path d="M9 41h30M11 38v6M37 38v6" stroke="{{ACC}}" opacity=".8" />
      <path d="m15 41 4-2v4zM33 41l-4-2v4z" fill="{{ACC}}" stroke="none" />
      <path d="M20 10v14M13 17h14" stroke="{{INK}}" opacity=".45" />
      <circle cx="20" cy="17" r="3.4" stroke="{{INK}}" />
    `,
  },
  {
    id: 'bim',
    body: g`
      <path d="M8 12h32M8 24h32M8 36h32" stroke="{{INK}}" />
      <path d="M16 12v24M32 12v24" stroke="{{INK}}" opacity=".45" />
      <path d="M16 24h16v12H16z" fill="{{ACC}}" stroke="none" opacity=".9" />
      <path d="M6 12v24M42 12v24" stroke="{{ACC}}" />
      <circle cx="32" cy="12" r="2.6" fill="{{ACC}}" stroke="none" />
    `,
  },
  {
    id: 'detail',
    body: g`
      <path d="M18 8h13v32H18z" stroke="{{INK}}" />
      <path d="M31 17h11M31 31h11" stroke="{{INK}}" opacity=".8" />
      <path d="M6 17h12M6 31h12M12 17v14" stroke="{{ACC}}" opacity=".55" />
      <circle cx="22.5" cy="15" r="2" fill="{{ACC}}" stroke="none" />
      <circle cx="26.5" cy="15" r="2" fill="{{ACC}}" stroke="none" />
      <circle cx="22.5" cy="24" r="2" fill="{{ACC}}" stroke="none" />
      <circle cx="26.5" cy="24" r="2" fill="{{ACC}}" stroke="none" />
      <circle cx="22.5" cy="33" r="2" fill="{{ACC}}" stroke="none" />
      <circle cx="26.5" cy="33" r="2" fill="{{ACC}}" stroke="none" />
    `,
  },
  {
    id: 'terrain',
    body: g`
      <path d="M6 32c8-9 12 3 20-4s10-9 16-13" stroke="{{INK}}" opacity=".55" />
      <path d="M6 39c8-9 12 3 20-4s10-9 16-13" stroke="{{INK}}" />
      <path d="M8 12h32" stroke="{{ACC}}" />
      <path d="M14 9v6M24 9v6M34 9v6" stroke="{{ACC}}" />
      <circle cx="24" cy="12" r="3" fill="{{ACC}}" stroke="none" />
    `,
  },
  {
    id: 'geotech',
    body: g`
      <path d="M6 15h36M6 25h36M6 35h36M6 15v27h36V15" stroke="{{INK}}" opacity=".5" />
      <path d="M6 15h36" stroke="{{INK}}" />
      <path d="M10 20h6M28 20h6M10 30h5M30 30h6M10 39h8" stroke="{{INK}}" opacity=".4" />
      <path d="M21 10h6v28h-6z" fill="{{ACC}}" stroke="none" />
      <path d="M17 10h14" stroke="{{ACC}}" stroke-width="3" />
      <path d="m36 21-3-4h6z" fill="{{ACC}}" stroke="none" />
    `,
  },
  {
    id: 'water',
    body: g`
      <path d="M8 10v11a5 5 0 0 0 5 5h13a5 5 0 0 1 5 5v9" stroke="{{INK}}" />
      <path d="M31 26h9" stroke="{{INK}}" />
      <circle cx="8" cy="10" r="3.4" fill="{{ACC}}" stroke="none" />
      <circle cx="31" cy="40" r="3.4" fill="{{ACC}}" stroke="none" />
      <circle cx="26" cy="26" r="3" stroke="{{ACC}}" />
      <path d="M6 38c4-3 6 3 10 0s6 3 10 0" stroke="{{ACC}}" opacity=".7" />
      <path d="m13 15 4 4-4 4" stroke="{{ACC}}" />
    `,
  },
  {
    id: 'docs',
    body: g`
      <path d="M16 6h14l7 7v21H16z" stroke="{{INK}}" />
      <path d="M30 6v7h7" stroke="{{INK}}" />
      <path d="M11 12v30h20" stroke="{{INK}}" opacity=".45" />
      <path d="M21 20h9M21 26h6" stroke="{{INK}}" opacity=".6" />
      <path d="M27 34a5 5 0 0 1 10 0c0 4-5 9-5 9s-5-5-5-9z" fill="{{ACC}}" stroke="none" />
    `,
  },
  {
    id: 'cost',
    body: g`
      <path d="M7 11h34v26H7z" stroke="{{INK}}" />
      <path d="M7 19h34M20 11v26" stroke="{{INK}}" opacity=".5" />
      <path d="M24 24h13M24 31h9" stroke="{{ACC}}" stroke-width="4" stroke-linecap="butt" />
      <path d="M11 24h5M11 31h5" stroke="{{INK}}" opacity=".6" />
      <path d="M14 41h20" stroke="{{ACC}}" />
    `,
  },
  {
    id: 'schedule',
    body: g`
      <path d="M8 12h16M14 21h18M8 30h12" stroke="{{INK}}" stroke-width="5" stroke-linecap="butt" />
      <path d="m34 26 5 5-5 5-5-5z" fill="{{ACC}}" stroke="none" />
      <path d="M24 12v9M32 21v5" stroke="{{ACC}}" />
      <path d="M6 40h36" stroke="{{INK}}" opacity=".6" />
    `,
  },
  {
    id: 'connectors',
    body: g`
      <path d="M6 15h13v18H6z" stroke="{{INK}}" />
      <path d="M29 15h13v18H29z" stroke="{{INK}}" />
      <path d="M19 21h10M29 27H19" stroke="{{ACC}}" />
      <path d="m26 18 3 3-3 3M22 24l-3 3 3 3" stroke="{{ACC}}" />
      <path d="M24 33v4" stroke="{{INK}}" opacity=".6" />
      <circle cx="24" cy="40" r="4" stroke="{{INK}}" />
      <path d="m22 40 1.5 1.5L27 38" stroke="{{ACC}}" />
    `,
  },
  {
    id: 'classroom',
    body: g`
      <path d="M9 15h30" stroke="{{INK}}" />
      <path d="M9 15c8 0 7 13 15 13s7-13 15-13" stroke="{{INK}}" opacity=".45" stroke-dasharray="3.5 3.5" />
      <path d="M9 15c8 0 7 21 15 21s7-21 15-21" stroke="{{ACC}}" />
      <path d="m6 20 3-5 3 5zM36 20l3-5 3 5z" fill="{{INK}}" stroke="none" />
      <path d="M24 6v5" stroke="{{INK}}" />
      <path d="m21 9 3 4 3-4z" fill="{{INK}}" stroke="none" />
    `,
  },
  {
    id: 'research',
    body: g`
      <circle cx="24" cy="12" r="4.5" stroke="{{INK}}" />
      <circle cx="11" cy="35" r="4.5" stroke="{{INK}}" />
      <circle cx="37" cy="35" r="4.5" stroke="{{INK}}" />
      <path d="m21 16-7 15M27 16l7 15M15.5 35h17" stroke="{{ACC}}" />
      <path d="M22 27h4" stroke="{{INK}}" />
    `,
  },
  {
    id: 'lab',
    body: g`
      <path d="M24 9a15 15 0 1 1-13 7.5" stroke="{{INK}}" />
      <path d="M6 9v9h9" stroke="{{INK}}" />
      <path d="M18 26v6M24 21v11M30 26v6M36 29v3" stroke="{{ACC}}" />
      <circle cx="24" cy="24" r="2.4" fill="{{ACC}}" stroke="none" />
    `,
  },
  {
    id: 'mentoring',
    body: g`
      <path d="M8 38c6 0 6-12 14-12s8 8 14 8" stroke="{{INK}}" />
      <circle cx="8" cy="38" r="3" fill="{{INK}}" stroke="none" />
      <circle cx="22" cy="26" r="3" fill="{{INK}}" stroke="none" />
      <path d="M36 8v26" stroke="{{ACC}}" />
      <path d="M36 9h9l-3 4 3 4h-9z" fill="{{ACC}}" stroke="none" />
    `,
  },
];
