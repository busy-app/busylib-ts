import {
  update as updateApi,
  check as checkUpdateApi,
  status as statusUpdateApi,
  changelog as changelogUpdateApi,
  install as installUpdateApi,
  abort as abortUpdateApi,
  getAutoUpdate as getAutoUpdateApi,
  setAutoUpdate as setAutoUpdateApi
} from 'BusyBar/api/update';
import type {
  RequestOptions,
  SuccessResponse,
  UpdateStatus,
  UpdateChangelog,
  AutoUpdateSettings,
  UpdateFromFileParams,
  UpdateChangelogParams,
  UpdateInstallParams,
  UpdateAutoUpdateParams
} from 'BusyBar/types';
import { BusyBar } from 'BusyBar/index';

export class UpdateMethods {
  /**
   * Upload firmware update package.
   *
   * @param {UpdateFromFileParams} params - Update parameters.
   *   @param {UpdateFromFileParams['file']} params.file - Firmware TAR file to upload.
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves when upload is complete.
   */
  async UpdateFromFile(this: BusyBar, params: UpdateFromFileParams, options?: RequestOptions): Promise<SuccessResponse> {
    return await updateApi(this.apiClient, params, options);
  }

  /**
   * Start firmware update check.
   *
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves to the update check result.
   */
  async UpdateCheck(this: BusyBar, options?: RequestOptions): Promise<SuccessResponse> {
    return await checkUpdateApi(this.apiClient, options);
  }

  /**
   * Get firmware update status.
   *
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<UpdateStatus>} A promise that resolves to the update status.
   */
  async UpdateStatusGet(this: BusyBar, options?: RequestOptions): Promise<UpdateStatus> {
    return await statusUpdateApi(this.apiClient, options);
  }

  /**
   * Get firmware update changelog.
   *
   * @param {UpdateChangelogParams} params - Parameters for the changelog request.
   *   @param {UpdateChangelogParams['version']} params.version - Version string to get the changelog for.
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<UpdateChangelog>} A promise that resolves to the changelog content.
   */
  async UpdateChangelogGet(this: BusyBar, params: UpdateChangelogParams, options?: RequestOptions): Promise<UpdateChangelog> {
    return await changelogUpdateApi(this.apiClient, params, options);
  }

  /**
   * Start firmware update installation.
   *
   * @param {UpdateInstallParams} params - Parameters for the installation.
   *   @param {UpdateInstallParams['version']} params.version - Version string to install.
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves on successful initiation.
   */
  async UpdateInstall(this: BusyBar, params: UpdateInstallParams, options?: RequestOptions): Promise<SuccessResponse> {
    return await installUpdateApi(this.apiClient, params, options);
  }

  /**
   * Abort firmware update download.
   *
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves on successful abort.
   */
  async UpdateAbort(this: BusyBar, options?: RequestOptions): Promise<SuccessResponse> {
    return await abortUpdateApi(this.apiClient, options);
  }

  /**
   * Get current auto-update settings.
   *
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<AutoUpdateSettings>} A promise that resolves to the current auto-update settings.
   */
  async UpdateAutoUpdateGet(this: BusyBar, options?: RequestOptions): Promise<AutoUpdateSettings> {
    return await getAutoUpdateApi(this.apiClient, options);
  }

  /**
   * Set auto-update settings.
   *
   * @param {UpdateAutoUpdateParams} params - Parameters for auto-update settings.
   *   @param {UpdateAutoUpdateParams['is_enabled']} params.is_enabled - Whether auto-update is enabled.
   *   @param {UpdateAutoUpdateParams['interval_start']} params.interval_start - Auto-update interval start time (HH:mm).
   *   @param {UpdateAutoUpdateParams['interval_end']} params.interval_end - Auto-update interval end time (HH:mm).
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves on successful update of settings.
   */
  async UpdateAutoUpdateSet(this: BusyBar, params: UpdateAutoUpdateParams, options?: RequestOptions): Promise<SuccessResponse> {
    return await setAutoUpdateApi(this.apiClient, params, options);
  }
}
