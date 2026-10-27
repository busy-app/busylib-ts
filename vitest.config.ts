import { configDefaults, defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

// Separate from vite.config.ts: tests need path aliases only, not the dts, worker and font-map build plugins.
export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    projects: [
      { extends: true, test: { name: 'unit', include: ['tests/**/*.test.ts'], exclude: [...configDefaults.exclude, 'tests/package/**'] } },
      // Checks the built package from dist, so it runs after `build`.
      { extends: true, test: { name: 'package', include: ['tests/package/**/*.test.ts'] } }
    ]
  }
});
