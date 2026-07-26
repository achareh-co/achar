import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { defineConfig } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: resolve(__dirname, './'),
  resolve: {
    alias: {
      '@': resolve(__dirname, '../src'),
      '~': resolve(__dirname, './'),
    },
  },
  plugins: [],
});
