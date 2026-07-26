import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '~': resolve(__dirname, './playground'),
    },
  },
  test: {
    includeSource: ['src/**/*.{js,ts}'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{js,ts}'],
    },
  },
});
