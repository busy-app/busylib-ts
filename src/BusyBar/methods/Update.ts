import {
  update as updateApi,
  check as checkUpdateApi,
  status as statusUpdateApi,
  changelog as changelogUpdateApi,
  install as installUpdateApi,
  abort as abortUpdateApi,
  UpdateParams,
  ChangelogParams,
  InstallParams,
} from "BusyBar/api/update";
import type {
  TimeoutOptions,
  SuccessResponse,
  UpdateStatus,
  UpdateChangelog,
} from "Global/types";
import { BusyBar } from "BusyBar/index";

export class UpdateMethods {
  /**
   * Upload firmware update package.
   *
   * @param {UpdateParams} params - Update parameters.
   *   @param {BusyFile} params.file - Firmware TAR file to upload.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} A promise that resolves when upload is complete.
   */
  async UpdateFromFile(
    this: BusyBar,
    params: UpdateParams,
  ): Promise<SuccessResponse> {
    return await updateApi(this.apiClient, params);
  }

  /**
   * Start firmware update check.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} A promise that resolves to the update check result.
   */
  async UpdateCheck(
    this: BusyBar,
    params?: TimeoutOptions,
  ): Promise<SuccessResponse> {
    return await checkUpdateApi(this.apiClient, params);
  }

  /**
   * Get firmware update status.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<UpdateStatus>} A promise that resolves to the update status.
   */
  async UpdateStatusGet(
    this: BusyBar,
    params?: TimeoutOptions,
  ): Promise<UpdateStatus> {
    return await statusUpdateApi(this.apiClient, params);
  }

  /**
   * Get firmware update changelog.
   *
   * @param {ChangelogParams} params - Parameters for the changelog request.
   *   @param {string} params.version - Version string to get the changelog for.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<UpdateChangelog>} A promise that resolves to the changelog content.
   */
  async UpdateChangelogGet(
    this: BusyBar,
    params: ChangelogParams,
  ): Promise<UpdateChangelog> {
    return await changelogUpdateApi(this.apiClient, params);
  }

  /**
   * Start firmware update installation.
   *
   * @param {InstallParams} params - Parameters for the installation.
   *   @param {string} params.version - Version string to install.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} A promise that resolves on successful initiation.
   */
  async UpdateInstall(
    this: BusyBar,
    params: InstallParams,
  ): Promise<SuccessResponse> {
    return await installUpdateApi(this.apiClient, params);
  }

  /**
   * Abort firmware update download.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} A promise that resolves on successful abort.
   */
  async UpdateAbort(
    this: BusyBar,
    params?: TimeoutOptions,
  ): Promise<SuccessResponse> {
    return await abortUpdateApi(this.apiClient, params);
  }
}
