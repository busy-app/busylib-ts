// Snapshot tests of every BusyBar method: each case runs in every scenario, and the recorded requests, the result or error and apiSemver must match the snapshot. The same cases check the functions with BusyBarAppClient against BusyBar.
import { createHash } from 'node:crypto';
import { afterEach, describe, expect, test, vi } from 'vitest';
import * as api from 'BusyBar/index';
import { BusyBar, BusyBarAppClient, type RequestOptions } from 'BusyBar/index';
import { Display } from 'Global/types';
import { json, mockFetch, pathOf, text, type Handler, type RecordedRequest } from './tools/fetch';
import { failingHandler, fixtureHandler, versionMismatchOnce } from './tools/fixtures';

type MethodName = { [K in keyof BusyBar]: BusyBar[K] extends (...args: never[]) => unknown ? K : never }[keyof BusyBar];

interface Case {
  method: MethodName;
  // Variant of the call when a method has several cases.
  variant?: string;
  // `METHOD /path` the call must end with, or `null` when it must fail before sending anything.
  endpoint: string | null;
  call: (bar: BusyBar, options?: RequestOptions) => Promise<unknown>;
}

const file = Uint8Array.from([1, 2, 3, 4]);
const busyBarSettings = { theme: 'default', show_work_phase_only: false, trigger_smart_home: false };
const busyProfile = {
  sort_order: 0,
  title: 'Busy',
  id: 'profile',
  timer_settings: { type: 'SIMPLE' as const, total_time_ms: 60000 },
  busy_bar_settings: busyBarSettings,
  profile_timestamp_ms: 0
};
const drawParams = {
  application_name: 'app',
  elements: [{ id: 'text', type: 'text' as const, text: 'Hi', font: 'small' as const, x: 0, y: 0, display: 'front' as const }]
};

