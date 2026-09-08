import type { NextConfig } from 'next';

const isPagesBuild = process.env.BRANDBOOK_STATIC_EXPORT === '1';

const nextConfig: NextConfig = isPagesBuild
  ? {
      output: 'export',
      trailingSlash: true,
    }
  : {};

export default nextConfig;
