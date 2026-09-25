/** Identifiers for the independently deployed products exposed by this portal. */
export const PRODUCT_IDS = {
  fstructure: 'fstructure',
  fmodel: 'fmodel',
} as const;

export type ProductId = (typeof PRODUCT_IDS)[keyof typeof PRODUCT_IDS];

/** Public entry points only; the landing never imports product implementations. */
export const PRODUCT_LINKS = {
  [PRODUCT_IDS.fstructure]: 'https://klkmoraa.github.io/fstructure/',
  [PRODUCT_IDS.fmodel]: 'https://klkmoraa.github.io/FModel/',
} as const satisfies Readonly<Record<ProductId, string>>;

/** Each product's family brandbook lives in its own repo. */
export const BRANDBOOK_LINKS = {
  [PRODUCT_IDS.fstructure]: 'https://github.com/klkmoraa/fstructure/tree/main/docs/brandbook',
  [PRODUCT_IDS.fmodel]: 'https://github.com/klkmoraa/FModel/tree/main/docs/brandbook',
} as const satisfies Readonly<Record<ProductId, string>>;

/** The brand canon: design system, tokens and SVG. */
export const BRAND_CANON_LINK = 'https://klkmoraa.github.io/FusionStructureBrand/';
