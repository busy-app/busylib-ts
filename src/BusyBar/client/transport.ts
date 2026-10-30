import type { ApiClient, HttpMethod } from './types';
import type { ParseAs } from './types.internal';

/** What the transport reads from a request init; anything else in it is ignored. */
export interface SendInit {
  params?: { path?: Record<string, unknown>; query?: Record<string, unknown> };
  body?: unknown;
  headers?: unknown;
  parseAs?: ParseAs;
  signal?: AbortSignal;
}

export interface TransportResult {
  data?: unknown;
  error?: unknown;
  response: Response;
}

/**
 * Creates the raw transport for the given base URL.
 * @param {string} baseUrl - Base URL all endpoint paths are appended to.
 * @returns {ApiClient} `GET`/`POST`/`PUT`/`DELETE`/`request` returning `{ data, error, response }`.
 */
export function createTransport(baseUrl: string): ApiClient {
  const method = (name: HttpMethod) => (path: string, init?: SendInit) => sendRequest(baseUrl, name, path, init);

  return {
    request: (name: HttpMethod, path: string, init?: SendInit) => sendRequest(baseUrl, name, path, init),
    GET: method('GET'),
    POST: method('POST'),
    PUT: method('PUT'),
    DELETE: method('DELETE')
  } as unknown as ApiClient;
}

/**
 * Sends one request with the native fetch and reads the response. Kept lean: on the device every line of it runs in JerryScript for each request.
 * @param {string} baseUrl - Base URL all endpoint paths are appended to, with or without a trailing slash.
 * @param {HttpMethod} method - HTTP method.
 * @param {string} path - Endpoint path, e.g. `/display/draw` or `/busy/profiles/{slot}`.
 * @param {SendInit} [init] - `params`, `body`, `headers`, `parseAs`, `signal`.
 * @param {Record<string, string>} [coreHeaders] - Headers set over `init.headers`, with lowercase names.
 * @param {AbortSignal} [signal] - Signal used instead of `init.signal`.
 * @returns {Promise<TransportResult>} The parsed data of a successful response, or the parsed body of a failed one as `error`.
 */
export async function sendRequest(
  baseUrl: string,
  method: HttpMethod,
  path: string,
  init?: SendInit,
  coreHeaders?: Record<string, string>,
  signal?: AbortSignal
): Promise<TransportResult> {
  const body = init?.body;
  const headers: Record<string, string> = {};

  // JSON unless the caller says otherwise; FormData sets its own boundary.
  if (body !== undefined && !(typeof FormData !== 'undefined' && body instanceof FormData)) {
    headers['content-type'] = 'application/json';
  }
  mergeHeaders(headers, init?.headers);
  if (coreHeaders) {
    for (const name in coreHeaders) {
      headers[name] = coreHeaders[name]!;
    }
  }

  const requestInit: RequestInit = { method, headers, signal: signal ?? init?.signal };
  // Only a real body: the device firmware sends a `body` key that is present but undefined as the text "undefined".
  if (body !== undefined) {
    requestInit.body = serialize(body, headers);
  }

  const response = await fetch(buildUrl(baseUrl, path, init?.params), requestInit);

  if (response.status === 204 || response.headers.get('Content-Length') === '0') {
    return response.ok ? { data: undefined, response } : { error: undefined, response };
  }

  if (response.ok) {
    const parseAs = init?.parseAs ?? 'json';
    return { data: parseAs === 'stream' ? response.body : await response[parseAs](), response };
  }

  // The error body is JSON when it parses, text otherwise.
  let error: unknown = await response.text();
  try {
    error = JSON.parse(error as string);
  } catch {
    // Not JSON: keep the text.
  }
  return { error, response };
}

// The usual body, a plain object or array, goes to JSON first. A body fetch takes itself goes as it is: binary data, form data, or a string sent as something other than JSON. Anything else is JSON.
function serialize(body: unknown, headers: Record<string, string>): BodyInit {
  if (typeof body === 'object' && body !== null && (Array.isArray(body) || Object.getPrototypeOf(body) === Object.prototype)) {
    return JSON.stringify(body);
  }
  if (isRawBody(body) || (typeof body === 'string' && !headers['content-type']?.includes('json'))) {
    return body as BodyInit;
  }
  return JSON.stringify(body);
}

// The device firmware has no Blob, FormData or URLSearchParams, hence the typeof checks; Buffer and Uint8Array are ArrayBuffer views.
function isRawBody(body: unknown): boolean {
  return (
    body instanceof ArrayBuffer ||
    ArrayBuffer.isView(body) ||
    (typeof Blob !== 'undefined' && body instanceof Blob) ||
    (typeof FormData !== 'undefined' && body instanceof FormData) ||
    (typeof URLSearchParams !== 'undefined' && body instanceof URLSearchParams)
  );
}

// Header names are lowercased so the same header from several sources ends up once; `null` drops a header and an array sends several values.
function mergeHeaders(target: Record<string, string>, source: unknown): void {
  if (!source || typeof source !== 'object') {
    return;
  }

  if ((typeof Headers !== 'undefined' && source instanceof Headers) || Array.isArray(source)) {
    for (const [name, value] of source as Iterable<[string, string]>) {
      target[name.toLowerCase()] = value;
    }
    return;
  }

  const record = source as Record<string, unknown>;
  for (const name in record) {
    const value = record[name];
    const key = name.toLowerCase();
    if (value === null) {
      delete target[key];
    } else if (Array.isArray(value)) {
      target[key] = value.join(', ');
    } else if (value !== undefined) {
      target[key] = String(value);
    }
  }
}

// Path parameters are substituted into `{name}`, query parameters appended with arrays as repeated keys; `undefined` and `null` values are skipped.
function buildUrl(baseUrl: string, path: string, params: SendInit['params']): string {
  let url = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) + path : baseUrl + path;

  const pathParams = params?.path;
  if (pathParams) {
    url = url.replace(/\{([^}]+)\}/g, (match, name: string) => {
      const value = pathParams[name];
      return value === undefined || value === null ? match : encodeURIComponent(String(value));
    });
  }

  const query = params?.query;
  if (query) {
    let search = '';
    for (const name in query) {
      const value = query[name];
      if (value === undefined || value === null) {
        continue;
      }
      if (Array.isArray(value)) {
        for (const item of value) {
          search += `&${name}=${encodeURIComponent(String(item))}`;
        }
      } else {
        search += `&${name}=${encodeURIComponent(String(value))}`;
      }
    }
    if (search) {
      url += `?${search.slice(1)}`;
    }
  }

  return url;
}
