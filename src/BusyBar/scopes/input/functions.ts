import type { BusyBarClient } from 'BusyBar/client/BusyBarClient';
import type { RequestOptions } from 'BusyBar/client/types';
import type { InputKeyParams } from 'BusyBar/scopes/input/types';
import type { SuccessResponse } from 'BusyBar/types';

/**
 * Send input event. Send single key press event.
 *
 * @param {BusyBarClient} client - BUSY Bar client.
 * @param {InputKeyParams} params - Button press parameters:
 *   @param {InputKeyParams['key']} params.key - Key name.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<SuccessResponse>} A promise that resolves on success.
 */
export async function inputSend(client: BusyBarClient, params: InputKeyParams, options?: RequestOptions): Promise<SuccessResponse> {
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
