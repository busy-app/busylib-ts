import { defineConfig } from 'vite';
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

      // `#font-maps` is external, so the bundler never emits the stub.
      fs.copyFileSync(path.resolve(__dirname, 'src/Utils/font/font-maps-stub.js'), path.resolve(__dirname, 'dist/Utils/font/font-maps-stub.js'));
    }
  };
}

export default defineConfig({
  resolve: {
    tsconfigPaths: true
  },
  plugins: [
    inlineWorkerUrl({
      entry: path.resolve(__dirname, 'src/StateStream/worker/index.worker.ts')
    }),
    dts({
      tsconfigPath: './tsconfig.build.json',
      entryRoot: 'src',
      outDirs: 'dist',
      bundleTypes: true,
      copyDtsFiles: true
    }),
    copyFontMaps()
  ],
  build: {
    lib: {
      // Formats come from `output` below.
      entry: ['src/index.ts', 'src/Utils/font/fonts.ts']
    },
    rolldownOptions: {
      external: ['#font-maps'],
      output: [
        {
          format: 'es',
          preserveModules: true,
          preserveModulesRoot: 'src',
          entryFileNames: '[name].js'
        },
        {
          format: 'cjs',
          preserveModules: true,
          preserveModulesRoot: 'src',
          entryFileNames: '[name].cjs'
        }
      ],
      treeshake: {
        moduleSideEffects: false
      }
    },
    minify: false
  },
  worker: {
    format: 'es'
  }
});
