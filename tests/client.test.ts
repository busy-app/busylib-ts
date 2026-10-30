import { afterEach, describe, expect, test, vi } from 'vitest';
import { BusyBar, BusyBarAppClient, BusyBarClient, storageRead, type BusyBarConfig } from 'BusyBar/index';
import { resolveAddress } from 'BusyBar/client/config';
import { toFetchError } from 'BusyBar/client/errors';
import { sendRequest } from 'BusyBar/client/transport';
import { API_SEMVER, decode, defaultHandler, hang, json, mockFetch, pathOf, stubDeviceFetch, text, type Handler } from './tools/fetch';
import { failingHandler, versionMismatchOnce } from './tools/fixtures';

afterEach(() => {
  vi.unstubAllGlobals();
});

const drawBody = { application_name: 'app', elements: [] };

describe('resolveAddress', () => {
  const cases: [string, BusyBarConfig | undefined, string, string][] = [
    ['no config', undefined, 'http://10.0.4.20', 'http://10.0.4.20/api/'],
    ['empty config', {}, 'http://10.0.4.20', 'http://10.0.4.20/api/'],
    ['token only', { token: 't' }, 'https://api.busy.app', 'https://api.busy.app/busybar/'],
    ['address without protocol', { addr: '192.168.0.10' }, 'http://192.168.0.10', 'http://192.168.0.10/api/'],
    ['address with spaces', { addr: '  192.168.0.10  ' }, 'http://192.168.0.10', 'http://192.168.0.10/api/'],
    ['address with path', { addr: 'http://192.168.0.10/some/path/' }, 'http://192.168.0.10', 'http://192.168.0.10/api/'],
    ['https device', { addr: 'https://bar.local' }, 'https://bar.local', 'https://bar.local/api/'],
    ['proxy without protocol', { addr: 'api.busy.app', token: 't' }, 'https://api.busy.app', 'https://api.busy.app/busybar/'],
    ['proxy with prefix', { addr: 'api.dev.busy.app/busybar/', token: 't' }, 'https://api.dev.busy.app', 'https://api.dev.busy.app/busybar/'],
    ['proxy with explicit http', { addr: 'http://api.busy.app', token: 't' }, 'http://api.busy.app', 'http://api.busy.app/busybar/']
  ];

  test.each(cases)('%s', (_, config, addr, baseUrl) => {
    expect(resolveAddress(config)).toEqual({ addr, baseUrl });
    expect(new BusyBar(config).addr).toBe(addr);
  });

  test('proxy without token throws', () => {
    const message = 'Token is required. Please provide it.';
    expect(() => resolveAddress({ addr: 'api.busy.app' })).toThrow(message);
    expect(() => new BusyBar({ addr: 'api.busy.app' })).toThrow(message);
  });

  test('requests go to the base URL', async () => {
    const { requests } = mockFetch();
    await new BusyBarClient({ addr: 'api.busy.app', token: 't' }).GET('/status');
    expect(requests.map((r) => r.url)).toEqual(['https://api.busy.app/busybar/version', 'https://api.busy.app/busybar/status']);
  });
});

