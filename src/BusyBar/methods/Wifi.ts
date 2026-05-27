import {
  status as statusWifiApi,
  connect as connectWifiApi,
  disconnect as disconnectWifiApi,
  networks as networksWifiAPi
} from 'BusyBar/api/wifi';
import type { RequestOptions, WifiStatusResponse, SuccessResponse, WifiNetworkResponse, WifiConnectParams } from 'BusyBar/types';
import { BusyBar } from 'BusyBar/index';

export class WifiMethods {
  /**
   * Returns current Wi-Fi status.
   *
   * @param {RequestOptions} [params] - Optional parameters.
   *   @param {RequestOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<WifiStatusResponse>} A promise that resolves to the Wi-Fi status.
   */
  async WifiStatusGet(this: BusyBar, params?: RequestOptions): Promise<WifiStatusResponse> {
    return await statusWifiApi(this.apiClient, params);
  }

  /**
   * Connects to Wi-Fi network.
   *
   * @param {WifiConnectParams} params - Connection parameters:
   *   @param {WifiConnectParams['ssid']} params.ssid - Network SSID.
   *   @param {WifiConnectParams['password']} params.password - Network password.
   *   @param {WifiConnectParams['security']} params.security - Security method.
   *   @param {WifiConnectParams['ip_config']} [params.ip_config] - IP configuration.
   *   @param {WifiConnectParams['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {WifiConnectParams['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves on successful connection initiation.
   */
  async WifiConnect(this: BusyBar, params: WifiConnectParams): Promise<SuccessResponse> {
    return await connectWifiApi(this.apiClient, params);
  }

  /**
   * Disconnects from Wi-Fi.
   *
   * @param {RequestOptions} [params] - Optional parameters.
   *   @param {RequestOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves on successful disconnection.
   */
  async WifiDisconnect(this: BusyBar, params?: RequestOptions): Promise<SuccessResponse> {
    return await disconnectWifiApi(this.apiClient, params);
  }

  /**
   * Scans environment for available Wi-Fi networks.
   *
   * @param {RequestOptions} [params] - Optional parameters.
   *   @param {RequestOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<WifiNetworkResponse>} A promise that resolves to a list of available networks.
   */
  async WifiNetworksGet(this: BusyBar, params?: RequestOptions): Promise<WifiNetworkResponse> {
    return await networksWifiAPi(this.apiClient, params);
  }
}
