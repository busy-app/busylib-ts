import { setInputKey as setInputKeyApi, InputKeyParams } from 'BusyBar/api/input';
import type { SuccessResponse } from 'Global/types';
import { BusyBar } from 'BusyBar/index';

export class InputMethods {
  /**
   * Send input event. Send single key press event.
   *
   * @param {InputKeyParams} params - Button press parameters:
   *   @param {KeyName} params.keyName - Name of the key to press.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} A promise that resolves on success.
   */
  async InputSend(this: BusyBar, params: InputKeyParams): Promise<SuccessResponse> {
    return await setInputKeyApi(this.apiClient, params);
  }
}
