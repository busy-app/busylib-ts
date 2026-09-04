import {
  getHttpAccess as getHttpAccessApi,
  setHttpAccess as setHttpAccessApi,
  getName as getNameApi,
  setName as setNameApi,
  getAccessTokens as getAccessTokensApi,
  createAccessToken as createAccessTokenApi,
  deleteAllAccessTokens as deleteAllAccessTokensApi,
  revokeAccessToken as revokeAccessTokenApi
} from 'BusyBar/api/settings';
import type {
  RequestOptions,
  SuccessResponse,
  HttpAccessInfo,
  NameInfo,
  HttpAccessParams,
  NameParams,
  AccessToken,
  AccessTokensInfo,
  AccessTokenCreateParams,
  AccessTokenRevokeParams
} from 'BusyBar/types';
import { BusyBar } from 'BusyBar/index';

export class SettingsMethods {
  /**
   * Get HTTP API access over Wi-Fi configuration.
   *
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<HttpAccessInfo>} A promise that resolves to the access configuration.
   */
  async SettingsAccessGet(this: BusyBar, options?: RequestOptions): Promise<HttpAccessInfo> {
    return await getHttpAccessApi(this.apiClient, options);
  }

  /**
   * Set HTTP API access over Wi-Fi configuration.
   *
   * @param {HttpAccessParams} params - Access parameters:
   *   @param {HttpAccessParams['mode']} params.mode - Enable/disable access.
   *   @param {HttpAccessParams['key']} [params.key] - Access key (4-10 digits).
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves on success.
   */
  async SettingsAccessSet(this: BusyBar, params: HttpAccessParams, options?: RequestOptions): Promise<SuccessResponse> {
    const result = await setHttpAccessApi(this.apiClient, params, options);

    if (params.mode === 'key' && params.key) {
      this.setHTTPAccessPassword(params.key);
    }

    return result;
  }

  /**
   * Get current device name.
   *
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<NameInfo>} A promise that resolves to the device name.
   */
  async SettingsNameGet(this: BusyBar, options?: RequestOptions): Promise<NameInfo> {
    return await getNameApi(this.apiClient, options);
  }

  /**
   * Set device name.
   *
   * @param {NameParams} params - Name parameters:
   *   @param {NameParams['name']} params.name - New device name (max 64 chars).
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves on success.
   */
  async SettingsNameSet(this: BusyBar, params: NameParams, options?: RequestOptions): Promise<SuccessResponse> {
    return await setNameApi(this.apiClient, params, options);
  }

  /**
   * List all access tokens.
   *
   * Provides basic information about all access tokens (IDs, names and timestamps).
   * The full token value is never returned here - it is only shown once on creation.
   *
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<AccessTokensInfo>} A promise that resolves to the list of access tokens.
   */
  async SettingsAccessTokensGet(this: BusyBar, options?: RequestOptions): Promise<AccessTokensInfo> {
    return await getAccessTokensApi(this.apiClient, options);
  }

  /**
   * Create a new access token.
   *
   * The returned `token` field is only present in this response and cannot be retrieved later.
   *
   * @param {AccessTokenCreateParams} params - Token parameters:
   *   @param {AccessTokenCreateParams['name']} params.name - Arbitrary name to differentiate this token from others.
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<AccessToken>} A promise that resolves to the created token.
   */
  async SettingsAccessTokenCreate(this: BusyBar, params: AccessTokenCreateParams, options?: RequestOptions): Promise<AccessToken> {
    return await createAccessTokenApi(this.apiClient, params, options);
  }

  /**
   * Revoke all access tokens at once.
   *
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves on success.
   */
  async SettingsAccessTokensDelete(this: BusyBar, options?: RequestOptions): Promise<SuccessResponse> {
    return await deleteAllAccessTokensApi(this.apiClient, options);
  }

  /**
   * Revoke a single access token.
   *
   * @param {AccessTokenRevokeParams} params - Token parameters:
   *   @param {AccessTokenRevokeParams['short_id']} params.short_id - Short ID of the token (first 8 characters).
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves on success.
   */
  async SettingsAccessTokenRevoke(this: BusyBar, params: AccessTokenRevokeParams, options?: RequestOptions): Promise<SuccessResponse> {
    return await revokeAccessTokenApi(this.apiClient, params, options);
  }
}
