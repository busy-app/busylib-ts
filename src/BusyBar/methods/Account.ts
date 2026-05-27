import {
  getAccountState as getAccountStateApi,
  getAccountInfo as getAccountInfoApi,
  getAccountProfile as getAccountProfileApi,
  setAccountProfile as setAccountProfileApi,
  unlinkDevice as unlinkDeviceApi,
  linkDevice as linkDeviceApi
} from 'BusyBar/api/account';
import type { RequestOptions, AccountInfo, SuccessResponse, AccountLink, AccountStatus, AccountProfile, AccountProfileSetParams } from 'BusyBar/types';
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
   * Get account profile.
   *
   * @param {RequestOptions} [params] - Optional parameters.
   *   @param {RequestOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<AccountProfile>} A promise that resolves to the account profile.
   */
  async AccountProfileGet(this: BusyBar, params?: RequestOptions): Promise<AccountProfile> {
    return await getAccountProfileApi(this.apiClient, params);
  }

  /**
   * Set account profile.
   *
   * @param {AccountProfileSetParams} params - Parameters for setting the account profile.
   *   @param {AccountProfileSetParams['profile']} params.profile - Profile name.
   *   @param {AccountProfileSetParams['custom_url']} [params.custom_url] - Custom profile URL.
   *   @param {AccountProfileSetParams['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {AccountProfileSetParams['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves on success.
   */
  async AccountProfileSet(this: BusyBar, params: AccountProfileSetParams): Promise<SuccessResponse> {
    return await setAccountProfileApi(this.apiClient, params);
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
