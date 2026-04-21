import {
  update as updateApi,
  check as checkUpdateApi,
  status as statusUpdateApi,
  changelog as changelogUpdateApi,
  install as installUpdateApi,
  abort as abortUpdateApi,
  getAutoUpdate as getAutoUpdateApi,
  setAutoUpdate as setAutoUpdateApi,
  UpdateParams,
  ChangelogParams,
  InstallParams,
  AutoUpdateParams
} from 'BusyBar/api/update';
import type { TimeoutOptions, SuccessResponse, UpdateStatus, UpdateChangelog, AutoUpdateSettings } from 'BusyBar/types';
import { BusyBar } from 'BusyBar/index';

export class UpdateMethods {
  /**
   * Upload firmware update package.
   *
   * @param {UpdateParams} params - Update parameters.
   *   @param {BusyFile} params.file - Firmware TAR file to upload.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} A promise that resolves when upload is complete.
   */
  async UpdateFromFile(this: BusyBar, params: UpdateParams): Promise<SuccessResponse> {
    return await updateApi(this.apiClient, params);
  }

  /**
   * Start firmware update check.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} A promise that resolves to the update check result.
   */
  async UpdateCheck(this: BusyBar, params?: TimeoutOptions): Promise<SuccessResponse> {
    return await checkUpdateApi(this.apiClient, params);
  }

  /**
   * Get firmware update status.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<UpdateStatus>} A promise that resolves to the update status.
   */
  async UpdateStatusGet(this: BusyBar, params?: TimeoutOptions): Promise<UpdateStatus> {
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
  async UpdateChangelogGet(this: BusyBar, params: ChangelogParams): Promise<UpdateChangelog> {
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
  async UpdateInstall(this: BusyBar, params: InstallParams): Promise<SuccessResponse> {
    return await installUpdateApi(this.apiClient, params);
  }

  /**
   * Abort firmware update download.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} A promise that resolves on successful abort.
   */
  async UpdateAbort(this: BusyBar, params?: TimeoutOptions): Promise<SuccessResponse> {
    return await abortUpdateApi(this.apiClient, params);
  }

  /**
   * Get current auto-update settings.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<AutoUpdateSettings>} A promise that resolves to the current auto-update settings.
   */
  async UpdateAutoUpdateGet(this: BusyBar, params?: TimeoutOptions): Promise<AutoUpdateSettings> {
    return await getAutoUpdateApi(this.apiClient, params);
  }

  /**
   * Set auto-update settings.
   *
   * @param {AutoUpdateParams} params - Parameters for auto-update settings.
   *   @param {AutoUpdateParams['is_enabled']} params.is_enabled - Whether auto-update is enabled.
   *   @param {AutoUpdateParams['interval_start']} params.interval_start - Auto-update interval start time (HH:mm).
   *   @param {AutoUpdateParams['interval_end']} params.interval_end - Auto-update interval end time (HH:mm).
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} A promise that resolves on successful update of settings.
   */
  async UpdateAutoUpdateSet(this: BusyBar, params: AutoUpdateParams): Promise<SuccessResponse> {
    return await setAutoUpdateApi(this.apiClient, params);
  }
}
