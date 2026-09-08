import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const basePath =
  process.env.NEXT_PUBLIC_BRANDBOOK_BASE_PATH?.replace(/\/$/, '') ?? '';

export default defineConfig({
  root: fileURLToPath(new URL('./pages', import.meta.url)),
  publicDir: fileURLToPath(new URL('./public', import.meta.url)),
  base: basePath ? `${basePath}/` : '/',
  plugins: [react()],
  resolve: {
    alias: {
      'next/image': fileURLToPath(
        new URL('./pages/StaticImage.tsx', import.meta.url),
      ),
    },
  },
  define: {
    'process.env.NEXT_PUBLIC_BRANDBOOK_BASE_PATH': JSON.stringify(basePath),
  },
  build: {
    outDir: fileURLToPath(new URL('./dist-pages', import.meta.url)),
    emptyOutDir: true,
  },
});
