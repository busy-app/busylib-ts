import {
  getHttpAccess as getHttpAccessApi,
  setHttpAccess as setHttpAccessApi,
  getName as getNameApi,
  setName as setNameApi,
  HttpAccessParams,
  NameParams,
} from "BusyBar/api/settings";
import type {
  TimeoutOptions,
  SuccessResponse,
  HttpAccessInfo,
  NameInfo,
} from "Global/types";
import { BusyBar } from "BusyBar/index";

export class SettingsMethods {
  /**
   * Get HTTP API access over Wi-Fi configuration.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<HttpAccessInfo>} A promise that resolves to the access configuration.
   */
  async SettingsAccessGet(
    this: BusyBar,
    params?: TimeoutOptions,
  ): Promise<HttpAccessInfo> {
    return await getHttpAccessApi(params);
  }

  /**
   * @deprecated Use `SettingsAccessGet` instead. will be removed in the next release.
   */
  async SettingsAccess(
    this: BusyBar,
    params?: TimeoutOptions,
  ): Promise<HttpAccessInfo> {
    return this.SettingsAccessGet(params);
  }

  /**
   * Set HTTP API access over Wi-Fi configuration.
   *
   * @param {HttpAccessParams} params - Access parameters:
   *   @param {boolean} params.mode - Enable/disable access.
   *   @param {string} params.key - Access key (4-10 digits).
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} A promise that resolves on success.
   */
  async SettingsAccessSet(
    this: BusyBar,
    params: HttpAccessParams,
  ): Promise<SuccessResponse> {
    return await setHttpAccessApi(params);
  }

  /**
   * Get current device name.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<NameInfo>} A promise that resolves to the device name.
   */
  async SettingsNameGet(
    this: BusyBar,
    params?: TimeoutOptions,
  ): Promise<NameInfo> {
    return await getNameApi(params);
  }

  /**
   * @deprecated Use `SettingsNameGet` instead. will be removed in the next release.
   */
  async SettingsName(
    this: BusyBar,
    params?: TimeoutOptions,
  ): Promise<NameInfo> {
    return this.SettingsNameGet(params);
  }

  /**
   * Set device name.
   *
   * @param {NameParams} params - Name parameters:
   *   @param {string} params.name - New device name (max 64 chars).
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} A promise that resolves on success.
   */
  async SettingsNameSet(
    this: BusyBar,
    params: NameParams,
  ): Promise<SuccessResponse> {
    return await setNameApi(params);
  }
}
