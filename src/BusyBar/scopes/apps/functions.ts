import type { RequestClient } from 'BusyBar/client/types';
import type { RequestOptionsFor } from 'BusyBar/client/types.internal';
import type {
  AppListResult,
  AppQueueAddResult,
  AppQueueGetResult,
  AppSettingsDocument,
  AppStageResult,
  AppsInstallParams,
  AppsLaunchParams,
  AppsRemoveParams,
  AppsSettingsGetParams,
  AppsSettingsResetParams,
  AppsQueueAddParams,
  AppsQueueCancelParams,
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
 * Launch an installed JavaScript application by its id. Fails if a higher-priority application is already running.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {AppsLaunchParams} params - Parameters for the launch.
 *   @param {AppsLaunchParams['app_id']} params.app_id - JavaScript application id.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<SuccessResponse>} A promise that resolves when the application is launched.
 */
export async function appsLaunch<C extends RequestClient>(client: C, params: AppsLaunchParams, options?: RequestOptionsFor<C>): Promise<SuccessResponse> {
  const { app_id } = params;

  return client.POST('/apps/launch', {
    params: {
      query: {
        app_id
      }
    },
    ...options
  });
}

/**
 * Quit the running JavaScript application. Fails if no application is running.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<SuccessResponse>} A promise that resolves when the application has quit.
 */
export async function appsQuit<C extends RequestClient>(client: C, options?: RequestOptionsFor<C>): Promise<SuccessResponse> {
  return client.POST('/apps/quit', options);
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

/**
 * Get the current state of the application operation queue. Operations that already finished are not included: completion results are reported only through the state stream.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<AppQueueGetResult>} A promise that resolves to the queue contents, oldest first, with the operation in progress reported as `in_progress`.
 */
export async function appsQueueGet<C extends RequestClient>(client: C, options?: RequestOptionsFor<C>): Promise<AppQueueGetResult> {
  return client.GET('/apps/queue', options);
}

/**
 * Add one or more operations to the application operation queue. Each operation is validated and queued independently; installation also needs the URL of an application package.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {AppsQueueAddParams} params - Parameters for the queue operation.
 *   @param {AppsQueueAddParams['operations']} params.operations - Operations to add to the queue, at most 100 per request.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<AppQueueAddResult>} A promise that resolves to the enqueue result for every requested operation: the queue item id when it was accepted, or the reason it was rejected.
 */
export async function appsQueueAdd<C extends RequestClient>(client: C, params: AppsQueueAddParams, options?: RequestOptionsFor<C>): Promise<AppQueueAddResult> {
  const response = await client.POST('/apps/queue', {
    body: params,
    ...options
  });

  // The schema cannot express that an item has either an id or an error, so it types them all as optional.
  return response as AppQueueAddResult;
}

/**
 * Cancel a queued application operation by its queue id, or cancel the whole queue at once. An operation that already started cannot be cancelled; actual cancellation is reported through the state stream.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {AppsQueueCancelParams} params - Parameters for the cancellation: `{ item_id }` for a single operation or `{ all: true }` for the whole queue.
 *   @param {AppsQueueCancelParams['item_id']} [params.item_id] - Queue item id to cancel.
 *   @param {AppsQueueCancelParams['all']} [params.all] - Set to `true` to clear the whole queue.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<SuccessResponse>} A promise that resolves when the cancellation request is accepted.
 */
export async function appsQueueCancel<C extends RequestClient>(
  client: C,
  params: AppsQueueCancelParams,
  options?: RequestOptionsFor<C>
): Promise<SuccessResponse> {
  return client.POST('/apps/queue/cancel', {
    body: params,
    ...options
  });
}
