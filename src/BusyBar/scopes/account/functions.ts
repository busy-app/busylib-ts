import type { RequestClient } from 'BusyBar/client/types';
import type { RequestOptionsFor } from 'BusyBar/client/types.internal';
import type { AccountBackend, AccountBackendSetParams, AccountInfo, AccountLink, AccountStatus } from 'BusyBar/scopes/account/types';
import type { SuccessResponse } from 'BusyBar/types';

/**
 * Get account info.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<AccountInfo>} A promise that resolves to the account information.
 */
export async function accountInfoGet<C extends RequestClient>(client: C, options?: RequestOptionsFor<C>): Promise<AccountInfo> {
  return client.GET('/account/info', options);
}

/**
 * Get account state.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<AccountStatus>} A promise that resolves to the account state.
 */
export async function accountStateGet<C extends RequestClient>(client: C, options?: RequestOptionsFor<C>): Promise<AccountStatus> {
  return client.GET('/account/status', options);
}

/**
 * Get MQTT backend configuration.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<AccountBackend>} A promise that resolves to the MQTT backend configuration.
 */
export async function accountBackendGet<C extends RequestClient>(client: C, options?: RequestOptionsFor<C>): Promise<AccountBackend> {
  return client.GET('/account/backend', options);
}

/**
 * Set MQTT backend configuration.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {AccountBackendSetParams} params - Parameters for setting the MQTT backend configuration.
 *   @param {AccountBackendSetParams['server_url']} params.server_url - MQTT server URL.
 *   @param {AccountBackendSetParams['client_cert_type']} params.client_cert_type - Client certificate type.
 *   @param {AccountBackendSetParams['ignore_server_cert']} params.ignore_server_cert - Whether to ignore the server certificate.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<SuccessResponse>} A promise that resolves on success.
 */
export async function accountBackendSet<C extends RequestClient>(
  client: C,
  params: AccountBackendSetParams,
  options?: RequestOptionsFor<C>
): Promise<SuccessResponse> {
  const { server_url, client_cert_type, ignore_server_cert } = params;

  return client.PUT('/account/backend', {
    body: {
      server_url,
      client_cert_type,
      ignore_server_cert
    },
    ...options
  });
}

/**
 * Unlink device from account. Removes association with the current account.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<SuccessResponse>} A promise that resolves on successful unlinking.
 */
export async function accountUnlink<C extends RequestClient>(client: C, options?: RequestOptionsFor<C>): Promise<SuccessResponse> {
  return client.DELETE('/account', options);
}

/**
 * Link device to account. Requests account link PIN. Works only if device is connected to MQTT and is not linked to account.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<AccountLink>} A promise that resolves to the link information (e.g., PIN).
 */
export async function accountLink<C extends RequestClient>(client: C, options?: RequestOptionsFor<C>): Promise<AccountLink> {
  return client.POST('/account/link', options);
}
