/**
 * Prefijo opcional para hosts por subruta (por ejemplo GitHub Pages).
 * En el sitio normal queda vacío y conserva /brand, /mockups y /motion.
 */
export const PUBLIC_BASE_PATH =
  process.env.NEXT_PUBLIC_BRANDBOOK_BASE_PATH?.replace(/\/$/, '') ?? '';

export const publicAsset = (path: string) => {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${PUBLIC_BASE_PATH}${normalized}`;
};
