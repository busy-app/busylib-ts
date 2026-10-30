import type { RequestClient } from 'BusyBar/client/types';
import type { RequestOptionsFor } from 'BusyBar/client/types.internal';
import type {
  AppListResult,
  AppSettingsDocument,
  AppStageResult,
  AppsInstallParams,
  AppsRemoveParams,
  AppsSettingsGetParams,
  AppsSettingsResetParams,
  AppsSettingsSetParams,
  AppsStageParams
} from 'BusyBar/scopes/apps/types';
import type { SuccessResponse } from 'BusyBar/types';

/**
 * Stage a JavaScript application for installation. Uploads an application package (TGZ or TAR file) and initiates the installation process. The package is unpacked into a staging area and a single-use installation key is returned, which must then be passed to AppsInstall to complete the installation.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {AppsStageParams} params - Parameters for staging.
 *   @param {AppsStageParams['file']} params.file - Application package (TGZ or TAR) to upload.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<AppStageResult>} A promise that resolves to the staging result, including the installation key and staged application info.
 */
export async function appsStage<C extends RequestClient>(client: C, params: AppsStageParams, options?: RequestOptionsFor<C>): Promise<AppStageResult> {
  const { file } = params;

  return client.POST('/apps/stage', {
    headers: {
      'Content-Type': 'application/octet-stream'
    },
    body: file as unknown as string,
    ...options
  });
}

/**
 * Install a staged JavaScript application using the installation key returned by appsStage.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {AppsInstallParams} params - Parameters for the installation.
 *   @param {AppsInstallParams['install_key']} params.install_key - Single-use installation key.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<SuccessResponse>} A promise that resolves when the application is installed.
 */
export async function appsInstall<C extends RequestClient>(client: C, params: AppsInstallParams, options?: RequestOptionsFor<C>): Promise<SuccessResponse> {
  const { install_key } = params;

  return client.POST('/apps/install', {
    params: {
      query: {
        install_key
      }
    },
    ...options
  });
}

/**
 * Delete a JavaScript application. Removes an installed application, keeping its settings.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {AppsRemoveParams} params - Parameters for the removal.
 *   @param {AppsRemoveParams['app_id']} params.app_id - JavaScript application id.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<SuccessResponse>} A promise that resolves when the application is removed.
 */
export async function appsRemove<C extends RequestClient>(client: C, params: AppsRemoveParams, options?: RequestOptionsFor<C>): Promise<SuccessResponse> {
  const { app_id } = params;

  return client.DELETE('/apps', {
    params: {
      query: {
        app_id
      }
    },
    ...options
  });
}

/**
 * List installed JavaScript applications.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<AppListResult>} A promise that resolves to the list of installed applications.
 */
export async function appsList<C extends RequestClient>(client: C, options?: RequestOptionsFor<C>): Promise<AppListResult> {
  return client.GET('/apps/list', options);
}

/**
 * Get application settings. Returns the complete settings document; the first request materializes it from the schema defaults.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {AppsSettingsGetParams} params - Parameters for the settings request.
 *   @param {AppsSettingsGetParams['app_id']} params.app_id - JavaScript application id.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<AppSettingsDocument>} A promise that resolves to the settings document.
 */
export async function appsSettingsGet<C extends RequestClient>(
  client: C,
  params: AppsSettingsGetParams,
  options?: RequestOptionsFor<C>
): Promise<AppSettingsDocument> {
  const { app_id } = params;

  return client.GET('/apps/settings', {
    params: {
      query: {
        app_id
      }
    },
    ...options
  });
}

/**
 * Set application settings. Replaces the settings document: every field must be present and valid, with a version matching the application settings; unknown keys are dropped.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {AppsSettingsSetParams} params - Parameters for the settings update.
 *   @param {AppsSettingsSetParams['app_id']} params.app_id - JavaScript application id.
 *   @param {AppsSettingsSetParams['settings']} params.settings - Complete settings document to store.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<SuccessResponse>} A promise that resolves when the settings are stored.
 */
export async function appsSettingsSet<C extends RequestClient>(
  client: C,
  params: AppsSettingsSetParams,
  options?: RequestOptionsFor<C>
): Promise<SuccessResponse> {
  const { app_id, settings } = params;

  return client.PUT('/apps/settings', {
    params: {
      query: {
        app_id
      }
    },
    body: settings,
    ...options
  });
}

/**
 * Reset application settings. Resets every field to its schema default.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {AppsSettingsResetParams} params - Parameters for the settings reset.
 *   @param {AppsSettingsResetParams['app_id']} params.app_id - JavaScript application id.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<SuccessResponse>} A promise that resolves when the settings are reset.
 */
export async function appsSettingsReset<C extends RequestClient>(
  client: C,
  params: AppsSettingsResetParams,
  options?: RequestOptionsFor<C>
): Promise<SuccessResponse> {
  const { app_id } = params;

  return client.DELETE('/apps/settings', {
    params: {
      query: {
        app_id
      }
    },
    ...options
  });
}
