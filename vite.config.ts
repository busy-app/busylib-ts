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
      entry: {
        index: 'src/index.ts'
      },
      name: 'busylib',
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: ['openapi-fetch'],
      output: {
        globals: {}
      }
    },
    minify: true
  },
  worker: {
    format: 'es',
    plugins: () => [tsconfigPaths()]
  }
});
