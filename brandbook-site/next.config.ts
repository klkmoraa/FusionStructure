import type { NextConfig } from 'next';

const isPagesBuild = process.env.BRANDBOOK_STATIC_EXPORT === '1';
const pagesBasePath = process.env.NEXT_PUBLIC_BRANDBOOK_BASE_PATH?.replace(/\/$/, '') ?? '';

const nextConfig: NextConfig = isPagesBuild
  ? {
      output: 'export',
      trailingSlash: true,
      basePath: pagesBasePath || undefined,
    }
  : {};

export default nextConfig;
