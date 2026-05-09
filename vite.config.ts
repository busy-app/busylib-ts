import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    dts({
      entryRoot: 'src',
      outDir: 'dist',
      rollupTypes: true,
      copyDtsFiles: true
    })
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
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
