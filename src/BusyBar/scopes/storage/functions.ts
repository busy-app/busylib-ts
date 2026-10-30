import type { RequestClient } from 'BusyBar/client/types';
import type { RequestOptionsFor } from 'BusyBar/client/types.internal';
import type {
  StorageCreateDirectoryParams,
  StorageDownloadFileOptions,
  StorageDownloadFileParams,
  StorageList,
  StorageReadDirectoryParams,
  StorageReadResponse,
  StorageRemoveParams,
  StorageRenameParams,
  StorageStatus,
  StorageUploadFileParams
} from 'BusyBar/scopes/storage/types';
import type { SuccessResponse } from 'BusyBar/types';

/**
 * Upload file to internal storage. Uploads a file to a specified path.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {StorageUploadFileParams} params - Upload parameters:
 *   @param {StorageUploadFileParams['path']} params.path - Destination path.
 *   @param {StorageUploadFileParams['file']} params.file - File content.
 *   @param {StorageUploadFileParams['append']} [params.append] - Append to the file instead of replacing it (0 - replace (default), 1 - append; the file is created if it does not exist).
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<SuccessResponse>} A promise that resolves on successful upload.
 */
export async function storageWrite<C extends RequestClient>(
  client: C,
  params: StorageUploadFileParams,
  options?: RequestOptionsFor<C>
): Promise<SuccessResponse> {
  const { file, ...query } = params;

  return client.POST('/storage/write', {
    params: {
      query
    },
    headers: {
      'Content-Type': 'application/octet-stream'
    },
    body: file as unknown as string,
    ...options
  });
}

/**
 * Download file from internal storage. Downloads a file from a specified path.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {StorageDownloadFileParams} params - Download parameters:
 *   @param {StorageDownloadFileParams['path']} params.path - Path to the file.
 * @param {StorageDownloadFileOptions} [options] - Optional request options.
 *   @param {StorageDownloadFileOptions['as_array_buffer']} [options.as_array_buffer] - Whether to return ArrayBuffer instead of Blob.
 *   @param {StorageDownloadFileOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {StorageDownloadFileOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<StorageReadResponse>} A promise that resolves to the file content (Blob or ArrayBuffer).
 */
export async function storageRead<C extends RequestClient>(
  client: C,
  params: StorageDownloadFileParams,
  options?: RequestOptionsFor<C, StorageDownloadFileOptions>
): Promise<StorageReadResponse> {
  const { path } = params;

  return client.GET('/storage/read', {
    params: {
      query: {
        path
      }
    },
    parseAs: options?.as_array_buffer ? 'arrayBuffer' : 'blob',
    timeout: options?.timeout,
    signal: options?.signal
  });
}

/**
 * List files on internal storage.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {StorageReadDirectoryParams} params - List parameters:
 *   @param {StorageReadDirectoryParams['path']} params.path - Path to the directory.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<StorageList>} A promise that resolves to a list of files and directories.
 */
export async function storageListGet<C extends RequestClient>(
  client: C,
  params: StorageReadDirectoryParams,
  options?: RequestOptionsFor<C>
): Promise<StorageList> {
  const { path } = params;

  return client.GET('/storage/list', {
    params: {
      query: {
        path
      }
    },
    ...options
  });
}

/**
 * Remove a file on internal storage. Removes a file with a specified path.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {StorageRemoveParams} params - Remove parameters:
 *   @param {StorageRemoveParams['path']} params.path - Path to the file to remove.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<SuccessResponse>} A promise that resolves on successful removal.
 */
export async function storageRemove<C extends RequestClient>(client: C, params: StorageRemoveParams, options?: RequestOptionsFor<C>): Promise<SuccessResponse> {
  const { path } = params;

  return client.DELETE('/storage/remove', {
    params: {
      query: {
        path
      }
    },
    ...options
  });
}

/**
 * Create a directory on internal storage. Creates a new directory with a specified path.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {StorageCreateDirectoryParams} params - Directory creation parameters:
 *   @param {StorageCreateDirectoryParams['path']} params.path - Path to the new directory.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<SuccessResponse>} A promise that resolves on successful creation.
 */
export async function storageMkdir<C extends RequestClient>(
  client: C,
  params: StorageCreateDirectoryParams,
  options?: RequestOptionsFor<C>
): Promise<SuccessResponse> {
  const { path } = params;

  return client.POST('/storage/mkdir', {
    params: {
      query: {
        path
      }
    },
    ...options
  });
}

/**
 * Show storage usage.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<StorageStatus>} A promise that resolves to the storage status.
 */
export async function storageStatusGet<C extends RequestClient>(client: C, options?: RequestOptionsFor<C>): Promise<StorageStatus> {
  return client.GET('/storage/status', options);
}

/**
 * Rename/move a file. Moves a file to a new location.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {StorageRenameParams} params - Rename parameters:
 *   @param {StorageRenameParams['path']} params.path - Current path of the file or directory.
 *   @param {StorageRenameParams['new_path']} params.new_path - New path for the file or directory.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<SuccessResponse>} A promise that resolves on successful rename.
 */
export async function storageRename<C extends RequestClient>(client: C, params: StorageRenameParams, options?: RequestOptionsFor<C>): Promise<SuccessResponse> {
  const { path, new_path } = params;

  return client.POST('/storage/rename', {
    params: {
      query: {
        path,
        new_path
      }
    },
    ...options
  });
}
