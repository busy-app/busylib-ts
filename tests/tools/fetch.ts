import { vi } from 'vitest';

export interface RecordedRequest {
  method: string;
  url: string;
  headers: Record<string, string>;
  body: Uint8Array | undefined;
}

export type Handler = (request: Request) => Response | Promise<Response>;

export const API_SEMVER = '1.0.0';

export function json(body: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(body), { ...init, headers: { 'Content-Type': 'application/json', ...init?.headers } });
}

export function text(body: string, init?: ResponseInit): Response {
  return new Response(body, { ...init, headers: { 'Content-Type': 'text/plain', ...init?.headers } });
}

/**
 * Answers `/version` with API_SEMVER and every other endpoint with `{ result: 'OK' }`.
 * @param {Request} request - The intercepted request.
 * @returns {Response} The fixture response.
 */
export function defaultHandler(request: Request): Response {
  return pathOf(request) === '/version' ? json({ api_semver: API_SEMVER }) : json({ result: 'OK' });
}

/**
 * Endpoint path of a request without the `/api` or `/busybar` prefix, e.g. `/version`.
 * @param {Request | RecordedRequest} request - The request to read the path from.
 * @returns {string} The endpoint path.
 */
export function pathOf(request: Request | RecordedRequest): string {
  return new URL(request.url).pathname.replace(/^\/(api|busybar)/, '');
}

export function decode(body: Uint8Array | undefined): string | undefined {
  return body && new TextDecoder().decode(body);
}

/**
 * Never resolves and rejects with the abort reason once the signal is aborted, like a real fetch of a hanging request.
 * @param {AbortSignal} signal - The request signal.
 * @returns {Promise<never>} A promise that only rejects.
 */
export function hang(signal: AbortSignal): Promise<never> {
  return new Promise((_, reject) => signal.addEventListener('abort', () => reject(signal.reason), { once: true }));
}

/**
 * Replaces the global fetch with a recorder that answers through the handler; the transport reads the global fetch on every request.
 * @param {Handler} [handler] - Builds the response for each request.
 * @returns {{ requests: RecordedRequest[] }} Requests in the order they were sent.
 */
export function mockFetch(handler: Handler = defaultHandler): { requests: RecordedRequest[] } {
  const requests: RecordedRequest[] = [];

  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const request = input instanceof Request ? input : new Request(input, init);
      // A real fetch consumes the request body, so sending the same Request twice fails with TypeError: reading the original body keeps that behaviour, the handler gets a copy.
      const copy = request.clone();
      const body = request.body ? new Uint8Array(await request.arrayBuffer()) : undefined;
      requests.push({ method: request.method, url: request.url, headers: Object.fromEntries(request.headers), body });

      // A real fetch rejects with the abort reason when the signal is already aborted.
      copy.signal.throwIfAborted();

      return handler(copy);
    })
  );

  return { requests };
}