describe('headers', () => {
  test('Authorization goes everywhere, X-API-Token and X-API-Sem-Ver everywhere but /version', async () => {
    const { requests } = mockFetch();
    await new BusyBarClient({ token: 'secret', HTTPAccessPassword: '1234' }).GET('/status');

    const [version, status] = requests;
    expect(version?.headers).toMatchObject({ authorization: 'Bearer secret' });
    expect(version?.headers).not.toHaveProperty('x-api-token');
    expect(version?.headers).not.toHaveProperty('x-api-sem-ver');
    expect(status?.headers).toMatchObject({ authorization: 'Bearer secret', 'x-api-token': '1234', 'x-api-sem-ver': API_SEMVER });
  });

  test('no token and no password, no headers', async () => {
    const { requests } = mockFetch();
    await new BusyBarClient().GET('/status');
    expect(requests[1]?.headers).not.toHaveProperty('authorization');
    expect(requests[1]?.headers).not.toHaveProperty('x-api-token');
  });

  test('setToken and setHTTPAccessPassword apply to the next requests', async () => {
    const { requests } = mockFetch();
    const client = new BusyBarClient();
    await client.GET('/status');
    client.setToken('new-token');
    client.setHTTPAccessPassword('5678');
    await client.GET('/status');
    expect(requests[2]?.headers).toMatchObject({ authorization: 'Bearer new-token', 'x-api-token': '5678' });
  });

  test('core headers override the same headers from init, other headers are kept', async () => {
    const { requests } = mockFetch();
    await new BusyBarClient({ token: 'secret' }).GET('/status', { headers: { Authorization: 'Bearer other', 'X-Custom': '1' } });
    expect(requests[1]?.headers).toMatchObject({ authorization: 'Bearer secret', 'x-custom': '1' });
  });
});

describe('version', () => {
  test('parallel requests negotiate the version once', async () => {
    const { requests } = mockFetch();
    const client = new BusyBarClient();
    await Promise.all([client.GET('/status'), client.GET('/status/system'), client.GET('/status/power')]);
    expect(requests.filter((r) => pathOf(r) === '/version')).toHaveLength(1);
    expect(client.apiSemver).toBe(API_SEMVER);
  });

  test('apiSemver is empty before the first request', () => {
    expect(new BusyBarClient().apiSemver).toBe('');
  });

  test('any successful /version updates apiSemver', async () => {
    let semver = '1.0.0';
    mockFetch((request) => (pathOf(request) === '/version' ? json({ api_semver: semver }) : defaultHandler(request)));
    const client = new BusyBarClient();
    await client.GET('/status');
    semver = '2.0.0';
    await expect(client.GET('/version')).resolves.toEqual({ api_semver: '2.0.0' });
    expect(client.apiSemver).toBe('2.0.0');
  });

  test('empty api_semver rejects, the next request negotiates again', async () => {
    let semver = '';
    const { requests } = mockFetch((request) => (pathOf(request) === '/version' ? json({ api_semver: semver }) : defaultHandler(request)));
    const client = new BusyBarClient();
    await expect(client.GET('/status')).rejects.toThrow('Empty API version');
    semver = API_SEMVER;
    await client.GET('/status');
    expect(requests.map(pathOf)).toEqual(['/version', '/version', '/status']);
  });

  test('failed /version is thrown as FetchError', async () => {
    mockFetch((request) => (pathOf(request) === '/version' ? json({ error: 'down' }, { status: 503 }) : defaultHandler(request)));
    await expect(new BusyBarClient().GET('/status')).rejects.toMatchObject({ message: 'down', status: 503 });
  });
});

describe('405', () => {
  test('renegotiates the version and retries once', async () => {
    const { requests } = mockFetch(versionMismatchOnce(defaultHandler));
    const client = new BusyBarClient();
    await expect(client.GET('/status')).resolves.toEqual({ result: 'OK' });
    expect(requests.map(pathOf)).toEqual(['/version', '/status', '/version', '/status']);
    expect(requests[3]?.headers['x-api-sem-ver']).toBe('2.0.0');
    expect(client.apiSemver).toBe('2.0.0');
  });

  test('retries requests with a body', async () => {
    const { requests } = mockFetch(versionMismatchOnce(defaultHandler));
    await new BusyBarClient().POST('/display/draw', { body: drawBody });
    const draws = requests.filter((r) => pathOf(r) === '/display/draw');
    expect(draws).toHaveLength(2);
    expect(draws.map((r) => JSON.parse(decode(r.body) ?? ''))).toEqual([drawBody, drawBody]);
  });

  test('a second 405 is thrown', async () => {
    mockFetch(failingHandler(() => json({ error: 'nope' }, { status: 405 })));
    await expect(new BusyBarClient().GET('/status')).rejects.toMatchObject({ message: 'nope', status: 405 });
  });

  test('405 on /version is thrown without retry', async () => {
    const { requests } = mockFetch(() => json({ error: 'nope' }, { status: 405 }));
    await expect(new BusyBarClient().GET('/version')).rejects.toMatchObject({ status: 405 });
    expect(requests).toHaveLength(1);
  });
});

