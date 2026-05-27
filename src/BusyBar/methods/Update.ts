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
import type { RequestOptions, SuccessResponse, UpdateStatus, UpdateChangelog, AutoUpdateSettings } from 'BusyBar/types';
import { BusyBar } from 'BusyBar/index';

export class UpdateMethods {
  /**
   * Upload firmware update package.
   *
   * @param {UpdateParams} params - Update parameters.
   *   @param {UpdateParams['file']} params.file - Firmware TAR file to upload.
   *   @param {UpdateParams['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {UpdateParams['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves when upload is complete.
   */
  async UpdateFromFile(this: BusyBar, params: UpdateParams): Promise<SuccessResponse> {
    return await updateApi(this.apiClient, params);
  }

  /**
   * Start firmware update check.
   *
   * @param {RequestOptions} [params] - Optional parameters.
   *   @param {RequestOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves to the update check result.
   */
  async UpdateCheck(this: BusyBar, params?: RequestOptions): Promise<SuccessResponse> {
    return await checkUpdateApi(this.apiClient, params);
  }

  /**
   * Get firmware update status.
   *
   * @param {RequestOptions} [params] - Optional parameters.
   *   @param {RequestOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<UpdateStatus>} A promise that resolves to the update status.
   */
  async UpdateStatusGet(this: BusyBar, params?: RequestOptions): Promise<UpdateStatus> {
    return await statusUpdateApi(this.apiClient, params);
  }

  /**
   * Get firmware update changelog.
   *
   * @param {ChangelogParams} params - Parameters for the changelog request.
   *   @param {ChangelogParams['version']} params.version - Version string to get the changelog for.
   *   @param {ChangelogParams['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {ChangelogParams['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<UpdateChangelog>} A promise that resolves to the changelog content.
   */
  async UpdateChangelogGet(this: BusyBar, params: ChangelogParams): Promise<UpdateChangelog> {
    return await changelogUpdateApi(this.apiClient, params);
  }

  /**
   * Start firmware update installation.
   *
   * @param {InstallParams} params - Parameters for the installation.
   *   @param {InstallParams['version']} params.version - Version string to install.
   *   @param {InstallParams['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {InstallParams['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves on successful initiation.
   */
  async UpdateInstall(this: BusyBar, params: InstallParams): Promise<SuccessResponse> {
    return await installUpdateApi(this.apiClient, params);
  }

  /**
   * Abort firmware update download.
   *
   * @param {RequestOptions} [params] - Optional parameters.
   *   @param {RequestOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves on successful abort.
   */
  async UpdateAbort(this: BusyBar, params?: RequestOptions): Promise<SuccessResponse> {
    return await abortUpdateApi(this.apiClient, params);
  }

  /**
   * Get current auto-update settings.
   *
   * @param {RequestOptions} [params] - Optional parameters.
   *   @param {RequestOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<AutoUpdateSettings>} A promise that resolves to the current auto-update settings.
   */
  async UpdateAutoUpdateGet(this: BusyBar, params?: RequestOptions): Promise<AutoUpdateSettings> {
    return await getAutoUpdateApi(this.apiClient, params);
  }

  /**
   * Set auto-update settings.
   *
   * @param {AutoUpdateParams} params - Parameters for auto-update settings.
   *   @param {AutoUpdateParams['is_enabled']} params.is_enabled - Whether auto-update is enabled.
   *   @param {AutoUpdateParams['interval_start']} params.interval_start - Auto-update interval start time (HH:mm).
   *   @param {AutoUpdateParams['interval_end']} params.interval_end - Auto-update interval end time (HH:mm).
   *   @param {AutoUpdateParams['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {AutoUpdateParams['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves on successful update of settings.
   */
  async UpdateAutoUpdateSet(this: BusyBar, params: AutoUpdateParams): Promise<SuccessResponse> {
    return await setAutoUpdateApi(this.apiClient, params);
  }
}
