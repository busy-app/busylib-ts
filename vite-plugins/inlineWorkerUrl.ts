import { build, type Plugin } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'node:path';

const VIRTUAL_ID = 'busy:worker-url';
const RESOLVED_VIRTUAL_ID = '\0' + VIRTUAL_ID;

interface InlineWorkerUrlOptions {
  /** Absolute path to the worker entry .ts file. */
  entry: string;
}

/**
 * Builds the worker as a standalone ESM bundle once and exposes it
 * via the virtual module `busy:worker-url` as a base64 data URL.
 * The same data URL is reused for both `new Worker(...)` and
 * `new SharedWorker(...)`, so the worker code ships only once.
 */
export function inlineWorkerUrl(options: InlineWorkerUrlOptions): Plugin {
  let cached: string | null = null;

  return {
    name: 'busy-inline-worker-url',
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_VIRTUAL_ID;
      return null;
    },
    async load(id) {
      if (id !== RESOLVED_VIRTUAL_ID) return null;

      if (!cached) {
        const result = await build({
          configFile: false,
          logLevel: 'warn',
          plugins: [tsconfigPaths()],
          build: {
            write: false,
            minify: true,
            lib: {
              entry: path.resolve(options.entry),
              formats: ['es'],
              fileName: () => 'worker.js'
            },
            rollupOptions: {
              output: {
                inlineDynamicImports: true
              }
            }
          }
        });

        const output = Array.isArray(result) ? result[0] : result;
        if (!output || !('output' in output)) {
          throw new Error('inlineWorkerUrl: empty build output');
        }
        const chunk = output.output.find((c) => c.type === 'chunk');
        if (!chunk || chunk.type !== 'chunk') {
          throw new Error('inlineWorkerUrl: no chunk produced');
        }

        const base64 = Buffer.from(chunk.code, 'utf8').toString('base64');
        cached = `data:application/javascript;base64,${base64}`;
      }

      return `export default ${JSON.stringify(cached)};\n`;
    }
  };
}
