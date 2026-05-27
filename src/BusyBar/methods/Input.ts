import { setInputKey as setInputKeyApi, InputKeyParams } from 'BusyBar/api/input';
import type { SuccessResponse } from 'BusyBar/types';
import { BusyBar } from 'BusyBar/index';

export class InputMethods {
  /**
   * Send input event. Send single key press event.
   *
   * @param {InputKeyParams} params - Button press parameters:
   *   @param {InputKeyParams['key']} params.key - Key name.
   *   @param {InputKeyParams['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {InputKeyParams['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves on success.
   */
  async InputSend(this: BusyBar, params: InputKeyParams): Promise<SuccessResponse> {
    return await setInputKeyApi(this.apiClient, params);
  }
}
