import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { defineBuildConfig } from 'unbuild';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineBuildConfig({
  declaration: true,
  entries: ['src/index'],
  alias: {
    '@': resolve(__dirname, './src'),
    '~': resolve(__dirname, './playground'),
  },
  rollup: {
    emitCJS: true,
    inlineDependencies: true,
    esbuild: { target: 'es2016' },
  },
  replace: {
    'import.meta.vitest': 'undefined',
  },
});