const cases: Case[] = [
  // account
  { method: 'accountInfoGet', endpoint: 'GET /account/info', call: (bar, o) => bar.accountInfoGet(o) },
  { method: 'accountStateGet', endpoint: 'GET /account/status', call: (bar, o) => bar.accountStateGet(o) },
  { method: 'accountBackendGet', endpoint: 'GET /account/backend', call: (bar, o) => bar.accountBackendGet(o) },
  {
    method: 'accountBackendSet',
    endpoint: 'PUT /account/backend',
    call: (bar, o) => bar.accountBackendSet({ server_url: 'https://example.com', client_cert_type: 'default', ignore_server_cert: false }, o)
  },
  { method: 'accountUnlink', endpoint: 'DELETE /account', call: (bar, o) => bar.accountUnlink(o) },
  { method: 'accountLink', endpoint: 'POST /account/link', call: (bar, o) => bar.accountLink(o) },

  // apps
  { method: 'appsStage', variant: 'Uint8Array', endpoint: 'POST /apps/stage', call: (bar, o) => bar.appsStage({ file }, o) },
  { method: 'appsStage', variant: 'Blob', endpoint: 'POST /apps/stage', call: (bar, o) => bar.appsStage({ file: new Blob([file]) }, o) },
  { method: 'appsStage', variant: 'ArrayBuffer', endpoint: 'POST /apps/stage', call: (bar, o) => bar.appsStage({ file: file.slice().buffer }, o) },
  { method: 'appsStage', variant: 'Buffer', endpoint: 'POST /apps/stage', call: (bar, o) => bar.appsStage({ file: Buffer.from(file) }, o) },
  { method: 'appsInstall', endpoint: 'POST /apps/install', call: (bar, o) => bar.appsInstall({ install_key: 42 }, o) },
  { method: 'appsRemove', endpoint: 'DELETE /apps', call: (bar, o) => bar.appsRemove({ app_id: 'app' }, o) },
  { method: 'appsList', endpoint: 'GET /apps/list', call: (bar, o) => bar.appsList(o) },
  { method: 'appsSettingsGet', endpoint: 'GET /apps/settings', call: (bar, o) => bar.appsSettingsGet({ app_id: 'app' }, o) },
  {
    method: 'appsSettingsSet',
    endpoint: 'PUT /apps/settings',
    call: (bar, o) => bar.appsSettingsSet({ app_id: 'app', settings: { version: 1, values: { city: 'Berlin' } } }, o)
  },
  { method: 'appsSettingsReset', endpoint: 'DELETE /apps/settings', call: (bar, o) => bar.appsSettingsReset({ app_id: 'app' }, o) },

  // assets
  { method: 'assetsUpload', endpoint: 'POST /assets/upload', call: (bar, o) => bar.assetsUpload({ application_name: 'app', file: 'a.png', data: file }, o) },
  { method: 'assetsDelete', endpoint: 'DELETE /assets/upload', call: (bar, o) => bar.assetsDelete({ application_name: 'app' }, o) },

  // audio
  { method: 'audioPlay', variant: 'path', endpoint: 'POST /audio/play', call: (bar, o) => bar.audioPlay({ application_name: 'app', path: 'a.snd' }, o) },
  { method: 'audioPlay', variant: 'stock', endpoint: 'POST /audio/play', call: (bar, o) => bar.audioPlay({ application_name: 'app', stock_path: 'beep' }, o) },
  { method: 'audioStop', endpoint: 'DELETE /audio/play', call: (bar, o) => bar.audioStop(o) },
  { method: 'audioVolumeGet', endpoint: 'GET /audio/volume', call: (bar, o) => bar.audioVolumeGet(o) },
  { method: 'audioVolumeSet', endpoint: 'POST /audio/volume', call: (bar, o) => bar.audioVolumeSet({ volume: 50 }, o) },
  { method: 'audioVolumeSet', variant: 'out of range', endpoint: null, call: (bar, o) => bar.audioVolumeSet({ volume: 101 }, o) },

  // ble
  { method: 'bleEnable', endpoint: 'POST /ble/enable', call: (bar, o) => bar.bleEnable(o) },
  { method: 'bleDisable', endpoint: 'POST /ble/disable', call: (bar, o) => bar.bleDisable(o) },
  { method: 'bleUnpair', endpoint: 'DELETE /ble/pairing', call: (bar, o) => bar.bleUnpair(o) },
  { method: 'bleStatusGet', endpoint: 'GET /ble/status', call: (bar, o) => bar.bleStatusGet(o) },

  // busy
  { method: 'busySnapshotGet', endpoint: 'GET /busy/snapshot', call: (bar, o) => bar.busySnapshotGet(o) },
  {
    method: 'busySnapshotSet',
    endpoint: 'PUT /busy/snapshot',
    call: (bar, o) => bar.busySnapshotSet({ snapshot: { type: 'NOT_STARTED', busy_bar_settings: busyBarSettings }, snapshot_timestamp_ms: 0 }, o)
  },
  { method: 'busyProfileGet', endpoint: 'GET /busy/profiles/{slot}', call: (bar, o) => bar.busyProfileGet({ slot: 'busy' }, o) },
  {
    method: 'busyProfileSet',
    endpoint: 'PUT /busy/profiles/{slot}',
    call: (bar, o) => bar.busyProfileSet({ slot: 'busy', ...busyProfile }, o)
  },

  // display
  { method: 'displayDraw', endpoint: 'POST /display/draw', call: (bar, o) => bar.displayDraw(drawParams, o) },
  { method: 'displayDraw', variant: 'priority', endpoint: 'POST /display/draw', call: (bar, o) => bar.displayDraw({ ...drawParams, priority: 90 }, o) },
  { method: 'displayClear', endpoint: 'DELETE /display/draw', call: (bar, o) => bar.displayClear(undefined, o) },
  { method: 'displayClear', variant: 'params', endpoint: 'DELETE /display/draw', call: (bar, o) => bar.displayClear({ application_name: 'app' }, o) },
  { method: 'displayScreenFrameGet', endpoint: 'GET /screen', call: (bar, o) => bar.displayScreenFrameGet({ display: Display.FRONT }, o) },
  {
    method: 'displayScreenFrameGet',
    variant: 'binary front',
    endpoint: 'GET /screen',
    call: (bar, o) => bar.displayScreenFrameGet({ display: Display.FRONT }, { ...o, dataType: 'binary' })
  },
  {
    method: 'displayScreenFrameGet',
    variant: 'rgba front',
    endpoint: 'GET /screen',
    call: (bar, o) => bar.displayScreenFrameGet({ display: Display.FRONT }, { ...o, dataType: 'binary', format: 'rgba' })
  },
  {
    method: 'displayScreenFrameGet',
    variant: 'rgba back',
    endpoint: 'GET /screen',
    call: (bar, o) => bar.displayScreenFrameGet({ display: Display.BACK }, { ...o, dataType: 'binary', format: 'rgba' })
  },
  { method: 'displayBrightnessGet', endpoint: 'GET /display/brightness', call: (bar, o) => bar.displayBrightnessGet(o) },
  { method: 'displayBrightnessSet', endpoint: 'POST /display/brightness', call: (bar, o) => bar.displayBrightnessSet({ value: 50 }, o) },
  { method: 'displayBrightnessSet', variant: 'auto', endpoint: 'POST /display/brightness', call: (bar, o) => bar.displayBrightnessSet({ value: 'auto' }, o) },
  { method: 'displayBrightnessSet', variant: 'out of range', endpoint: null, call: (bar, o) => bar.displayBrightnessSet({ value: 101 }, o) },

  // input
  { method: 'inputSend', endpoint: 'POST /input', call: (bar, o) => bar.inputSend({ key: 'ok' }, o) },

  // settings
  { method: 'settingsAccessGet', endpoint: 'GET /access', call: (bar, o) => bar.settingsAccessGet(o) },
  { method: 'settingsAccessSet', endpoint: 'POST /access', call: (bar, o) => bar.settingsAccessSet({ mode: 'disabled' }, o) },
  {
    method: 'settingsAccessSet',
    variant: 'key applies to next requests',
    endpoint: 'GET /status',
    call: async (bar, o) => {
      await bar.settingsAccessSet({ mode: 'key', key: '5678' }, o);
      return bar.systemStatusGet(o);
    }
  },
  { method: 'settingsAccessSet', variant: 'invalid key', endpoint: null, call: (bar, o) => bar.settingsAccessSet({ mode: 'key', key: 'abc' }, o) },
  { method: 'settingsNameGet', endpoint: 'GET /name', call: (bar, o) => bar.settingsNameGet(o) },
  { method: 'settingsNameSet', endpoint: 'POST /name', call: (bar, o) => bar.settingsNameSet({ name: 'Bar' }, o) },
  { method: 'settingsAccessTokensGet', endpoint: 'GET /access/tokens', call: (bar, o) => bar.settingsAccessTokensGet(o) },
  { method: 'settingsAccessTokenCreate', endpoint: 'POST /access/tokens', call: (bar, o) => bar.settingsAccessTokenCreate({ name: 'cli' }, o) },
  { method: 'settingsAccessTokensDelete', endpoint: 'DELETE /access/tokens', call: (bar, o) => bar.settingsAccessTokensDelete(o) },
  {
    method: 'settingsAccessTokenRevoke',
    endpoint: 'DELETE /access/tokens/{short_id}',
    call: (bar, o) => bar.settingsAccessTokenRevoke({ short_id: 'abc' }, o)
  },

  // smartHome
  { method: 'smartHomePairingGet', endpoint: 'GET /smart_home/pairing', call: (bar, o) => bar.smartHomePairingGet(o) },
  { method: 'smartHomePair', endpoint: 'POST /smart_home/pairing', call: (bar, o) => bar.smartHomePair(o) },
  { method: 'smartHomeErase', endpoint: 'DELETE /smart_home/pairing', call: (bar, o) => bar.smartHomeErase(o) },
  { method: 'smartHomeSwitchStateGet', endpoint: 'GET /smart_home/switch', call: (bar, o) => bar.smartHomeSwitchStateGet(o) },
  { method: 'smartHomeSwitchStateSet', endpoint: 'POST /smart_home/switch', call: (bar, o) => bar.smartHomeSwitchStateSet({ state: true, startup: 'off' }, o) },

  // storage
  { method: 'storageWrite', endpoint: 'POST /storage/write', call: (bar, o) => bar.storageWrite({ path: '/ext/a.bin', file }, o) },
  { method: 'storageRead', endpoint: 'GET /storage/read', call: (bar, o) => bar.storageRead({ path: '/ext/a.bin' }, o) },
  {
    method: 'storageRead',
    variant: 'array buffer',
    endpoint: 'GET /storage/read',
    call: (bar, o) => bar.storageRead({ path: '/ext/a.bin' }, { ...o, as_array_buffer: true })
  },
  { method: 'storageListGet', endpoint: 'GET /storage/list', call: (bar, o) => bar.storageListGet({ path: '/ext' }, o) },
  { method: 'storageRemove', endpoint: 'DELETE /storage/remove', call: (bar, o) => bar.storageRemove({ path: '/ext/a.bin' }, o) },
  { method: 'storageMkdir', endpoint: 'POST /storage/mkdir', call: (bar, o) => bar.storageMkdir({ path: '/ext/dir' }, o) },
  { method: 'storageStatusGet', endpoint: 'GET /storage/status', call: (bar, o) => bar.storageStatusGet(o) },
  { method: 'storageRename', endpoint: 'POST /storage/rename', call: (bar, o) => bar.storageRename({ path: '/ext/a.bin', new_path: '/ext/b.bin' }, o) },

  // system
  { method: 'systemVersionGet', endpoint: 'GET /version', call: (bar, o) => bar.systemVersionGet(o) },
  { method: 'systemStatusGet', endpoint: 'GET /status', call: (bar, o) => bar.systemStatusGet(o) },
  { method: 'systemInfoGet', endpoint: 'GET /status/system', call: (bar, o) => bar.systemInfoGet(o) },
  { method: 'systemStatusPowerGet', endpoint: 'GET /status/power', call: (bar, o) => bar.systemStatusPowerGet(o) },
  { method: 'systemStatusDeviceGet', endpoint: 'GET /status/device', call: (bar, o) => bar.systemStatusDeviceGet(o) },
  { method: 'systemStatusFirmwareGet', endpoint: 'GET /status/firmware', call: (bar, o) => bar.systemStatusFirmwareGet(o) },
  { method: 'systemTransportGet', endpoint: 'GET /transport', call: (bar, o) => bar.systemTransportGet(o) },
  { method: 'systemLogDump', endpoint: 'POST /log_dump', call: (bar, o) => bar.systemLogDump(undefined, o) },
  { method: 'systemLogDump', variant: 'params', endpoint: 'POST /log_dump', call: (bar, o) => bar.systemLogDump({ filename: 'log.txt' }, o) },

  // time
  { method: 'timeGet', endpoint: 'GET /time', call: (bar, o) => bar.timeGet(o) },
  { method: 'timeTimestampSet', endpoint: 'POST /time/timestamp', call: (bar, o) => bar.timeTimestampSet({ timestamp: '2026-01-01T00:00:00' }, o) },
  { method: 'timeTimezoneGet', endpoint: 'GET /time/timezone', call: (bar, o) => bar.timeTimezoneGet(o) },
  { method: 'timeTimezoneSet', endpoint: 'POST /time/timezone', call: (bar, o) => bar.timeTimezoneSet({ timezone: 'Europe/Berlin' }, o) },
  { method: 'timeTzListGet', endpoint: 'GET /time/tzlist', call: (bar, o) => bar.timeTzListGet(o) },

  // update
  { method: 'updateFromFile', endpoint: 'POST /update', call: (bar, o) => bar.updateFromFile({ file }, o) },
  { method: 'updateCheck', endpoint: 'POST /update/check', call: (bar, o) => bar.updateCheck(o) },
  { method: 'updateStatusGet', endpoint: 'GET /update/status', call: (bar, o) => bar.updateStatusGet(o) },
  { method: 'updateChangelogGet', endpoint: 'GET /update/changelog', call: (bar, o) => bar.updateChangelogGet({ version: '1.0.0' }, o) },
  { method: 'updateInstall', endpoint: 'POST /update/install', call: (bar, o) => bar.updateInstall({ version: '1.0.0' }, o) },
  { method: 'updateAbort', endpoint: 'POST /update/abort_download', call: (bar, o) => bar.updateAbort(o) },
  { method: 'updateAutoUpdateGet', endpoint: 'GET /update/autoupdate', call: (bar, o) => bar.updateAutoUpdateGet(o) },
  {
    method: 'updateAutoUpdateSet',
    endpoint: 'POST /update/autoupdate',
    call: (bar, o) => bar.updateAutoUpdateSet({ is_enabled: true, interval_start: '01:00', interval_end: '05:00' }, o)
  },

  // wifi
  { method: 'wifiStatusGet', endpoint: 'GET /wifi/status', call: (bar, o) => bar.wifiStatusGet(o) },
  {
    method: 'wifiConnect',
    endpoint: 'POST /wifi/connect',
    call: (bar, o) => bar.wifiConnect({ ssid: 'home', password: 'secret', security: 'WPA2', ip_config: { ip_method: 'dhcp' } }, o)
  },
  { method: 'wifiDisconnect', endpoint: 'POST /wifi/disconnect', call: (bar, o) => bar.wifiDisconnect(o) },
  { method: 'wifiNetworksGet', endpoint: 'GET /wifi/networks', call: (bar, o) => bar.wifiNetworksGet(o) }
];

