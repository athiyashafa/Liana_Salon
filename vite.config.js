import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));

// Hasil build dibuat menjadi satu berkas (dist/index.html) oleh scripts/satu-berkas.mjs,
// supaya bisa dibuka langsung dengan klik dua kali, tanpa server.
export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(root, 'src') },
  },
  build: {
    assetsInlineLimit: 100000000,
    cssCodeSplit: false,
    modulePreload: false,
    rollupOptions: {
      output: { inlineDynamicImports: true },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