describe('timeout and abort', () => {
  const hangStatus: Handler = (request) => (pathOf(request) === '/version' ? defaultHandler(request) : hang(request.signal));

  test('timeout rejects with TimeoutError', async () => {
    mockFetch(hangStatus);
    await expect(new BusyBarClient().GET('/status', { timeout: 20 })).rejects.toMatchObject({ name: 'TimeoutError', message: 'Request timed out after 20ms' });
  });

  test('default timeout comes from the config', async () => {
    mockFetch(hangStatus);
    await expect(new BusyBarClient({ timeout: 20 }).GET('/status')).rejects.toMatchObject({ name: 'TimeoutError', message: 'Request timed out after 20ms' });
  });

  test('timeout 0 disables the timeout', async () => {
    mockFetch(async (request) => {
      await new Promise((resolve) => setTimeout(resolve, 40));
      return defaultHandler(request);
    });
    await expect(new BusyBarClient({ timeout: 20 }).GET('/version', { timeout: 0 })).resolves.toEqual({ api_semver: API_SEMVER });
  });

  test('without a timeout no timer is cleared', async () => {
    // The device logs an error for clearTimeout(undefined).
    mockFetch();
    const clear = vi.spyOn(globalThis, 'clearTimeout');
    await new BusyBarClient({ timeout: 0 }).GET('/status');
    expect(clear).not.toHaveBeenCalled();
    clear.mockRestore();
  });

  test('with the device firmware stubs the timeout still rejects', async () => {
    stubDeviceFetch();
    await expect(new BusyBarClient({ timeout: 20 }).GET('/status')).rejects.toMatchObject({ name: 'TimeoutError', message: 'Request timed out after 20ms' });
  });

  test('caller abort rejects with AbortError', async () => {
    mockFetch(hangStatus);
    const controller = new AbortController();
    const request = new BusyBarClient().GET('/status', { signal: controller.signal });
    setTimeout(() => controller.abort(), 10);
    await expect(request).rejects.toMatchObject({ name: 'AbortError', message: 'Request was aborted' });
  });

  test('already aborted signal rejects with AbortError', async () => {
    mockFetch();
    await expect(new BusyBarClient().GET('/status', { signal: AbortSignal.abort() })).rejects.toMatchObject({
      name: 'AbortError',
      message: 'Request was aborted'
    });
  });
});

describe('errors', () => {
  const cases: [string, Response, string, unknown][] = [
    ['JSON with error', json({ error: 'bad' }, { status: 400, statusText: 'Bad Request' }), 'bad', { error: 'bad' }],
    ['JSON with message', json({ message: 'msg' }, { status: 400, statusText: 'Bad Request' }), 'msg', { message: 'msg' }],
    ['JSON without text', json({ code: 1 }, { status: 400, statusText: 'Bad Request' }), 'HTTP 400 Bad Request', { code: 1 }],
    ['text', text('oops', { status: 500, statusText: 'Internal Server Error' }), 'oops', 'oops'],
    ['empty body', new Response(null, { status: 500, statusText: 'Internal Server Error' }), 'HTTP 500 Internal Server Error', '']
  ];

  test.each(cases)('%s', async (_, response, message, body) => {
    mockFetch((request) => (pathOf(request) === '/version' ? defaultHandler(request) : response.clone()));
    const error = await new BusyBarClient().GET('/status').catch((e: unknown) => e);
    expect(error).toBeInstanceOf(Error);
    expect(error).toMatchObject({ message, status: response.status, statusText: response.statusText, body });
  });

  test('toFetchError without body', () => {
    expect(toFetchError(new Response(null, { status: 502, statusText: 'Bad Gateway' }), undefined)).toMatchObject({
      message: 'HTTP 502 Bad Gateway',
      body: ''
    });
  });
});

