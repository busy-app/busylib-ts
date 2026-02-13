import {
  getAccountState as getAccountStateApi,
  getAccountInfo as getAccountInfoApi,
  getAccountProfile as getAccountProfileApi,
  setAccountProfile as setAccountProfileApi,
  unlinkDevice as unlinkDeviceApi,
  linkDevice as linkDeviceApi,
  SetAccountProfileParams,
} from "BusyBar/api/account";
import type {
  TimeoutOptions,
  AccountInfo,
  SuccessResponse,
  AccountLink,
  AccountState,
  AccountProfile,
} from "Global/types";
import { BusyBar } from "BusyBar/index";

export class AccountMethods {
  /**
   * Get account info.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<AccountInfo>} A promise that resolves to the account information.
   */
  async AccountInfoGet(
    this: BusyBar,
    params?: TimeoutOptions,
  ): Promise<AccountInfo> {
    return await getAccountInfoApi(this.apiClient, params);
  }

  /**
   * @deprecated Use `AccountInfoGet` instead. will be removed in the next release.
   */
  async Account(this: BusyBar, params?: TimeoutOptions): Promise<AccountInfo> {
    return this.AccountInfoGet(params);
  }

  /**
   * Get account state.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<AccountState>} A promise that resolves to the account state.
   */
  async AccountStateGet(
    this: BusyBar,
    params?: TimeoutOptions,
  ): Promise<AccountState> {
    return await getAccountStateApi(this.apiClient, params);
  }

  /**
   * Get account profile.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<AccountProfile>} A promise that resolves to the account profile.
   */
  async AccountProfileGet(
    this: BusyBar,
    params?: TimeoutOptions,
  ): Promise<AccountProfile> {
    return await getAccountProfileApi(this.apiClient, params);
  }

  /**
   * Set account profile.
   *
   * @param {SetAccountProfileParams} params - Parameters for setting the account profile.
   *   @param {string} params.profile - Profile data string.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} A promise that resolves on success.
   */
  async AccountProfileSet(
    this: BusyBar,
    params: SetAccountProfileParams,
  ): Promise<SuccessResponse> {
    return await setAccountProfileApi(this.apiClient, params);
  }

  /**
   * Unlink device from account. Removes association with the current account.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} A promise that resolves on successful unlinking.
   */
  async AccountUnlink(
    this: BusyBar,
    params?: TimeoutOptions,
  ): Promise<SuccessResponse> {
    return await unlinkDeviceApi(this.apiClient, params);
  }

  /**
   * Link device to account. Requests account link PIN. Works only if device is connected to MQTT and is not linked to account.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<AccountLink>} A promise that resolves to the link information (e.g., PIN).
   */
  async AccountLink(
    this: BusyBar,
    params?: TimeoutOptions,
  ): Promise<AccountLink> {
    return await linkDeviceApi(this.apiClient, params);
  }
}
