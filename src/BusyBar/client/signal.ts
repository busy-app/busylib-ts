/**
 * Runs a request with one signal that combines the timeout and the caller's signal, and reports a caller abort as a plain `AbortError`.
 * @param {(signal?: AbortSignal) => Promise<T>} requestFn - The request to run with the combined signal.
 * @param {number} timeoutMs - Timeout in milliseconds, `0` disables it.
 * @param {AbortSignal} [externalSignal] - The caller's signal.
 * @returns {Promise<T>} The request result; a timeout rejects with `TimeoutError`, a caller abort with `AbortError`.
 */
export async function withSignal<T>(requestFn: (signal?: AbortSignal) => Promise<T>, timeoutMs: number, externalSignal?: AbortSignal): Promise<T> {
  const signals: AbortSignal[] = [];
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  if (timeoutMs > 0) {
    const timeoutController = new AbortController();
    timeoutId = setTimeout(() => timeoutController.abort(new DOMException(`Request timed out after ${timeoutMs}ms`, 'TimeoutError')), timeoutMs);
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
    clearTimeout(timeoutId);
  }
}