interface Scenario {
  name: string;
  handler: () => Handler;
  options?: () => RequestOptions;
}

const scenarios: Scenario[] = [
  { name: 'ok', handler: () => fixtureHandler },
  { name: 'JSON error', handler: () => failingHandler(() => json({ error: 'bad' }, { status: 500, statusText: 'Internal Server Error' })) },
  { name: 'text error', handler: () => failingHandler(() => text('oops', { status: 500, statusText: 'Internal Server Error' })) },
  { name: '405', handler: () => versionMismatchOnce() },
  { name: 'aborted', handler: () => fixtureHandler, options: () => ({ signal: AbortSignal.abort() }) }
];

interface NormalizedRequest {
  method: string;
  url: string;
  headers: Record<string, string>;
  body: unknown;
}

interface Run {
  requests: NormalizedRequest[];
  outcome: { data: unknown } | { error: unknown };
  apiSemver: string;
}

// Screen frames are tens of kilobytes, so long payloads are stored as a hash to keep the snapshot readable.
async function encodeBytes(value: Blob | ArrayBuffer | Uint8Array): Promise<string> {
  const buffer = value instanceof Blob ? await value.arrayBuffer() : value;
  const bytes = Buffer.from(buffer instanceof ArrayBuffer ? new Uint8Array(buffer) : buffer);
  return bytes.length <= 64 ? bytes.toString('base64') : `${bytes.length} bytes, sha256 ${createHash('sha256').update(bytes).digest('hex')}`;
}

