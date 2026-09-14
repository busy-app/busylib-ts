import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import dts from 'vite-plugin-dts';
import fs from 'node:fs';
import path from 'node:path';
import { inlineWorkerUrl } from './vite-plugins/inlineWorkerUrl';

// Vite inlines JSON into modules, but @busy-app/cli reads the maps off disk.
function copyFontMaps() {
  return {
    name: 'copy-font-maps',
    closeBundle() {
      const from = path.resolve(__dirname, 'src/Utils/font/maps');
      const to = path.resolve(__dirname, 'dist/Utils/font/maps');
      fs.mkdirSync(to, { recursive: true });
      for (const file of fs.readdirSync(from)) {
        fs.copyFileSync(path.resolve(from, file), path.resolve(to, file));
      }
    }
  };
}

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    inlineWorkerUrl({
      entry: path.resolve(__dirname, 'src/StateStream/worker/index.worker.ts')
    }),
    dts({
      entryRoot: 'src',
      outDir: 'dist',
      rollupTypes: true,
      copyDtsFiles: true
    }),
    copyFontMaps()
  ],
  resolve: {
    alias: {
      // Duplicates the package's `imports` map: bundlers read `#` as a URL fragment and ignore it.
      '#font-maps': path.resolve(__dirname, 'src/Utils/font/font-maps-stub.js')
    }
  },
  build: {
    lib: {
      entry: ['src/index.ts', 'src/Utils/font/fonts.ts'],
      name: 'busylib',
      formats: ['es']
    },
    rollupOptions: {
      external: ['openapi-fetch'],
      output: [
        {
          format: 'es',
          preserveModules: true,
          preserveModulesRoot: 'src',
          entryFileNames: '[name].js',
          globals: {}
        },
        {
          format: 'cjs',
          preserveModules: true,
          preserveModulesRoot: 'src',
          entryFileNames: '[name].cjs',
          globals: {}
        }
      ],
      treeshake: {
        moduleSideEffects: false
      }
    },
    minify: false
  },
  worker: {
    format: 'es',
    plugins: () => [tsconfigPaths()]
  }
});
