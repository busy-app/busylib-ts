import {
  version as versionApi,
  status as statusApi,
  systemStatus as systemStatusApi,
  powerStatus as powerStatusApi,
  deviceStatus as deviceStatusApi,
  firmwareStatus as firmwareStatusApi,
  transport as transportApi
} from 'BusyBar/api/system';
import type { VersionInfo, Status, StatusSystem, StatusDevice, StatusFirmware, StatusPower, NetworkInterfaceInfo, RequestOptions } from 'BusyBar/types';
import { BusyBar } from 'BusyBar/index';

export class SystemMethods {
  /**
   * Get API version information.
   *
   * @param {RequestOptions} [params] - Optional parameters.
   *   @param {RequestOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<VersionInfo>} A promise that resolves to an object containing the `api_semver` string.
   */
  async SystemVersionGet(this: BusyBar, params?: RequestOptions): Promise<VersionInfo> {
    const response = await versionApi(this.apiClient, params);
    this.apiSemver = response.api_semver;

    return response;
  }

  /**
   * Get full status.
   *
   * @param {RequestOptions} [params] - Optional parameters.
   *   @param {RequestOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<Status>} Current status of the device.
   */
  async SystemStatusGet(this: BusyBar, params?: RequestOptions): Promise<Status> {
    return await statusApi(this.apiClient, params);
  }

  /**
   * Get system status.
   *
   * @param {RequestOptions} [params] - Optional parameters.
   *   @param {RequestOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<StatusSystem>} Current system status.
   */
  async SystemInfoGet(this: BusyBar, params?: RequestOptions): Promise<StatusSystem> {
    return await systemStatusApi(this.apiClient, params);
  }

  /**
   * Get power status.
   *
   * @param {RequestOptions} [params] - Optional parameters.
   *   @param {RequestOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<StatusPower>} Current power status.
   */
  async SystemStatusPowerGet(this: BusyBar, params?: RequestOptions): Promise<StatusPower> {
    return await powerStatusApi(this.apiClient, params);
  }

  /**
   * Get device status.
   *
   * @param {RequestOptions} [params] - Optional parameters.
   *   @param {RequestOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<StatusDevice>} Current device status.
   */
  async SystemStatusDeviceGet(this: BusyBar, params?: RequestOptions): Promise<StatusDevice> {
    return await deviceStatusApi(this.apiClient, params);
  }

  /**
   * Get firmware status.
   *
   * @param {RequestOptions} [params] - Optional parameters.
   *   @param {RequestOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<StatusFirmware>} Current firmware status.
   */
  async SystemStatusFirmwareGet(this: BusyBar, params?: RequestOptions): Promise<StatusFirmware> {
    return await firmwareStatusApi(this.apiClient, params);
  }

  /**
   * Get device transport information.
   *
   * @param {RequestOptions} [params] - Optional parameters.
   *   @param {RequestOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<NetworkInterfaceInfo>} Current transport info (usb/wifi).
   */
  async SystemTransportGet(this: BusyBar, params?: RequestOptions): Promise<NetworkInterfaceInfo> {
    return await transportApi(this.apiClient, params);
  }
}
