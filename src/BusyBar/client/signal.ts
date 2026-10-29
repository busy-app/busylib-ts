/**
 * Runs a request with one signal that combines the timeout and the caller's signal, and reports a caller abort as a plain `AbortError`.
 * @param {(signal?: AbortSignal) => Promise<T>} requestFn - The request to run with the combined signal.
 * @param {number} timeoutMs - Timeout in milliseconds, `0` disables it.
 * @param {AbortSignal} [externalSignal] - The caller's signal.
 * @returns {Promise<T>} The request result; a timeout rejects with `TimeoutError`, a caller abort with `AbortError`.
 */
export async function withSignal<T>(requestFn: (signal?: AbortSignal) => Promise<T>, timeoutMs: number, externalSignal?: AbortSignal): Promise<T> {
  // The device firmware has an AbortController stub and a fetch that takes no signal: the timeout can only reject, the request still runs to the end.
  if (!canAbort()) {
    return withTimeout(requestFn(externalSignal), timeoutMs);
  }

  const signals: AbortSignal[] = [];
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  if (timeoutMs > 0) {
    const timeoutController = new AbortController();
    timeoutId = setTimeout(() => timeoutController.abort(timeoutError(timeoutMs)), timeoutMs);
    signals.push(timeoutController.signal);
  }
  if (externalSignal) {
    signals.push(externalSignal);
  }

  const signal = signals.length > 1 ? AbortSignal.any(signals) : signals[0];

  try {
    return await requestFn(signal);
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError' && externalSignal?.aborted) {
      throw new DOMException('Request was aborted', 'AbortError');
    }
    throw error;
  } finally {
    // Only a timer that was set: the device logs an error for clearTimeout(undefined).
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
  }
}

/**
 * Rejects with `TimeoutError` when the request does not settle in time, without cancelling it: for runtimes where a request cannot be aborted.
 * @param {Promise<T>} request - The request already sent.
 * @param {number} timeoutMs - Timeout in milliseconds, `0` disables it.
 * @returns {Promise<T>} The request result, or a `TimeoutError` rejection; a late result is ignored.
 */
export function withTimeout<T>(request: Promise<T>, timeoutMs: number): Promise<T> {
  if (timeoutMs <= 0) {
    return request;
  }

  return new Promise<T>((resolve, reject) => {
    const timeoutId = setTimeout(() => reject(timeoutError(timeoutMs)), timeoutMs);
    request.then(
      (value) => {
        clearTimeout(timeoutId);
        resolve(value);
      },
      (error: unknown) => {
        clearTimeout(timeoutId);
        reject(error);
      }
    );
  });
}

// The device firmware defines AbortController as a stub without `abort`.
function canAbort(): boolean {
  return typeof AbortController === 'function' && typeof AbortController.prototype?.abort === 'function';
}

// A DOMException where it is real; the device firmware's DOMException is a stub without name and message.
function timeoutError(timeoutMs: number): Error {
  const message = `Request timed out after ${timeoutMs}ms`;
  const error = typeof DOMException === 'function' ? new DOMException(message, 'TimeoutError') : undefined;
  return error?.name === 'TimeoutError' ? error : Object.assign(new Error(message), { name: 'TimeoutError' });
}
