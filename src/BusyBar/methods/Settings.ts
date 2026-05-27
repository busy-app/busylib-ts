import {
  getHttpAccess as getHttpAccessApi,
  setHttpAccess as setHttpAccessApi,
  getName as getNameApi,
  setName as setNameApi,
  HttpAccessParams,
  NameParams
} from 'BusyBar/api/settings';
import type { RequestOptions, SuccessResponse, HttpAccessInfo, NameInfo } from 'BusyBar/types';
import { BusyBar } from 'BusyBar/index';

export class SettingsMethods {
  /**
   * Get HTTP API access over Wi-Fi configuration.
   *
   * @param {RequestOptions} [params] - Optional parameters.
   *   @param {RequestOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<HttpAccessInfo>} A promise that resolves to the access configuration.
   */
  async SettingsAccessGet(this: BusyBar, params?: RequestOptions): Promise<HttpAccessInfo> {
    return await getHttpAccessApi(this.apiClient, params);
  }

  /**
   * Set HTTP API access over Wi-Fi configuration.
   *
   * @param {HttpAccessParams} params - Access parameters:
   *   @param {HttpAccessParams['mode']} params.mode - Enable/disable access.
   *   @param {HttpAccessParams['key']} [params.key] - Access key (4-10 digits).
   *   @param {HttpAccessParams['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {HttpAccessParams['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves on success.
   */
  async SettingsAccessSet(this: BusyBar, params: HttpAccessParams): Promise<SuccessResponse> {
    const result = await setHttpAccessApi(this.apiClient, params);

    if (params.mode === 'key' && params.key) {
      this.setApiKey(params.key);
    }

    return result;
  }

  /**
   * Get current device name.
   *
   * @param {RequestOptions} [params] - Optional parameters.
   *   @param {RequestOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<NameInfo>} A promise that resolves to the device name.
   */
  async SettingsNameGet(this: BusyBar, params?: RequestOptions): Promise<NameInfo> {
    return await getNameApi(this.apiClient, params);
  }

  /**
   * Set device name.
   *
   * @param {NameParams} params - Name parameters:
   *   @param {NameParams['name']} params.name - New device name (max 64 chars).
   *   @param {NameParams['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {NameParams['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves on success.
   */
  async SettingsNameSet(this: BusyBar, params: NameParams): Promise<SuccessResponse> {
    return await setNameApi(this.apiClient, params);
  }
}
