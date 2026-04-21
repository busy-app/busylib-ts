import {
  status as statusWifiApi,
  connect as connectWifiApi,
  disconnect as disconnectWifiApi,
  networks as networksWifiAPi,
  ConnectParams
} from 'BusyBar/api/wifi';
import type { TimeoutOptions, WifiStatusResponse, SuccessResponse, WifiNetworkResponse } from 'BusyBar/types';
import { BusyBar } from 'BusyBar/index';

export class WifiMethods {
  /**
   * Returns current Wi-Fi status.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<WifiStatusResponse>} A promise that resolves to the Wi-Fi status.
   */
  async WifiStatusGet(this: BusyBar, params?: TimeoutOptions): Promise<WifiStatusResponse> {
    return await statusWifiApi(this.apiClient, params);
  }

  /**
   * Connects to Wi-Fi network.
   *
   * @param {ConnectParams} params - Connection parameters:
   *   @param {string} params.ssid - Network SSID.
   *   @param {string} params.password - Network password.
   *   @param {WifiSecurityMethod} params.security - Security method.
   *   @param {object} [params.ip_config] - IP configuration.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} A promise that resolves on successful connection initiation.
   */
  async WifiConnect(this: BusyBar, params: ConnectParams): Promise<SuccessResponse> {
    return await connectWifiApi(this.apiClient, params);
  }

  /**
   * Disconnects from Wi-Fi.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} A promise that resolves on successful disconnection.
   */
  async WifiDisconnect(this: BusyBar, params?: TimeoutOptions): Promise<SuccessResponse> {
    return await disconnectWifiApi(this.apiClient, params);
  }

  /**
   * Scans environment for available Wi-Fi networks.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<WifiNetworkResponse>} A promise that resolves to a list of available networks.
   */
  async WifiNetworksGet(this: BusyBar, params?: TimeoutOptions): Promise<WifiNetworkResponse> {
    return await networksWifiAPi(this.apiClient, params);
  }
}
