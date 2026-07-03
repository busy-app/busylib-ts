import { status as statusWifiApi, connect as connectWifiApi, disconnect as disconnectWifiApi, networks as networksWifiAPi } from 'BusyBar/api/wifi';
import type { RequestOptions, WifiStatusResponse, SuccessResponse, WifiNetworkResponse, WifiConnectParams } from 'BusyBar/types';
import { BusyBar } from 'BusyBar/index';

export class WifiMethods {
  /**
   * Returns current Wi-Fi status.
   *
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<WifiStatusResponse>} A promise that resolves to the Wi-Fi status.
   */
  async WifiStatusGet(this: BusyBar, options?: RequestOptions): Promise<WifiStatusResponse> {
    return await statusWifiApi(this.apiClient, options);
  }

  /**
   * Connects to Wi-Fi network.
   *
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
  async WifiConnect(this: BusyBar, params: WifiConnectParams, options?: RequestOptions): Promise<SuccessResponse> {
    return await connectWifiApi(this.apiClient, params, options);
  }

  /**
   * Disconnects from Wi-Fi.
   *
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves on successful disconnection.
   */
  async WifiDisconnect(this: BusyBar, options?: RequestOptions): Promise<SuccessResponse> {
    return await disconnectWifiApi(this.apiClient, options);
  }

  /**
   * Scans environment for available Wi-Fi networks.
   *
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<WifiNetworkResponse>} A promise that resolves to a list of available networks.
   */
  async WifiNetworksGet(this: BusyBar, options?: RequestOptions): Promise<WifiNetworkResponse> {
    return await networksWifiAPi(this.apiClient, options);
  }
}
