import {
  version as versionApi,
  status as statusApi,
  systemStatus as systemStatusApi,
  powerStatus as powerStatusApi,
} from "BusyBar/api/system";
import type {
  VersionInfo,
  Status,
  StatusSystem,
  StatusPower,
  TimeoutOptions,
} from "Global/types";
import { BusyBar } from "BusyBar/index";

export class SystemMethods {
  /**
   * Get API version information.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<VersionInfo>} A promise that resolves to an object containing the `api_semver` string.
   */
  async SystemVersionGet(
    this: BusyBar,
    params?: TimeoutOptions,
  ): Promise<VersionInfo> {
    const response = await versionApi(params);
    this.apiSemver = response.api_semver;

    return response;
  }

  /**
   * @deprecated Use `SystemVersionGet` instead. will be removed in the next release.
   */
  async SystemVersion(
    this: BusyBar,
    params?: TimeoutOptions,
  ): Promise<VersionInfo> {
    return this.SystemVersionGet(params);
  }

  /**
   * Get device status.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<Status>} Current status of the device.
   */
  async SystemStatusGet(this: BusyBar, params?: TimeoutOptions): Promise<Status> {
    return await statusApi(params);
  }

  /**
   * @deprecated Use `SystemStatusGet` instead. will be removed in the next release.
   */
  async SystemStatus(
    this: BusyBar,
    params?: TimeoutOptions,
  ): Promise<Status> {
    return this.SystemStatusGet(params);
  }

  /**
   * Get system status.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<StatusSystem>} Current system status.
   */
  async SystemInfoGet(
    this: BusyBar,
    params?: TimeoutOptions,
  ): Promise<StatusSystem> {
    return await systemStatusApi(params);
  }

  /**
   * @deprecated Use `SystemInfoGet` instead. will be removed in the next release.
   */
  async SystemInfo(
    this: BusyBar,
    params?: TimeoutOptions,
  ): Promise<StatusSystem> {
    return this.SystemInfoGet(params);
  }

  /**
   * Get power status.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<StatusPower>} Current power status.
   */
  async SystemStatusPowerGet(
    this: BusyBar,
    params?: TimeoutOptions,
  ): Promise<StatusPower> {
    return await powerStatusApi(params);
  }

  /**
   * @deprecated Use `SystemStatusPowerGet` instead. will be removed in the next release.
   */
  async SystemStatusPower(
    this: BusyBar,
    params?: TimeoutOptions,
  ): Promise<StatusPower> {
    return this.SystemStatusPowerGet(params);
  }
}