describe('response data', () => {
  test('parseAs blob', async () => {
    mockFetch((request) => (pathOf(request) === '/version' ? defaultHandler(request) : new Response(new Uint8Array([1, 2, 3]))));
    const data = await new BusyBarClient().GET('/screen', { params: { query: { display: 0 } }, parseAs: 'blob' });
    expect(data).toBeInstanceOf(Blob);
    expect(new Uint8Array(await data.arrayBuffer())).toEqual(new Uint8Array([1, 2, 3]));
  });

  test('query params and JSON body are sent', async () => {
    const { requests } = mockFetch();
    const client = new BusyBarClient();
    await client.POST('/display/brightness', { params: { query: { value: '50' } } });
    await client.request('POST', '/display/draw', { body: drawBody });
    expect(requests[1]?.url).toBe('http://10.0.4.20/api/display/brightness?value=50');
    expect(requests[2]?.headers['content-type']).toBe('application/json');
    expect(JSON.parse(decode(requests[2]?.body) ?? '')).toEqual(drawBody);
  });
});

describe('apiClient', () => {
  test('is the raw transport: no core headers, no version negotiation, errors are returned', async () => {
    const { requests } = mockFetch(() => json({ error: 'bad' }, { status: 500 }));
    const result = await new BusyBarClient({ token: 'secret' }).apiClient.GET('/status');
    expect(result.error).toEqual({ error: 'bad' });
    expect(requests.map(pathOf)).toEqual(['/status']);
    expect(requests[0]?.headers).not.toHaveProperty('authorization');
  });
});

