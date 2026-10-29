// Snapshot tests of every BusyBar method: each case runs in every scenario, and the recorded requests, the result or error and apiSemver must match the snapshot.
import { createHash } from 'node:crypto';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { BusyBar, type RequestOptions } from 'BusyBar/index';
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
  { method: 'AccountInfoGet', endpoint: 'GET /account/info', call: (bar, o) => bar.AccountInfoGet(o) },
  { method: 'AccountStateGet', endpoint: 'GET /account/status', call: (bar, o) => bar.AccountStateGet(o) },
  { method: 'AccountBackendGet', endpoint: 'GET /account/backend', call: (bar, o) => bar.AccountBackendGet(o) },
  {
    method: 'AccountBackendSet',
    endpoint: 'PUT /account/backend',
    call: (bar, o) => bar.AccountBackendSet({ server_url: 'https://example.com', client_cert_type: 'default', ignore_server_cert: false }, o)
  },
  { method: 'AccountUnlink', endpoint: 'DELETE /account', call: (bar, o) => bar.AccountUnlink(o) },
  { method: 'AccountLink', endpoint: 'POST /account/link', call: (bar, o) => bar.AccountLink(o) },

  // apps
  { method: 'AppsStage', variant: 'Uint8Array', endpoint: 'POST /apps/stage', call: (bar, o) => bar.AppsStage({ file }, o) },
  { method: 'AppsStage', variant: 'Blob', endpoint: 'POST /apps/stage', call: (bar, o) => bar.AppsStage({ file: new Blob([file]) }, o) },
  { method: 'AppsStage', variant: 'ArrayBuffer', endpoint: 'POST /apps/stage', call: (bar, o) => bar.AppsStage({ file: file.slice().buffer }, o) },
  { method: 'AppsStage', variant: 'Buffer', endpoint: 'POST /apps/stage', call: (bar, o) => bar.AppsStage({ file: Buffer.from(file) }, o) },
  { method: 'AppsInstall', endpoint: 'POST /apps/install', call: (bar, o) => bar.AppsInstall({ install_key: 42 }, o) },
  { method: 'AppsRemove', endpoint: 'DELETE /apps', call: (bar, o) => bar.AppsRemove({ app_id: 'app' }, o) },
  { method: 'AppsList', endpoint: 'GET /apps/list', call: (bar, o) => bar.AppsList(o) },
  { method: 'AppsSettingsGet', endpoint: 'GET /apps/settings', call: (bar, o) => bar.AppsSettingsGet({ app_id: 'app' }, o) },
  {
    method: 'AppsSettingsSet',
    endpoint: 'PUT /apps/settings',
    call: (bar, o) => bar.AppsSettingsSet({ app_id: 'app', settings: { version: 1, values: { city: 'Berlin' } } }, o)
  },
  { method: 'AppsSettingsReset', endpoint: 'DELETE /apps/settings', call: (bar, o) => bar.AppsSettingsReset({ app_id: 'app' }, o) },

  // assets
  { method: 'AssetsUpload', endpoint: 'POST /assets/upload', call: (bar, o) => bar.AssetsUpload({ application_name: 'app', file: 'a.png', data: file }, o) },
  { method: 'AssetsDelete', endpoint: 'DELETE /assets/upload', call: (bar, o) => bar.AssetsDelete({ application_name: 'app' }, o) },

  // audio
  { method: 'AudioPlay', variant: 'path', endpoint: 'POST /audio/play', call: (bar, o) => bar.AudioPlay({ application_name: 'app', path: 'a.snd' }, o) },
  { method: 'AudioPlay', variant: 'stock', endpoint: 'POST /audio/play', call: (bar, o) => bar.AudioPlay({ application_name: 'app', stock_path: 'beep' }, o) },
  { method: 'AudioStop', endpoint: 'DELETE /audio/play', call: (bar, o) => bar.AudioStop(o) },
  { method: 'AudioVolumeGet', endpoint: 'GET /audio/volume', call: (bar, o) => bar.AudioVolumeGet(o) },
  { method: 'AudioVolumeSet', endpoint: 'POST /audio/volume', call: (bar, o) => bar.AudioVolumeSet({ volume: 50 }, o) },
  { method: 'AudioVolumeSet', variant: 'out of range', endpoint: null, call: (bar, o) => bar.AudioVolumeSet({ volume: 101 }, o) },

  // ble
  { method: 'BleEnable', endpoint: 'POST /ble/enable', call: (bar, o) => bar.BleEnable(o) },
  { method: 'BleDisable', endpoint: 'POST /ble/disable', call: (bar, o) => bar.BleDisable(o) },
  { method: 'BleUnpair', endpoint: 'DELETE /ble/pairing', call: (bar, o) => bar.BleUnpair(o) },
  { method: 'BleStatusGet', endpoint: 'GET /ble/status', call: (bar, o) => bar.BleStatusGet(o) },

  // busy
  { method: 'BusySnapshotGet', endpoint: 'GET /busy/snapshot', call: (bar, o) => bar.BusySnapshotGet(o) },
  {
    method: 'BusySnapshotSet',
    endpoint: 'PUT /busy/snapshot',
    call: (bar, o) => bar.BusySnapshotSet({ snapshot: { type: 'NOT_STARTED', busy_bar_settings: busyBarSettings }, snapshot_timestamp_ms: 0 }, o)
  },
  { method: 'BusyProfileGet', endpoint: 'GET /busy/profiles/{slot}', call: (bar, o) => bar.BusyProfileGet({ slot: 'busy' }, o) },
  {
    method: 'BusyProfileSet',
    endpoint: 'PUT /busy/profiles/{slot}',
    call: (bar, o) => bar.BusyProfileSet({ slot: 'busy', ...busyProfile }, o)
  },

  // display
  { method: 'DisplayDraw', endpoint: 'POST /display/draw', call: (bar, o) => bar.DisplayDraw(drawParams, o) },
  { method: 'DisplayDraw', variant: 'priority', endpoint: 'POST /display/draw', call: (bar, o) => bar.DisplayDraw({ ...drawParams, priority: 90 }, o) },
  { method: 'DisplayClear', endpoint: 'DELETE /display/draw', call: (bar, o) => bar.DisplayClear(undefined, o) },
  { method: 'DisplayClear', variant: 'params', endpoint: 'DELETE /display/draw', call: (bar, o) => bar.DisplayClear({ application_name: 'app' }, o) },
  { method: 'DisplayScreenFrameGet', endpoint: 'GET /screen', call: (bar, o) => bar.DisplayScreenFrameGet({ display: Display.FRONT }, o) },
  {
    method: 'DisplayScreenFrameGet',
    variant: 'binary front',
    endpoint: 'GET /screen',
    call: (bar, o) => bar.DisplayScreenFrameGet({ display: Display.FRONT }, { ...o, dataType: 'binary' })
  },
  {
    method: 'DisplayScreenFrameGet',
    variant: 'rgba front',
    endpoint: 'GET /screen',
    call: (bar, o) => bar.DisplayScreenFrameGet({ display: Display.FRONT }, { ...o, dataType: 'binary', format: 'rgba' })
  },
  {
    method: 'DisplayScreenFrameGet',
    variant: 'rgba back',
    endpoint: 'GET /screen',
    call: (bar, o) => bar.DisplayScreenFrameGet({ display: Display.BACK }, { ...o, dataType: 'binary', format: 'rgba' })
  },
  { method: 'DisplayBrightnessGet', endpoint: 'GET /display/brightness', call: (bar, o) => bar.DisplayBrightnessGet(o) },
  { method: 'DisplayBrightnessSet', endpoint: 'POST /display/brightness', call: (bar, o) => bar.DisplayBrightnessSet({ value: 50 }, o) },
  { method: 'DisplayBrightnessSet', variant: 'auto', endpoint: 'POST /display/brightness', call: (bar, o) => bar.DisplayBrightnessSet({ value: 'auto' }, o) },
  { method: 'DisplayBrightnessSet', variant: 'out of range', endpoint: null, call: (bar, o) => bar.DisplayBrightnessSet({ value: 101 }, o) },

  // input
  { method: 'InputSend', endpoint: 'POST /input', call: (bar, o) => bar.InputSend({ key: 'ok' }, o) },

  // settings
  { method: 'SettingsAccessGet', endpoint: 'GET /access', call: (bar, o) => bar.SettingsAccessGet(o) },
  { method: 'SettingsAccessSet', endpoint: 'POST /access', call: (bar, o) => bar.SettingsAccessSet({ mode: 'disabled' }, o) },
  {
    method: 'SettingsAccessSet',
    variant: 'key applies to next requests',
    endpoint: 'GET /status',
    call: async (bar, o) => {
      await bar.SettingsAccessSet({ mode: 'key', key: '5678' }, o);
      return bar.SystemStatusGet(o);
    }
  },
  { method: 'SettingsAccessSet', variant: 'invalid key', endpoint: null, call: (bar, o) => bar.SettingsAccessSet({ mode: 'key', key: 'abc' }, o) },
  { method: 'SettingsNameGet', endpoint: 'GET /name', call: (bar, o) => bar.SettingsNameGet(o) },
  { method: 'SettingsNameSet', endpoint: 'POST /name', call: (bar, o) => bar.SettingsNameSet({ name: 'Bar' }, o) },
  { method: 'SettingsAccessTokensGet', endpoint: 'GET /access/tokens', call: (bar, o) => bar.SettingsAccessTokensGet(o) },
  { method: 'SettingsAccessTokenCreate', endpoint: 'POST /access/tokens', call: (bar, o) => bar.SettingsAccessTokenCreate({ name: 'cli' }, o) },
  { method: 'SettingsAccessTokensDelete', endpoint: 'DELETE /access/tokens', call: (bar, o) => bar.SettingsAccessTokensDelete(o) },
  {
    method: 'SettingsAccessTokenRevoke',
    endpoint: 'DELETE /access/tokens/{short_id}',
    call: (bar, o) => bar.SettingsAccessTokenRevoke({ short_id: 'abc' }, o)
  },

  // smartHome
  { method: 'SmartHomePairingGet', endpoint: 'GET /smart_home/pairing', call: (bar, o) => bar.SmartHomePairingGet(o) },
  { method: 'SmartHomePair', endpoint: 'POST /smart_home/pairing', call: (bar, o) => bar.SmartHomePair(o) },
  { method: 'SmartHomeErase', endpoint: 'DELETE /smart_home/pairing', call: (bar, o) => bar.SmartHomeErase(o) },
  { method: 'SmartHomeSwitchStateGet', endpoint: 'GET /smart_home/switch', call: (bar, o) => bar.SmartHomeSwitchStateGet(o) },
  { method: 'SmartHomeSwitchStateSet', endpoint: 'POST /smart_home/switch', call: (bar, o) => bar.SmartHomeSwitchStateSet({ state: true, startup: 'off' }, o) },

  // storage
  { method: 'StorageWrite', endpoint: 'POST /storage/write', call: (bar, o) => bar.StorageWrite({ path: '/ext/a.bin', file }, o) },
  { method: 'StorageRead', endpoint: 'GET /storage/read', call: (bar, o) => bar.StorageRead({ path: '/ext/a.bin' }, o) },
  {
    method: 'StorageRead',
    variant: 'array buffer',
    endpoint: 'GET /storage/read',
    call: (bar, o) => bar.StorageRead({ path: '/ext/a.bin' }, { ...o, as_array_buffer: true })
  },
  { method: 'StorageListGet', endpoint: 'GET /storage/list', call: (bar, o) => bar.StorageListGet({ path: '/ext' }, o) },
  { method: 'StorageRemove', endpoint: 'DELETE /storage/remove', call: (bar, o) => bar.StorageRemove({ path: '/ext/a.bin' }, o) },
  { method: 'StorageMkdir', endpoint: 'POST /storage/mkdir', call: (bar, o) => bar.StorageMkdir({ path: '/ext/dir' }, o) },
  { method: 'StorageStatusGet', endpoint: 'GET /storage/status', call: (bar, o) => bar.StorageStatusGet(o) },
  { method: 'StorageRename', endpoint: 'POST /storage/rename', call: (bar, o) => bar.StorageRename({ path: '/ext/a.bin', new_path: '/ext/b.bin' }, o) },

  // system
  { method: 'SystemVersionGet', endpoint: 'GET /version', call: (bar, o) => bar.SystemVersionGet(o) },
  { method: 'SystemStatusGet', endpoint: 'GET /status', call: (bar, o) => bar.SystemStatusGet(o) },
  { method: 'SystemInfoGet', endpoint: 'GET /status/system', call: (bar, o) => bar.SystemInfoGet(o) },
  { method: 'SystemStatusPowerGet', endpoint: 'GET /status/power', call: (bar, o) => bar.SystemStatusPowerGet(o) },
  { method: 'SystemStatusDeviceGet', endpoint: 'GET /status/device', call: (bar, o) => bar.SystemStatusDeviceGet(o) },
  { method: 'SystemStatusFirmwareGet', endpoint: 'GET /status/firmware', call: (bar, o) => bar.SystemStatusFirmwareGet(o) },
  { method: 'SystemTransportGet', endpoint: 'GET /transport', call: (bar, o) => bar.SystemTransportGet(o) },
  { method: 'SystemLogDump', endpoint: 'POST /log_dump', call: (bar, o) => bar.SystemLogDump(undefined, o) },
  { method: 'SystemLogDump', variant: 'params', endpoint: 'POST /log_dump', call: (bar, o) => bar.SystemLogDump({ filename: 'log.txt' }, o) },

  // time
  { method: 'TimeGet', endpoint: 'GET /time', call: (bar, o) => bar.TimeGet(o) },
  { method: 'TimeTimestampSet', endpoint: 'POST /time/timestamp', call: (bar, o) => bar.TimeTimestampSet({ timestamp: '2026-01-01T00:00:00' }, o) },
  { method: 'TimeTimezoneGet', endpoint: 'GET /time/timezone', call: (bar, o) => bar.TimeTimezoneGet(o) },
  { method: 'TimeTimezoneSet', endpoint: 'POST /time/timezone', call: (bar, o) => bar.TimeTimezoneSet({ timezone: 'Europe/Berlin' }, o) },
  { method: 'TimeTzListGet', endpoint: 'GET /time/tzlist', call: (bar, o) => bar.TimeTzListGet(o) },

  // update
  { method: 'UpdateFromFile', endpoint: 'POST /update', call: (bar, o) => bar.UpdateFromFile({ file }, o) },
  { method: 'UpdateCheck', endpoint: 'POST /update/check', call: (bar, o) => bar.UpdateCheck(o) },
  { method: 'UpdateStatusGet', endpoint: 'GET /update/status', call: (bar, o) => bar.UpdateStatusGet(o) },
  { method: 'UpdateChangelogGet', endpoint: 'GET /update/changelog', call: (bar, o) => bar.UpdateChangelogGet({ version: '1.0.0' }, o) },
  { method: 'UpdateInstall', endpoint: 'POST /update/install', call: (bar, o) => bar.UpdateInstall({ version: '1.0.0' }, o) },
  { method: 'UpdateAbort', endpoint: 'POST /update/abort_download', call: (bar, o) => bar.UpdateAbort(o) },
  { method: 'UpdateAutoUpdateGet', endpoint: 'GET /update/autoupdate', call: (bar, o) => bar.UpdateAutoUpdateGet(o) },
  {
    method: 'UpdateAutoUpdateSet',
    endpoint: 'POST /update/autoupdate',
    call: (bar, o) => bar.UpdateAutoUpdateSet({ is_enabled: true, interval_start: '01:00', interval_end: '05:00' }, o)
  },

  // wifi
  { method: 'WifiStatusGet', endpoint: 'GET /wifi/status', call: (bar, o) => bar.WifiStatusGet(o) },
  {
    method: 'WifiConnect',
    endpoint: 'POST /wifi/connect',
    call: (bar, o) => bar.WifiConnect({ ssid: 'home', password: 'secret', security: 'WPA2', ip_config: { ip_method: 'dhcp' } }, o)
  },
  { method: 'WifiDisconnect', endpoint: 'POST /wifi/disconnect', call: (bar, o) => bar.WifiDisconnect(o) },
  { method: 'WifiNetworksGet', endpoint: 'GET /wifi/networks', call: (bar, o) => bar.WifiNetworksGet(o) }
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

async function run(testCase: Case, scenario: Scenario): Promise<Run> {
  const { requests } = mockFetch(scenario.handler());
  const bar = new BusyBar(config);

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
  const sendingCases = cases.filter((c) => c.endpoint !== null && c.method !== 'SystemVersionGet');

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
