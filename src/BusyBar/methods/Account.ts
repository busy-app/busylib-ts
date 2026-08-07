import {
  getAccountState as getAccountStateApi,
  getAccountInfo as getAccountInfoApi,
  getAccountBackend as getAccountBackendApi,
  setAccountBackend as setAccountBackendApi,
  unlinkDevice as unlinkDeviceApi,
  linkDevice as linkDeviceApi
} from 'BusyBar/api/account';
import type { RequestOptions, AccountInfo, SuccessResponse, AccountLink, AccountStatus, AccountBackend, AccountBackendSetParams } from 'BusyBar/types';
import { BusyBar } from 'BusyBar/index';

export class AccountMethods {
  /**
   * Get account info.
   *
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<AccountInfo>} A promise that resolves to the account information.
   */
  async AccountInfoGet(this: BusyBar, options?: RequestOptions): Promise<AccountInfo> {
    return await getAccountInfoApi(this.apiClient, options);
  }

  /**
   * Get account state.
   *
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<AccountStatus>} A promise that resolves to the account state.
   */
  async AccountStateGet(this: BusyBar, options?: RequestOptions): Promise<AccountStatus> {
    return await getAccountStateApi(this.apiClient, options);
  }

  /**
   * Get MQTT backend configuration.
   *
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<AccountBackend>} A promise that resolves to the MQTT backend configuration.
   */
  async AccountBackendGet(this: BusyBar, options?: RequestOptions): Promise<AccountBackend> {
    return await getAccountBackendApi(this.apiClient, options);
  }

  /**
   * Set MQTT backend configuration.
   *
   * @param {AccountBackendSetParams} params - Parameters for setting the MQTT backend configuration.
   *   @param {AccountBackendSetParams['server_url']} params.server_url - MQTT server URL.
   *   @param {AccountBackendSetParams['client_cert_type']} params.client_cert_type - Client certificate type.
   *   @param {AccountBackendSetParams['ignore_server_cert']} params.ignore_server_cert - Whether to ignore the server certificate.
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves on success.
   */
  async AccountBackendSet(this: BusyBar, params: AccountBackendSetParams, options?: RequestOptions): Promise<SuccessResponse> {
    return await setAccountBackendApi(this.apiClient, params, options);
  }

  /**
   * Unlink device from account. Removes association with the current account.
   *
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves on successful unlinking.
   */
  async AccountUnlink(this: BusyBar, options?: RequestOptions): Promise<SuccessResponse> {
    return await unlinkDeviceApi(this.apiClient, options);
  }

  /**
   * Link device to account. Requests account link PIN. Works only if device is connected to MQTT and is not linked to account.
   *
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<AccountLink>} A promise that resolves to the link information (e.g., PIN).
   */
  async AccountLink(this: BusyBar, options?: RequestOptions): Promise<AccountLink> {
    return await linkDeviceApi(this.apiClient, options);
  }
}
