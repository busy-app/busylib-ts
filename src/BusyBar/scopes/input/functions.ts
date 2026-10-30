import type { RequestClient } from 'BusyBar/client/types';
import type { RequestOptionsFor } from 'BusyBar/client/types.internal';
import type { InputKeyParams } from 'BusyBar/scopes/input/types';
import type { SuccessResponse } from 'BusyBar/types';

/**
 * Send input event. Send single key press event.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {InputKeyParams} params - Button press parameters:
 *   @param {InputKeyParams['key']} params.key - Key name.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<SuccessResponse>} A promise that resolves on success.
 */
export async function inputSend<C extends RequestClient>(client: C, params: InputKeyParams, options?: RequestOptionsFor<C>): Promise<SuccessResponse> {
  const { key } = params;

  return client.POST('/input', {
    params: {
      query: {
        key
      }
    },
    ...options
  });
}