describe('transport', () => {
  const base = 'http://10.0.4.20/api/';

  test('path parameters are substituted and encoded', async () => {
    const { requests } = mockFetch();
    await sendRequest(base, 'DELETE', '/access/tokens/{short_id}', { params: { path: { short_id: 'a b/c' } } });
    expect(requests[0]?.url).toBe('http://10.0.4.20/api/access/tokens/a%20b%2Fc');
  });

  test('query: values encoded, arrays as repeated keys, undefined and null skipped', async () => {
    const { requests } = mockFetch();
    await sendRequest(base, 'GET', '/storage/list', { params: { query: { path: '/ext/a b', n: 1, flag: false, ids: [1, 2], skip: undefined, none: null } } });
    await sendRequest(base, 'GET', '/status', { params: { query: { skip: undefined } } });
    expect(requests.map((r) => r.url)).toEqual([
      'http://10.0.4.20/api/storage/list?path=%2Fext%2Fa%20b&n=1&flag=false&ids=1&ids=2',
      'http://10.0.4.20/api/status'
    ]);
  });

  test('headers: names are case-insensitive, null drops, arrays join, core headers win', async () => {
    const { requests } = mockFetch();
    await sendRequest(base, 'POST', '/display/draw', { body: {}, headers: { 'Content-Type': null, Accept: ['a', 'b'], 'X-Num': 1 } });
    await sendRequest(
      base,
      'POST',
      '/update',
      { body: new Blob(['x']), headers: new Headers({ 'Content-Type': 'application/octet-stream' }) },
      { authorization: 'Bearer core' }
    );
    await sendRequest(base, 'GET', '/status', { headers: { Authorization: 'Bearer init' } }, { authorization: 'Bearer core' });
    expect(requests[0]?.headers).toEqual({ accept: 'a, b', 'x-num': '1', 'content-type': 'text/plain;charset=UTF-8' });
    expect(requests[1]?.headers).toEqual({ authorization: 'Bearer core', 'content-type': 'application/octet-stream' });
    expect(requests[2]?.headers).toEqual({ authorization: 'Bearer core' });
  });

  test('a body gets Content-Type application/json, FormData its own, no body none', async () => {
    const { requests } = mockFetch();
    await sendRequest(base, 'POST', '/display/draw', { body: { a: 1 } });
    await sendRequest(base, 'POST', '/display/draw', { body: new FormData() });
    await sendRequest(base, 'GET', '/status');
    expect(requests[0]?.headers['content-type']).toBe('application/json');
    expect(decode(requests[0]?.body)).toBe('{"a":1}');
    expect(requests[1]?.headers['content-type']).toMatch(/^multipart\/form-data; boundary=/);
    expect(requests[2]?.headers).toEqual({});
  });

  test.each([
    ['json', { a: 1 }],
    ['text', '{"a":1}'],
    ['arrayBuffer', new TextEncoder().encode('{"a":1}').buffer]
  ] as const)('parseAs %s', async (parseAs, data) => {
    mockFetch(() => json({ a: 1 }));
    expect((await sendRequest(base, 'GET', '/status', { parseAs })).data).toEqual(data);
  });

  test('parseAs stream returns the body as is', async () => {
    mockFetch(() => json({ a: 1 }));
    const { data } = await sendRequest(base, 'GET', '/status', { parseAs: 'stream' });
    expect(data).toBeInstanceOf(ReadableStream);
  });

  test('204 and Content-Length 0 give no data and no error', async () => {
    mockFetch((request) =>
      pathOf(request) === '/status' ? new Response(null, { status: 204 }) : new Response('', { status: 500, headers: { 'Content-Length': '0' } })
    );
    expect(await sendRequest(base, 'GET', '/status')).toMatchObject({ data: undefined, response: { status: 204 } });
    expect(await sendRequest(base, 'GET', '/version')).toMatchObject({ error: undefined, response: { status: 500 } });
  });

  test('error body is JSON when it parses, text otherwise', async () => {
    mockFetch((request) => (pathOf(request) === '/status' ? text('{"error":"bad"}', { status: 500 }) : text('oops', { status: 500 })));
    expect((await sendRequest(base, 'GET', '/status')).error).toEqual({ error: 'bad' });
    expect((await sendRequest(base, 'GET', '/version')).error).toBe('oops');
  });

  test('a request without a body has no body key', async () => {
    // The device firmware sends a present but undefined `body` as the text "undefined".
    mockFetch();
    await sendRequest(base, 'GET', '/status');
    await sendRequest(base, 'POST', '/display/draw', { body: drawBody });
    const inits = vi.mocked(fetch).mock.calls.map(([, init]) => init as RequestInit);
    expect('body' in inits[0]!).toBe(false);
    expect(inits[1]?.body).toBe(JSON.stringify(drawBody));
  });

  test('init.signal is used unless the core passes its own', async () => {
    mockFetch((request) => hang(request.signal));
    const controller = new AbortController();
    const pending = sendRequest(base, 'GET', '/status', { signal: controller.signal });
    controller.abort();
    await expect(pending).rejects.toMatchObject({ name: 'AbortError' });
  });

  test('apiClient.request is the same as the method shortcuts', async () => {
    const { requests } = mockFetch();
    const { apiClient } = new BusyBarClient();
    const result = await apiClient.request('POST', '/display/draw', { body: drawBody });
    expect(result.data).toEqual({ result: 'OK' });
    expect(requests.map((r) => `${r.method} ${pathOf(r)}`)).toEqual(['POST /display/draw']);
  });
});

