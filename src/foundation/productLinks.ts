/** Identifiers for the independently deployed products exposed by this portal. */
export const PRODUCT_IDS = {
  fstructure: 'fstructure',
  space3d: 'space3d',
} as const;

export type ProductId = (typeof PRODUCT_IDS)[keyof typeof PRODUCT_IDS];

/** Public entry points only; Web never imports product implementations. */
export const PRODUCT_LINKS = {
  [PRODUCT_IDS.fstructure]: 'https://klkmoraa.github.io/fstructure/',
  [PRODUCT_IDS.space3d]: 'https://github.com/klkmoraa/fusionstructure-space3d',
} as const satisfies Readonly<Record<ProductId, string>>;
