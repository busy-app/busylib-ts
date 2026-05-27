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
   * @param {RequestOptions} [params] - Optional parameters.
   *   @param {RequestOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<AccountInfo>} A promise that resolves to the account information.
   */
  async AccountInfoGet(this: BusyBar, params?: RequestOptions): Promise<AccountInfo> {
    return await getAccountInfoApi(this.apiClient, params);
  }

  /**
   * Get account state.
   *
   * @param {RequestOptions} [params] - Optional parameters.
   *   @param {RequestOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<AccountStatus>} A promise that resolves to the account state.
   */
  async AccountStateGet(this: BusyBar, params?: RequestOptions): Promise<AccountStatus> {
    return await getAccountStateApi(this.apiClient, params);
  }

  /**
   * Get MQTT backend configuration.
   *
   * @param {RequestOptions} [params] - Optional parameters.
   *   @param {RequestOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<AccountBackend>} A promise that resolves to the MQTT backend configuration.
   */
  async AccountBackendGet(this: BusyBar, params?: RequestOptions): Promise<AccountBackend> {
    return await getAccountBackendApi(this.apiClient, params);
  }

  /** @deprecated Use {@link AccountBackendGet} instead. */
  async AccountProfileGet(this: BusyBar, params?: RequestOptions): Promise<AccountBackend> {
    return await this.AccountBackendGet(params);
  }

  /**
   * Set MQTT backend configuration.
   *
   * @param {AccountBackendSetParams} params - Parameters for setting the MQTT backend configuration.
   *   @param {AccountBackendSetParams['server_url']} params.server_url - MQTT server URL.
   *   @param {AccountBackendSetParams['client_cert_type']} params.client_cert_type - Client certificate type.
   *   @param {AccountBackendSetParams['ignore_server_cert']} params.ignore_server_cert - Whether to ignore the server certificate.
   *   @param {AccountBackendSetParams['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {AccountBackendSetParams['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves on success.
   */
  async AccountBackendSet(this: BusyBar, params: AccountBackendSetParams): Promise<SuccessResponse> {
    return await setAccountBackendApi(this.apiClient, params);
  }

  /** @deprecated Use {@link AccountBackendSet} instead. */
  async AccountProfileSet(this: BusyBar, params: AccountBackendSetParams): Promise<SuccessResponse> {
    return await this.AccountBackendSet(params);
  }

  /**
   * Unlink device from account. Removes association with the current account.
   *
   * @param {RequestOptions} [params] - Optional parameters.
   *   @param {RequestOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves on successful unlinking.
   */
  async AccountUnlink(this: BusyBar, params?: RequestOptions): Promise<SuccessResponse> {
    return await unlinkDeviceApi(this.apiClient, params);
  }

  /**
   * Link device to account. Requests account link PIN. Works only if device is connected to MQTT and is not linked to account.
   *
   * @param {RequestOptions} [params] - Optional parameters.
   *   @param {RequestOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<AccountLink>} A promise that resolves to the link information (e.g., PIN).
   */
  async AccountLink(this: BusyBar, params?: RequestOptions): Promise<AccountLink> {
    return await linkDeviceApi(this.apiClient, params);
  }
}