describe('BusyBarAppClient', () => {
  test('requests go to localhost, without version negotiation and core headers', async () => {
    const { requests } = mockFetch();
    const data = await new BusyBarAppClient().GET('/status');
    expect(data).toEqual({ result: 'OK' });
    expect(requests.map((r) => r.url)).toEqual(['http://localhost/api/status']);
    expect(requests[0]?.headers).toEqual({});
  });

  test('addr sets the device address', async () => {
    const { requests } = mockFetch();
    await new BusyBarAppClient({ addr: '10.0.4.20' }).request('POST', '/display/draw', { body: drawBody });
    expect(requests.map((r) => `${r.method} ${r.url}`)).toEqual(['POST http://10.0.4.20/api/display/draw']);
    expect(JSON.parse(decode(requests[0]?.body) ?? '')).toEqual(drawBody);
  });

  test('a non-2xx response is thrown as FetchError', async () => {
    mockFetch(() => json({ error: 'bad' }, { status: 400, statusText: 'Bad Request' }));
    await expect(new BusyBarAppClient().GET('/status')).rejects.toMatchObject({
      message: 'bad',
      status: 400,
      statusText: 'Bad Request',
      body: { error: 'bad' }
    });
  });

  test('timeout and signal are ignored with a warning, once per client', async () => {
    const { requests } = mockFetch();
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const set = vi.spyOn(globalThis, 'setTimeout');
    const client = new BusyBarAppClient();
    await client.GET('/status', { timeout: 10 } as never);
    await client.GET('/status', { signal: AbortSignal.timeout(10) } as never);
    expect(requests).toHaveLength(2);
    expect(warn.mock.calls).toEqual([['BusyBarAppClient ignores timeout and signal: the BUSY Bar firmware cannot cancel a request']]);
    expect(set).not.toHaveBeenCalled();
    warn.mockRestore();
    set.mockRestore();
  });

  test('a function without options does not warn', async () => {
    mockFetch(() => new Response('a'));
    const warn = vi.spyOn(console, 'warn');
    // storageRead passes `timeout: undefined` and `signal: undefined`.
    await storageRead(new BusyBarAppClient(), { path: '/ext/a' });
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });

  test('a firmware rejection, a bare string, becomes an Error, named TimeoutError for the inactivity timeout', async () => {
    vi.stubGlobal('fetch', () => Promise.reject('Inactivity timeout'));
    const timeout = await new BusyBarAppClient().GET('/status').catch((error: unknown) => error);
    expect(timeout).toBeInstanceOf(Error);
    expect(timeout).toMatchObject({ name: 'TimeoutError', message: 'Inactivity timeout' });

    vi.stubGlobal('fetch', () => Promise.reject('Failed to connect to server'));
    const failed = await new BusyBarAppClient().GET('/status').catch((error: unknown) => error);
    expect(failed).toBeInstanceOf(Error);
    expect(failed).toMatchObject({ name: 'Error', message: 'Failed to connect to server' });
  });
});

describe('getters', () => {
  test.each(['addr', 'apiSemver', 'apiClient'])('%s cannot be assigned', (key) => {
    const client = new BusyBarClient() as unknown as Record<string, unknown>;
    expect(() => {
      client[key] = 'x';
    }).toThrow(TypeError);
  });
});

describe('request body', () => {
  const base = 'http://10.0.4.20/api/';
  const octetStream = { 'Content-Type': 'application/octet-stream' };

  test.each([
    ['Blob', new Blob(['ab'])],
    ['File', new File(['ab'], 'a.txt')],
    ['ArrayBuffer', new TextEncoder().encode('ab').buffer],
    ['Uint8Array', new TextEncoder().encode('ab')],
    ['Buffer', Buffer.from('ab')],
    ['string', 'ab']
  ])('%s with application/octet-stream is sent as is', async (_, body) => {
    const { requests } = mockFetch();
    await sendRequest(base, 'POST', '/storage/write', { body, headers: octetStream });
    expect(decode(requests[0]?.body)).toBe('ab');
  });

  test('anything else is sent as JSON', async () => {
    const { requests } = mockFetch();
    const bare = Object.assign(Object.create(null) as object, { a: 1 });
    for (const body of [{ a: 1 }, [1, 2], 'ab', 3, null, bare]) {
      await sendRequest(base, 'POST', '/display/draw', { body });
    }
    expect(requests.map((r) => decode(r.body))).toEqual(['{"a":1}', '[1,2]', '"ab"', '3', 'null', '{"a":1}']);
  });
});
