import type { RequestClient, RequestOptions } from 'BusyBar/client/types';
import type { WifiConnectParams, WifiNetworkResponse, WifiStatusResponse } from 'BusyBar/scopes/wifi/types';
import type { SuccessResponse } from 'BusyBar/types';

/**
 * Returns current Wi-Fi status.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<WifiStatusResponse>} A promise that resolves to the Wi-Fi status.
 */
export async function wifiStatusGet(client: RequestClient, options?: RequestOptions): Promise<WifiStatusResponse> {
  return client.GET('/wifi/status', options);
}

/**
 * Connects to Wi-Fi network.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {WifiConnectParams} params - Connection parameters:
 *   @param {WifiConnectParams['ssid']} params.ssid - Network SSID.
 *   @param {WifiConnectParams['password']} params.password - Network password.
 *   @param {WifiConnectParams['security']} params.security - Security method.
 *   @param {WifiConnectParams['ip_config']} [params.ip_config] - IP configuration.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<SuccessResponse>} A promise that resolves on successful connection initiation.
 */
export async function wifiConnect(client: RequestClient, params: WifiConnectParams, options?: RequestOptions): Promise<SuccessResponse> {
  const { ssid, password, security, ip_config } = params;

  return client.POST('/wifi/connect', {
    body: {
      ssid,
      password,
      security,
      ip_config
    },
    ...options
  });
}

/**
 * Disconnects from Wi-Fi.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<SuccessResponse>} A promise that resolves on successful disconnection.
 */
export async function wifiDisconnect(client: RequestClient, options?: RequestOptions): Promise<SuccessResponse> {
  return client.POST('/wifi/disconnect', options);
}

/**
 * Scans environment for available Wi-Fi networks.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<WifiNetworkResponse>} A promise that resolves to a list of available networks.
 */
export async function wifiNetworksGet(client: RequestClient, options?: RequestOptions): Promise<WifiNetworkResponse> {
  return client.GET('/wifi/networks', options);
}
