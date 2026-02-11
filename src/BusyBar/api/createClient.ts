import createClient from "openapi-fetch";
import type { Client, Middleware } from "openapi-fetch";
import type { paths, components } from "Global/API";
import type { ApiKey, ApiSemver } from "Global/types";
import type { BusyBarConfig } from "BusyBar/index";

/**
 * Universal body serializer for different body types:
 * FormData, Buffer, File, Blob, ArrayBuffer, ArrayBufferView, URLSearchParams, JSON
 */
const bodySerializer = (body: unknown, headers?: HeadersInit) => {
  // FormData
  if (typeof FormData !== "undefined" && body instanceof FormData) {
    return body;
  }

  // Buffer (Node.js)
  if (
    typeof Buffer !== "undefined" &&
    typeof Buffer.isBuffer === "function" &&
    Buffer.isBuffer(body)
  ) {
    return body as Buffer;
  }

  // File (inherits from Blob)
  if (typeof File !== "undefined" && body instanceof File) {
    return body;
  }

  // Blob
  if (typeof Blob !== "undefined" && body instanceof Blob) {
    return body;
  }

  // ArrayBuffer
  if (typeof ArrayBuffer !== "undefined" && body instanceof ArrayBuffer) {
    return body;
  }

  // ArrayBufferView (example, Uint8Array)
  if (
    typeof ArrayBuffer !== "undefined" &&
    ArrayBuffer.isView &&
    ArrayBuffer.isView(body)
  ) {
    return body as ArrayBufferView;
  }

  let contentType: string | undefined;
  if (headers) {
    if (headers instanceof Headers) {
      contentType =
        headers.get("Content-Type") ?? headers.get("content-type") ?? undefined;
    } else if (typeof headers === "object") {
      contentType =
        (headers as Record<string, string>)["Content-Type"] ??
        (headers as Record<string, string>)["content-type"];
    }

    // URLSearchParams
    if (contentType === "application/x-www-form-urlencoded") {
      if (
        body &&
        typeof body === "object" &&
        !(body instanceof URLSearchParams)
      ) {
        return new URLSearchParams(body as Record<string, string>).toString();
      }
      return String(body);
    }
  }

  // Any
  return JSON.stringify(body);
};

type GetVersionFn = () => Promise<components["schemas"]["VersionInfo"]>;
/**
 * Function to fetch API version info (provided during init)
 */
let getApiVersionFn: GetVersionFn | undefined = undefined;
/**
 * Current cached API semver (X-API-Sem-Ver header value)
 */
let apiSemver: ApiSemver | undefined = undefined;

/**
 * Custom FetchError with HTTP status and body attached
 */
interface FetchError<T = unknown> extends Error {
  status: number;
  statusText: string;
  body: T;
}

/**
 * Promise for an ongoing `/version` request ("in flight")
 * Prevents multiple parallel requests to `/version`
 */
let inFlight: Promise<void> | null = null;

/**
 * Ensure that `apiSemver` is set
 * If not -> fetch `/version`
 * Uses `inFlight` to deduplicate concurrent requests
 */
async function ensureVersion(): Promise<void> {
  if (apiSemver) {
    return;
  }
  if (!getApiVersionFn) {
    throw new Error("getApiVersionFn is not set");
  }

  if (!inFlight) {
    inFlight = (async () => {
      const v = await getApiVersionFn!();
      if (!v.api_semver) {
        throw new Error("Empty API version");
      }
      apiSemver = v.api_semver;
    })().finally(() => {
      inFlight = null;
    });
  }
  await inFlight;
}

/**
 * Convert a `Response` into a FetchError with parsed body (json or text)
 */
async function toFetchError(res: Response): Promise<FetchError> {
  const ct = res.headers.get("content-type") || "";
  const isJson = ct.includes("application/json");
  const body = isJson ? await res.clone().json() : await res.clone().text();
  const msg =
    typeof body === "object" && body !== null
      ? (body as any).error || (body as any).message
      : typeof body === "string"
        ? body
        : undefined;

  return Object.assign(
    new Error(msg || `HTTP ${res.status} ${res.statusText}`),
    {
      status: res.status,
      statusText: res.statusText,
      body,
    },
  );
}

let apiKey: ApiKey | undefined = undefined;
function setApiKey(key: ApiKey) {
  apiKey = key;
}

let bearerToken: string | undefined = undefined;

/**
 * Middleware:
 *  - Adds `X-API-Sem-Ver` header to all requests except `/version`
 *  - On 405 (Incompatible API version):
 *      -> resets version
 *      -> refetches `/version`
 *      -> retries the request once with new semver
 */
const middleware: Middleware = {
  async onRequest({ request, schemaPath }) {
    if (bearerToken) {
      request.headers.set("Authorization", `Bearer ${bearerToken}`);
    }

    if (schemaPath !== "/version") {
      await ensureVersion();
      if (apiSemver) {
        request.headers.set("X-API-Sem-Ver", apiSemver);
      }
      if (apiKey) {
        request.headers.set("X-API-Token", apiKey);
      }
    }

    return request;
  },
  async onResponse({ request, response, options, schemaPath }) {
    if (response.ok) {
      return response;
    }

    if (schemaPath === "/version") {
      throw await toFetchError(response);
    }

    if (response.status !== 405) {
      throw await toFetchError(response);
    }

    apiSemver = undefined;
    await ensureVersion();

    if (apiSemver) {
      request.headers.set("X-API-Sem-Ver", apiSemver);
    }
    if (bearerToken) {
      request.headers.set("Authorization", `Bearer ${bearerToken}`);
    }

    const retried = await (options.fetch ?? fetch)(request);

    if (retried.ok) {
      return retried;
    }

    throw await toFetchError(retried);
  },
};

/**
 * Global API client instance
 */
let client: Client<paths, `${string}/${string}`> | null = null;

/**
 * Initialize API client with baseUrl and version fetch function
 */
function initApiClient(
  url: string,
  getApiVersion: GetVersionFn,
  token: BusyBarConfig["token"],
) {
  getApiVersionFn = getApiVersion;

  bearerToken = token ?? undefined;

  client = createClient<paths>({
    baseUrl: url,
    bodySerializer,
  });

  client.use(middleware);
}

/**
 * Get the initialized API client instance.
 * @throws {Error} If the client is not initialized.
 */
function getClient() {
  if (!client) {
    throw new Error("API client is not initialized");
  }
  return client;
}

/**
 * Wrapper for requests with timeout support
 * @param requestFn Function that performs the request, accepting a signal
 * @param timeoutMs Timeout in milliseconds (optional). If 0 or undefined, no timeout is applied.
 * @returns Promise with the result of the request
 */
async function withTimeout<T>(
  requestFn: (signal?: AbortSignal) => Promise<T>,
  timeoutMs: number = 3000,
): Promise<T> {
  if (timeoutMs <= 0) {
    return await requestFn();
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await requestFn(controller.signal);
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(`Request timed out after ${timeoutMs}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export { initApiClient, client, setApiKey, withTimeout, getClient };