// Turns results into plain JSON, so runs can be stored as snapshots.
async function normalizeData(data: unknown): Promise<unknown> {
  if (data instanceof Blob) {
    return { Blob: await encodeBytes(data) };
  }
  if (data instanceof ArrayBuffer) {
    return { ArrayBuffer: await encodeBytes(data) };
  }
  if (data instanceof Uint8Array) {
    return { Uint8Array: await encodeBytes(data) };
  }
  return data;
}

function normalizeError(error: unknown): unknown {
  if (!(error instanceof Error)) {
    return { thrown: error };
  }
  const { status, statusText, body } = error as Error & { status?: number; statusText?: string; body?: unknown };
  return { name: error.name, message: error.message, status, statusText, body };
}

function normalizeRequest({ method, url, headers, body }: RecordedRequest): NormalizedRequest {
  const isJson = headers['content-type']?.includes('json');
  const decoded = body && (isJson ? JSON.parse(new TextDecoder().decode(body)) : Buffer.from(body).toString('base64'));
  return { method, url, headers, body: decoded };
}

const config = { token: 'token', HTTPAccessPassword: '1234' };

// The functions with a BusyBarAppClient, shaped like BusyBar so the same cases can call them.
function appBar(): BusyBar {
  const client = new BusyBarAppClient();
  const functions = Object.entries(api).filter(([name, value]) => /^[a-z]/.test(name) && typeof value === 'function') as [
    string,
    (...args: unknown[]) => unknown
  ][];
  return Object.fromEntries(functions.map(([name, fn]) => [name, (...args: unknown[]) => fn(client, ...args)])) as unknown as BusyBar;
}

