import type { RequestClient, RequestOptions } from 'BusyBar/client/types';
import type {
  AccessToken,
  AccessTokenCreateParams,
  AccessTokenRevokeParams,
  AccessTokensInfo,
  HttpAccessInfo,
  HttpAccessParams,
  NameInfo,
  NameParams
} from 'BusyBar/scopes/settings/types';
import type { SuccessResponse } from 'BusyBar/types';

/**
 * Get HTTP API access over Wi-Fi configuration.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<HttpAccessInfo>} A promise that resolves to the access configuration.
 */
export async function settingsAccessGet(client: RequestClient, options?: RequestOptions): Promise<HttpAccessInfo> {
  return client.GET('/access', options);
}

/**
 * Set HTTP API access over Wi-Fi configuration.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {HttpAccessParams} params - Access parameters:
 *   @param {HttpAccessParams['mode']} params.mode - Enable/disable access.
 *   @param {HttpAccessParams['key']} [params.key] - Access key (4-10 digits).
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<SuccessResponse>} A promise that resolves on success.
 */
export async function settingsAccessSet(client: RequestClient, params: HttpAccessParams, options?: RequestOptions): Promise<SuccessResponse> {
  const { mode, key } = params;
  const keyValue = key ?? '';

  if (String(keyValue).trim() && !/^\d{4,10}$/.test(String(keyValue))) {
    throw new Error('Key must be a string of 4 to 10 digits');
  }

  const result = await client.POST('/access', {
    params: {
      query: {
        mode,
        key: keyValue
      }
    },
    ...options
  });

  // The device now requires the new key, so subsequent requests must send it.
  if (params.mode === 'key' && params.key) {
    client.setHTTPAccessPassword?.(params.key);
  }

  return result;
}

/**
 * Get current device name.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<NameInfo>} A promise that resolves to the device name.
 */
export async function settingsNameGet(client: RequestClient, options?: RequestOptions): Promise<NameInfo> {
  return client.GET('/name', options);
}

/**
 * Set device name.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {NameParams} params - Name parameters:
 *   @param {NameParams['name']} params.name - New device name (max 64 chars).
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<SuccessResponse>} A promise that resolves on success.
 */
export async function settingsNameSet(client: RequestClient, params: NameParams, options?: RequestOptions): Promise<SuccessResponse> {
  const { name } = params;

  return client.POST('/name', {
    body: {
      name
    },
    ...options
  });
}

/**
 * List all access tokens.
 *
 * Provides basic information about all access tokens (IDs, names and timestamps).
 * The full token value is never returned here - it is only shown once on creation.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<AccessTokensInfo>} A promise that resolves to the list of access tokens.
 */
export async function settingsAccessTokensGet(client: RequestClient, options?: RequestOptions): Promise<AccessTokensInfo> {
  return client.GET('/access/tokens', options);
}

/**
 * Create a new access token.
 *
 * The returned `token` field is only present in this response and cannot be retrieved later.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {AccessTokenCreateParams} params - Token parameters:
 *   @param {AccessTokenCreateParams['name']} params.name - Arbitrary name to differentiate this token from others.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<AccessToken>} A promise that resolves to the created token.
 */
export async function settingsAccessTokenCreate(client: RequestClient, params: AccessTokenCreateParams, options?: RequestOptions): Promise<AccessToken> {
  const { name } = params;

  return client.POST('/access/tokens', {
    body: {
      name
    },
    ...options
  });
}

/**
 * Revoke all access tokens at once.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<SuccessResponse>} A promise that resolves on success.
 */
export async function settingsAccessTokensDelete(client: RequestClient, options?: RequestOptions): Promise<SuccessResponse> {
  return client.DELETE('/access/tokens', options);
}

/**
 * Revoke a single access token.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {AccessTokenRevokeParams} params - Token parameters:
 *   @param {AccessTokenRevokeParams['short_id']} params.short_id - Short ID of the token (first 8 characters).
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<SuccessResponse>} A promise that resolves on success.
 */
export async function settingsAccessTokenRevoke(client: RequestClient, params: AccessTokenRevokeParams, options?: RequestOptions): Promise<SuccessResponse> {
  const { short_id: shortId } = params;

  return client.DELETE('/access/tokens/{short_id}', {
    params: {
      path: { short_id: shortId }
    },
    ...options
  });
}
