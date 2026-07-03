import {
  version as versionApi,
  status as statusApi,
  systemStatus as systemStatusApi,
  powerStatus as powerStatusApi,
  deviceStatus as deviceStatusApi,
  firmwareStatus as firmwareStatusApi,
  transport as transportApi,
  logDump as logDumpApi
} from 'BusyBar/api/system';
import type {
  VersionInfo,
  Status,
  StatusSystem,
  StatusDevice,
  StatusFirmware,
  StatusPower,
  NetworkInterfaceInfo,
  RequestOptions,
  LogDumpParams,
  SuccessResponse
} from 'BusyBar/types';
import { BusyBar } from 'BusyBar/index';

export class SystemMethods {
  /**
   * Get API version information.
   *
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<VersionInfo>} A promise that resolves to an object containing the `api_semver` string.
   */
  async SystemVersionGet(this: BusyBar, options?: RequestOptions): Promise<VersionInfo> {
    const response = await versionApi(this.apiClient, options);
    this.apiSemver = response.api_semver;

    return response;
  }

  /**
   * Get full status.
   *
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<Status>} Current status of the device.
   */
  async SystemStatusGet(this: BusyBar, options?: RequestOptions): Promise<Status> {
    return await statusApi(this.apiClient, options);
  }

  /**
   * Get system status.
   *
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<StatusSystem>} Current system status.
   */
  async SystemInfoGet(this: BusyBar, options?: RequestOptions): Promise<StatusSystem> {
    return await systemStatusApi(this.apiClient, options);
  }

  /**
   * Get power status.
   *
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<StatusPower>} Current power status.
   */
  async SystemStatusPowerGet(this: BusyBar, options?: RequestOptions): Promise<StatusPower> {
    return await powerStatusApi(this.apiClient, options);
  }

  /**
   * Get device status.
   *
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<StatusDevice>} Current device status.
   */
  async SystemStatusDeviceGet(this: BusyBar, options?: RequestOptions): Promise<StatusDevice> {
    return await deviceStatusApi(this.apiClient, options);
  }

  /**
   * Get firmware status.
   *
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<StatusFirmware>} Current firmware status.
   */
  async SystemStatusFirmwareGet(this: BusyBar, options?: RequestOptions): Promise<StatusFirmware> {
    return await firmwareStatusApi(this.apiClient, options);
  }

  /**
   * Get device transport information.
   *
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<NetworkInterfaceInfo>} Current transport info (usb/wifi).
   */
  async SystemTransportGet(this: BusyBar, options?: RequestOptions): Promise<NetworkInterfaceInfo> {
    const result = await transportApi(this.apiClient, options);
    return result;
  }

  /**
   * Dump captured log.
   *
   * Snapshot the in-memory log buffer to a file (defaults to /ext/dump.log).
   *
   * @param {LogDumpParams} [params] - Optional parameters.
   *   @param {LogDumpParams['path']} [params.path] - Destination file path (defaults to /ext/dump.log).
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves on successful log dump.
   */
  async SystemLogDump(this: BusyBar, params?: LogDumpParams, options?: RequestOptions): Promise<SuccessResponse> {
    return await logDumpApi(this.apiClient, params, options);
  }
}