async function run(testCase: Case, scenario: Scenario, create: () => BusyBar = () => new BusyBar(config)): Promise<Run> {
  const { requests } = mockFetch(scenario.handler());
  const bar = create();

  const outcome = await Promise.resolve()
    .then(() => testCase.call(bar, scenario.options?.()))
    .then(
      async (data) => ({ data: await normalizeData(data) }),
      (error: unknown) => ({ error: normalizeError(error) })
    );

  vi.unstubAllGlobals();

  return { requests: requests.map(normalizeRequest), outcome, apiSemver: bar.apiSemver };
}

const caseName = (c: Case) => (c.variant ? `${c.method} (${c.variant})` : c.method);
const endpointOf = (r: RecordedRequest) => `${r.method} ${pathOf(r)}`;
const isVersion = (r: NormalizedRequest) => r.url.endsWith('/version');

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('cases', () => {
  test('cover every BusyBar method', () => {
    const fixed = ['constructor', 'client', 'addr', 'apiSemver', 'apiClient', 'setToken', 'setHTTPAccessPassword'];
    const methods = Object.getOwnPropertyNames(BusyBar.prototype).filter((name) => !fixed.includes(name));
    expect(methods).toHaveLength(78);
    expect([...new Set(cases.map((c) => c.method))].sort()).toEqual(methods.sort());
  });

  // Checks the cases themselves: valid params, the right endpoint, fixtures for every response.
  test.each(cases.map((c) => [caseName(c), c] as const))('%s calls its endpoint', async (_, testCase) => {
    const { requests } = mockFetch(fixtureHandler);
    const call = testCase.call(new BusyBar());

    if (testCase.endpoint === null) {
      await expect(call).rejects.toThrow();
      expect(requests).toEqual([]);
      return;
    }

    await expect(call).resolves.not.toBeInstanceOf(Error);
    const path = testCase.endpoint.replace(/\{(\w+)\}/g, '[^/]+');
    expect(endpointOf(requests.at(-1)!)).toMatch(new RegExp(`^${path}$`));
  });
});

