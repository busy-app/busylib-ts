// Bundle size of typical consumers: catches tree-shaking regressions that neither types nor functional tests see, built against dist the way an app imports the package.
import fs from 'node:fs';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
import { build, type Rolldown } from 'vite';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

const root = path.resolve(__dirname, '../..');
const project = path.join(root, 'node_modules/.cache/busylib-size');

interface Scenario {
  name: string;
  // App entry: results go to globalThis, otherwise the app build drops them as unused.
  code: string;
  // `METHOD /path` pairs the bundle must call, exactly, or their number when it is every endpoint. The core's own `GET /version` is not visible: its path is a constant.
  endpoints: string[] | number;
  // Upper bounds in bytes, set from measurements with a margin of about 10%.
  limit: { min: number; gzip: number };
}

const drawCall = `displayDraw(client, { application_name: 'app', elements: [] })`;

const scenarios: Scenario[] = [
  {
    name: 'BusyBarClient',
    code: `import { BusyBarClient } from '@busy-app/busy-lib';
globalThis.client = new BusyBarClient();`,
    endpoints: [],
    limit: { min: 10_900, gzip: 4_100 }
  },
  {
    name: 'BusyBarClient + displayDraw',
    code: `import { BusyBarClient, displayDraw } from '@busy-app/busy-lib';
const client = new BusyBarClient();
globalThis.run = () => ${drawCall};`,
    endpoints: ['POST /display/draw'],
    limit: { min: 11_100, gzip: 4_200 }
  },
  {
    name: 'weather',
    code: `import { BusyBarClient, appsSettingsGet, displayClear, displayDraw } from '@busy-app/busy-lib';
const client = new BusyBarClient();
globalThis.run = async () => {
  await appsSettingsGet(client, { app_id: 'weather' });
  await displayClear(client);
  await ${drawCall};
};`,
    endpoints: ['DELETE /display/draw', 'GET /apps/settings', 'POST /display/draw'],
    limit: { min: 11_300, gzip: 4_300 }
  },
  {
    name: 'BusyBar',
    code: `import { BusyBar } from '@busy-app/busy-lib';
globalThis.bar = new BusyBar();`,
    endpoints: 78,
    limit: { min: 25_200, gzip: 7_200 }
  }
];

async function bundle(scenario: Scenario): Promise<string> {
  const entry = path.join(project, `${scenario.name.replace(/\W+/g, '-')}.js`);
  fs.writeFileSync(entry, scenario.code);

  const result = (await build({
    root: project,
    configFile: false,
    logLevel: 'silent',
    build: { write: false, minify: true, modulePreload: false, rolldownOptions: { input: entry } }
  })) as Rolldown.RolldownOutput;

  return result.output
    .filter((file): file is Rolldown.OutputChunk => file.type === 'chunk')
    .map((chunk) => chunk.code)
    .join('\n');
}

// Minification keeps property names and string literals, so `client.POST('/display/draw'` stays recognizable; the quotes depend on the minifier (oxc emits template literals).
function endpointsIn(code: string): string[] {
  return [...new Set([...code.matchAll(/\.(GET|POST|PUT|DELETE)\(["'`]([^"'`]+)["'`]/g)].map(([, method, endpoint]) => `${method} ${endpoint}`))].sort();
}

beforeAll(() => {
  fs.rmSync(project, { recursive: true, force: true });
  fs.mkdirSync(path.join(project, 'node_modules/@busy-app'), { recursive: true });
  // Resolved by name, so package.json `exports` and `sideEffects` apply as for a real consumer.
  fs.symlinkSync(root, path.join(project, 'node_modules/@busy-app/busy-lib'), 'dir');
});

afterAll(() => {
  fs.rmSync(project, { recursive: true, force: true });
});

describe('bundle size', () => {
  test.each(scenarios.map((s) => [s.name, s] as const))('%s', async (_, scenario) => {
    const code = await bundle(scenario);
    const size = { min: Buffer.byteLength(code), gzip: gzipSync(code).length };
    console.log(`${scenario.name}: ${size.min} B min, ${size.gzip} B gzip`);

    const endpoints = endpointsIn(code);
    if (typeof scenario.endpoints === 'number') {
      expect(endpoints).toHaveLength(scenario.endpoints);
    } else {
      expect(endpoints).toEqual(scenario.endpoints);
    }
    expect(size.min).toBeLessThanOrEqual(scenario.limit.min);
    expect(size.gzip).toBeLessThanOrEqual(scenario.limit.gzip);
  });
});
