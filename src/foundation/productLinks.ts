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