describe('scenarios', () => {
  const sendingCases = cases.filter((c) => c.endpoint !== null && c.method !== 'systemVersionGet');

  test.each(sendingCases.map((c) => [caseName(c), c] as const))('%s', async (_, testCase) => {
    // Sequential: each run replaces the global fetch.
    const runs: Record<string, Run> = {};
    for (const scenario of scenarios) {
      runs[scenario.name] = await run(testCase, scenario);
    }

    // Guards the snapshot from being updated with a broken run.
    expect(runs['ok']?.outcome).toHaveProperty('data');
    expect(runs['JSON error']?.outcome).toMatchObject({ error: { message: 'bad', status: 500 } });
    expect(runs['text error']?.outcome).toMatchObject({ error: { message: 'oops', status: 500 } });
    expect(runs['aborted']?.outcome).toMatchObject({ error: { name: 'AbortError', message: 'Request was aborted' } });

    // The rejected request is sent once more with the new version, body included.
    expect(runs['405']?.outcome).toEqual(runs['ok']?.outcome);
    expect(runs['405']?.apiSemver).toBe('2.0.0');
    const [first, retried] = runs['405']!.requests.filter((r) => !isVersion(r));
    expect(retried).toEqual({ ...first, headers: { ...first?.headers, 'x-api-sem-ver': '2.0.0' } });

    // Recorded from BusyBar-old before it was removed; only the 405 runs with a body were taken from the new implementation, as the old retry failed with TypeError.
    expect(runs).toMatchSnapshot();
  });
});

describe('BusyBarAppClient', () => {
  // What only the core adds: version negotiation and its headers.
  const withoutCore = ({ requests, outcome }: Run) => ({
    outcome,
    requests: requests
      .filter((r) => !isVersion(r))
      .map(({ headers: { 'x-api-sem-ver': _, 'x-api-token': __, ...headers }, ...request }) => ({ ...request, headers }))
  });

  // 405 and abort are handled by the core only.
  const shared = scenarios.filter((s) => ['ok', 'JSON error', 'text error'].includes(s.name));

  test.each(cases.map((c) => [caseName(c), c] as const))('%s sends what BusyBar sends, without the core', async (_, testCase) => {
    for (const scenario of shared) {
      const viaBar = await run(testCase, scenario, () => new BusyBar({ addr: 'localhost' }));
      const viaApp = await run(testCase, scenario, appBar);
      expect(withoutCore(viaApp), scenario.name).toEqual(withoutCore(viaBar));
    }
  });
});
