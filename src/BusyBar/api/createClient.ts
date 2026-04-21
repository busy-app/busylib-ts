import createClient from 'openapi-fetch';
import type { Client, Middleware } from 'openapi-fetch';
import type { paths, components } from 'Global/API';
import type { ApiKey, ApiSemver } from 'BusyBar/types/internal';
import type { BusyBarConfig } from 'BusyBar/types';

/**
 * Universal body serializer for different body types:
 * FormData, Buffer, File, Blob, ArrayBuffer, ArrayBufferView, URLSearchParams, JSON
 */
const bodySerializer = (body: unknown, headers?: HeadersInit) => {
  // FormData
  if (typeof FormData !== 'undefined' && body instanceof FormData) {
    return body;
  }

  // Buffer (Node.js)
  if (typeof Buffer !== 'undefined' && typeof Buffer.isBuffer === 'function' && Buffer.isBuffer(body)) {
    return body as Buffer;
  }

  // File (inherits from Blob)
  if (typeof File !== 'undefined' && body instanceof File) {
    return body;
  }

  // Blob
  if (typeof Blob !== 'undefined' && body instanceof Blob) {
    return body;
  }

  // ArrayBuffer
  if (typeof ArrayBuffer !== 'undefined' && body instanceof ArrayBuffer) {
    return body;
  }

  // ArrayBufferView (example, Uint8Array)
  if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView && ArrayBuffer.isView(body)) {
    return body as ArrayBufferView;
  }

  let contentType: string | undefined;
  if (headers) {
    if (headers instanceof Headers) {
      contentType = headers.get('Content-Type') ?? headers.get('content-type') ?? undefined;
    } else if (typeof headers === 'object') {
      contentType = (headers as Record<string, string>)['Content-Type'] ?? (headers as Record<string, string>)['content-type'];
    }

    // URLSearchParams
    if (contentType === 'application/x-www-form-urlencoded') {
      if (body && typeof body === 'object' && !(body instanceof URLSearchParams)) {
        return new URLSearchParams(body as Record<string, string>).toString();
      }
      return String(body);
    }
  }

  // Any
  return JSON.stringify(body);
};

type GetVersionFn = () => Promise<components['schemas']['VersionInfo']>;

/**
 * Custom FetchError with HTTP status and body attached
 */
interface FetchError<T = unknown> extends Error {
  status: number;
  statusText: string;
  body: T;
}

/**
 * Convert a `Response` into a FetchError with parsed body (json or text)
 */
async function toFetchError(res: Response): Promise<FetchError> {
  const ct = res.headers.get('content-type') || '';
  const isJson = ct.includes('application/json');
  const body = isJson ? await res.clone().json() : await res.clone().text();
  const msg = typeof body === 'object' && body !== null ? (body as any).error || (body as any).message : typeof body === 'string' ? body : undefined;

  return Object.assign(new Error(msg || `HTTP ${res.status} ${res.statusText}`), {
    status: res.status,
    statusText: res.statusText,
    body
  });
}

export type BusyBarClient = Client<paths, `${string}/${string}`> & {
  withTimeout: <T>(requestFn: (signal?: AbortSignal) => Promise<T>, timeoutMs?: number) => Promise<T>;
};

/**
 * Initialize API client with baseUrl and version fetch function
 */
function createApiClient(url: string, getApiVersion: GetVersionFn, token: BusyBarConfig['token'], defaultTimeout: number = 3000) {
  let apiSemver: ApiSemver | undefined = undefined;
  let bearerToken: string | undefined = token ?? undefined;
  let apiKey: ApiKey | undefined = undefined;

  /**
   * Promise for an ongoing `/version` request ("in flight")
   * Prevents multiple parallel requests to `/version`
   */
  let inFlight: Promise<void> | null = null;

  const ensureVersion = async (): Promise<void> => {
    if (apiSemver) {
      return;
    }

    if (!inFlight) {
      inFlight = (async () => {
        const v = await getApiVersion();
        if (!v.api_semver) {
          throw new Error('Empty API version');
        }
        apiSemver = v.api_semver;
      })().finally(() => {
        inFlight = null;
      });
    }
    await inFlight;
  };

  const middleware: Middleware = {
    async onRequest({ request, schemaPath }) {
      if (bearerToken) {
        request.headers.set('Authorization', `Bearer ${bearerToken}`);
      }

      if (schemaPath !== '/version') {
        await ensureVersion();
        if (apiSemver) {
          request.headers.set('X-API-Sem-Ver', apiSemver);
        }
        if (apiKey) {
          request.headers.set('X-API-Token', apiKey);
        }
      }

      return request;
    },
    async onResponse({ request, response, options, schemaPath }) {
      if (response.ok) {
        return response;
      }

      if (schemaPath === '/version') {
        throw await toFetchError(response);
      }

      if (response.status !== 405) {
        throw await toFetchError(response);
      }

      apiSemver = undefined;
      await ensureVersion();

      if (apiSemver) {
        request.headers.set('X-API-Sem-Ver', apiSemver);
      }
      if (bearerToken) {
        request.headers.set('Authorization', `Bearer ${bearerToken}`);
      }

      const retried = await (options.fetch ?? fetch)(request);

      if (retried.ok) {
        return retried;
      }

      throw await toFetchError(retried);
    }
  };

  const client = createClient<paths>({
    baseUrl: url,
    bodySerializer
  }) as BusyBarClient;

  client.withTimeout = async <T>(requestFn: (signal?: AbortSignal) => Promise<T>, timeoutMs: number = defaultTimeout): Promise<T> => {
    if (timeoutMs <= 0) {
      return await requestFn();
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      return await requestFn(controller.signal);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new Error(`Request timed out after ${timeoutMs}ms`);
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  };

  client.use(middleware);

  return {
    client,
    setApiKey: (key: ApiKey) => {
      apiKey = key;
    },
    setToken: (token: string) => {
      bearerToken = token;
    }
  };
}

export { createApiClient };
