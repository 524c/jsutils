import { defineConfig } from 'tsup';
import glob from 'tiny-glob';

export default defineConfig([
  {
    entry: await glob('./src/**/!(*.d|*.spec|*.test|test).ts'),
    target: 'ES2022',
    format: ['esm'],
    splitting: true,
    sourcemap: false,
    declaration: true,
    outDir: 'lib',
    dts: true,
    clean: true,

    esbuildOptions(options) {
      options.external = ['consola', 'os'];
    }
  }
]);
