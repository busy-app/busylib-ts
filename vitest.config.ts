import { configDefaults, defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

// Separate from vite.config.ts: tests need path aliases only, not the dts, worker and font-map build plugins. Aliases come from tsconfig.test.json, because vite-tsconfig-paths applies a tsconfig only to files it includes and tsconfig.json does not include tests/.
export default defineConfig({
  plugins: [tsconfigPaths({ projects: ['tsconfig.test.json'] })],
  test: {
    projects: [
      { extends: true, test: { name: 'unit', include: ['tests/**/*.test.ts'], exclude: [...configDefaults.exclude, 'tests/package/**'] } },
      // Checks the built package from dist, so it runs after `build`.
      { extends: true, test: { name: 'package', include: ['tests/package/**/*.test.ts'] } }
    ]
  }
});
