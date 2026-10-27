import type { BusyBarClient } from 'BusyBar/client/BusyBarClient';
import type { RequestOptions } from 'BusyBar/client/types';
import type {
  AutoUpdateSettings,
  UpdateAutoUpdateParams,
  UpdateChangelog,
  UpdateChangelogParams,
  UpdateFromFileParams,
  UpdateInstallParams,
  UpdateStatus
} from 'BusyBar/scopes/update/types';
import type { SuccessResponse } from 'BusyBar/types';

/**
 * Upload firmware update package.
 *
 * @param {BusyBarClient} client - BUSY Bar client.
 * @param {UpdateFromFileParams} params - Update parameters.
 *   @param {UpdateFromFileParams['file']} params.file - Firmware TAR file to upload.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<SuccessResponse>} A promise that resolves when upload is complete.
 */
export async function updateFromFile(client: BusyBarClient, params: UpdateFromFileParams, options?: RequestOptions): Promise<SuccessResponse> {
  const { file } = params;

  return client.POST('/update', {
    headers: {
      'Content-Type': 'application/octet-stream'
    },
    body: file as unknown as string,
    ...options
  });
}

/**
 * Start firmware update check.
 *
 * @param {BusyBarClient} client - BUSY Bar client.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<SuccessResponse>} A promise that resolves to the update check result.
 */
export async function updateCheck(client: BusyBarClient, options?: RequestOptions): Promise<SuccessResponse> {
  return client.POST('/update/check', options);
}

/**
 * Get firmware update status.
 *
 * @param {BusyBarClient} client - BUSY Bar client.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<UpdateStatus>} A promise that resolves to the update status.
 */
export async function updateStatusGet(client: BusyBarClient, options?: RequestOptions): Promise<UpdateStatus> {
  return client.GET('/update/status', options);
}

/**
 * Get firmware update changelog.
 *
 * @param {BusyBarClient} client - BUSY Bar client.
 * @param {UpdateChangelogParams} params - Parameters for the changelog request.
 *   @param {UpdateChangelogParams['version']} params.version - Version string to get the changelog for.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<UpdateChangelog>} A promise that resolves to the changelog content.
 */
export async function updateChangelogGet(client: BusyBarClient, params: UpdateChangelogParams, options?: RequestOptions): Promise<UpdateChangelog> {
  const { version } = params;

  return client.GET('/update/changelog', {
    params: {
      query: {
        version
      }
    },
    ...options
  });
}

/**
 * Start firmware update installation.
 *
 * @param {BusyBarClient} client - BUSY Bar client.
 * @param {UpdateInstallParams} params - Parameters for the installation.
 *   @param {UpdateInstallParams['version']} params.version - Version string to install.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<SuccessResponse>} A promise that resolves on successful initiation.
 */
export async function updateInstall(client: BusyBarClient, params: UpdateInstallParams, options?: RequestOptions): Promise<SuccessResponse> {
  const { version } = params;

  return client.POST('/update/install', {
    params: {
      query: {
        version
      }
    },
    ...options
  });
}

/**
 * Abort firmware update download.
 *
 * @param {BusyBarClient} client - BUSY Bar client.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<SuccessResponse>} A promise that resolves on successful abort.
 */
export async function updateAbort(client: BusyBarClient, options?: RequestOptions): Promise<SuccessResponse> {
  return client.POST('/update/abort_download', options);
}

/**
 * Get current auto-update settings.
 *
 * @param {BusyBarClient} client - BUSY Bar client.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<AutoUpdateSettings>} A promise that resolves to the current auto-update settings.
 */
export async function updateAutoUpdateGet(client: BusyBarClient, options?: RequestOptions): Promise<AutoUpdateSettings> {
  return client.GET('/update/autoupdate', options);
}

/**
 * Set auto-update settings.
 *
 * @param {BusyBarClient} client - BUSY Bar client.
 * @param {UpdateAutoUpdateParams} params - Parameters for auto-update settings.
 *   @param {UpdateAutoUpdateParams['is_enabled']} params.is_enabled - Whether auto-update is enabled.
 *   @param {UpdateAutoUpdateParams['interval_start']} params.interval_start - Auto-update interval start time (HH:mm).
 *   @param {UpdateAutoUpdateParams['interval_end']} params.interval_end - Auto-update interval end time (HH:mm).
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<SuccessResponse>} A promise that resolves on successful update of settings.
 */
export async function updateAutoUpdateSet(client: BusyBarClient, params: UpdateAutoUpdateParams, options?: RequestOptions): Promise<SuccessResponse> {
  const { is_enabled, interval_start, interval_end } = params;

  return client.POST('/update/autoupdate', {
    body: {
      is_enabled,
      interval_start,
      interval_end
    },
    ...options
  });
}
