/**
 * Error thrown for a non-2xx response, with the HTTP status and the response body attached.
 */
export interface FetchError<T = unknown> extends Error {
  status: number;
  statusText: string;
  body: T;
}

/**
 * Builds a FetchError from a failed response and its body, which the transport has already read and parsed (JSON when it parses, text otherwise).
 * @param {Response} response - The failed response.
 * @param {unknown} body - The parsed response body, `undefined` when the body is empty.
 * @returns {FetchError} The error to throw.
 */
export function toFetchError(response: Response, body: unknown): FetchError {
  const errorBody = body ?? '';
  const fields = errorBody as { error?: string; message?: string };
  const msg = typeof errorBody === 'object' && errorBody !== null ? fields.error || fields.message : typeof errorBody === 'string' ? errorBody : undefined;

  return Object.assign(new Error(msg || `HTTP ${response.status} ${response.statusText}`), {
    status: response.status,
    statusText: response.statusText,
    body: errorBody
  });
}
