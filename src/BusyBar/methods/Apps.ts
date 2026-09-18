import {
  stage as stageAppApi,
  install as installAppApi,
  remove as removeAppApi,
  list as listAppsApi,
  getSettings as getAppSettingsApi,
  setSettings as setAppSettingsApi,
  resetSettings as resetAppSettingsApi
} from 'BusyBar/api/apps';
import type {
  RequestOptions,
  SuccessResponse,
  AppStageResult,
  AppListResult,
  AppSettingsDocument,
  AppsStageParams,
  AppsInstallParams,
  AppsRemoveParams,
  AppsSettingsGetParams,
  AppsSettingsSetParams,
  AppsSettingsResetParams
} from 'BusyBar/types';
import { BusyBar } from 'BusyBar/index';

export class AppsMethods {
  /**
   * Stage a JavaScript application for installation. Uploads an application package (TGZ or TAR file) and initiates the installation process. The package is unpacked into a staging area and a single-use installation key is returned, which must then be passed to AppsInstall to complete the installation.
   *
   * @param {AppsStageParams} params - Parameters for staging.
   *   @param {AppsStageParams['file']} params.file - Application package (TGZ or TAR) to upload.
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<AppStageResult>} A promise that resolves to the staging result, including the installation key and staged application info.
   */
  async AppsStage(this: BusyBar, params: AppsStageParams, options?: RequestOptions): Promise<AppStageResult> {
    return await stageAppApi(this.apiClient, params, options);
  }

  /**
   * Install a staged JavaScript application using the installation key returned by AppsStage.
   *
   * @param {AppsInstallParams} params - Parameters for the installation.
   *   @param {AppsInstallParams['install_key']} params.install_key - Single-use installation key.
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves when the application is installed.
   */
  async AppsInstall(this: BusyBar, params: AppsInstallParams, options?: RequestOptions): Promise<SuccessResponse> {
    return await installAppApi(this.apiClient, params, options);
  }

  /**
   * Delete a JavaScript application. Removes an installed application, keeping its settings.
   *
   * @param {AppsRemoveParams} params - Parameters for the removal.
   *   @param {AppsRemoveParams['app_id']} params.app_id - JavaScript application id.
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves when the application is removed.
   */
  async AppsRemove(this: BusyBar, params: AppsRemoveParams, options?: RequestOptions): Promise<SuccessResponse> {
    return await removeAppApi(this.apiClient, params, options);
  }

  /**
   * List installed JavaScript applications.
   *
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<AppListResult>} A promise that resolves to the list of installed applications.
   */
  async AppsList(this: BusyBar, options?: RequestOptions): Promise<AppListResult> {
    return await listAppsApi(this.apiClient, options);
  }

  /**
   * Get application settings. Returns the complete settings document; the first request materializes it from the schema defaults.
   *
   * @param {AppsSettingsGetParams} params - Parameters for the settings request.
   *   @param {AppsSettingsGetParams['app_id']} params.app_id - JavaScript application id.
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<AppSettingsDocument>} A promise that resolves to the settings document.
   */
  async AppsSettingsGet(this: BusyBar, params: AppsSettingsGetParams, options?: RequestOptions): Promise<AppSettingsDocument> {
    return await getAppSettingsApi(this.apiClient, params, options);
  }

  /**
   * Set application settings. Replaces the settings document: every field must be present and valid, with a version matching the application settings; unknown keys are dropped.
   *
   * @param {AppsSettingsSetParams} params - Parameters for the settings update.
   *   @param {AppsSettingsSetParams['app_id']} params.app_id - JavaScript application id.
   *   @param {AppsSettingsSetParams['settings']} params.settings - Complete settings document to store.
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves when the settings are stored.
   */
  async AppsSettingsSet(this: BusyBar, params: AppsSettingsSetParams, options?: RequestOptions): Promise<SuccessResponse> {
    return await setAppSettingsApi(this.apiClient, params, options);
  }

  /**
   * Reset application settings. Resets every field to its schema default.
   *
   * @param {AppsSettingsResetParams} params - Parameters for the settings reset.
   *   @param {AppsSettingsResetParams['app_id']} params.app_id - JavaScript application id.
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves when the settings are reset.
   */
  async AppsSettingsReset(this: BusyBar, params: AppsSettingsResetParams, options?: RequestOptions): Promise<SuccessResponse> {
    return await resetAppSettingsApi(this.apiClient, params, options);
  }
}
