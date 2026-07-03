import { setInputKey as setInputKeyApi } from 'BusyBar/api/input';
import type { RequestOptions, SuccessResponse, InputKeyParams } from 'BusyBar/types';
import { BusyBar } from 'BusyBar/index';

export class InputMethods {
  /**
   * Send input event. Send single key press event.
   *
   * @param {InputKeyParams} params - Button press parameters:
   *   @param {InputKeyParams['key']} params.key - Key name.
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves on success.
   */
  async InputSend(this: BusyBar, params: InputKeyParams, options?: RequestOptions): Promise<SuccessResponse> {
    return await setInputKeyApi(this.apiClient, params, options);
  }
}
