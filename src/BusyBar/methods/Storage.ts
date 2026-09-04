import {
  write as writeStorageApi,
  read as readStorageApi,
  list as listStorageApi,
  remove as removeStorageApi,
  mkdir as mkdirStorageApi,
  status as statusStorageApi,
  rename as renameStorageApi
} from 'BusyBar/api/storage';
import type {
  RequestOptions,
  SuccessResponse,
  StorageReadResponse,
  StorageList,
  StorageStatus,
  StorageUploadFileParams,
  StorageDownloadFileParams,
  StorageDownloadFileOptions,
  StorageReadDirectoryParams,
  StorageRemoveParams,
  StorageCreateDirectoryParams,
  StorageRenameParams
} from 'BusyBar/types';
import { BusyBar } from 'BusyBar/index';

export class StorageMethods {
  /**
   * Upload file to internal storage. Uploads a file to a specified path.
   *
   * @param {StorageUploadFileParams} params - Upload parameters:
   *   @param {StorageUploadFileParams['path']} params.path - Destination path.
   *   @param {StorageUploadFileParams['file']} params.file - File content.
   *   @param {StorageUploadFileParams['append']} [params.append] - Append to the file instead of replacing it (0 - replace (default), 1 - append; the file is created if it does not exist).
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves on successful upload.
   */
  async StorageWrite(this: BusyBar, params: StorageUploadFileParams, options?: RequestOptions): Promise<SuccessResponse> {
    return await writeStorageApi(this.apiClient, params, options);
  }

  /**
   * Download file from internal storage. Downloads a file from a specified path.
   *
   * @param {StorageDownloadFileParams} params - Download parameters:
   *   @param {StorageDownloadFileParams['path']} params.path - Path to the file.
   * @param {StorageDownloadFileOptions} [options] - Optional request options.
   *   @param {StorageDownloadFileOptions['as_array_buffer']} [options.as_array_buffer] - Whether to return ArrayBuffer instead of Blob.
   *   @param {StorageDownloadFileOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {StorageDownloadFileOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<StorageReadResponse>} A promise that resolves to the file content (Blob or ArrayBuffer).
   */
  async StorageRead(this: BusyBar, params: StorageDownloadFileParams, options?: StorageDownloadFileOptions): Promise<StorageReadResponse> {
    return await readStorageApi(this.apiClient, params, options);
  }

  /**
   * List files on internal storage.
   *
   * @param {StorageReadDirectoryParams} params - List parameters:
   *   @param {StorageReadDirectoryParams['path']} params.path - Path to the directory.
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<StorageList>} A promise that resolves to a list of files and directories.
   */
  async StorageListGet(this: BusyBar, params: StorageReadDirectoryParams, options?: RequestOptions): Promise<StorageList> {
    return await listStorageApi(this.apiClient, params, options);
  }

  /**
   * Remove a file on internal storage. Removes a file with a specified path.
   *
   * @param {StorageRemoveParams} params - Remove parameters:
   *   @param {StorageRemoveParams['path']} params.path - Path to the file to remove.
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves on successful removal.
   */
  async StorageRemove(this: BusyBar, params: StorageRemoveParams, options?: RequestOptions): Promise<SuccessResponse> {
    return await removeStorageApi(this.apiClient, params, options);
  }

  /**
   * Create a directory on internal storage. Creates a new directory with a specified path.
   *
   * @param {StorageCreateDirectoryParams} params - Directory creation parameters:
   *   @param {StorageCreateDirectoryParams['path']} params.path - Path to the new directory.
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves on successful creation.
   */
  async StorageMkdir(this: BusyBar, params: StorageCreateDirectoryParams, options?: RequestOptions): Promise<SuccessResponse> {
    return await mkdirStorageApi(this.apiClient, params, options);
  }

  /**
   * Show storage usage.
   *
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<StorageStatus>} A promise that resolves to the storage status.
   */
  async StorageStatusGet(this: BusyBar, options?: RequestOptions): Promise<StorageStatus> {
    return await statusStorageApi(this.apiClient, options);
  }

  /**
   * Rename/move a file. Moves a file to a new location.
   *
   * @param {StorageRenameParams} params - Rename parameters:
   *   @param {StorageRenameParams['path']} params.path - Current path of the file or directory.
   *   @param {StorageRenameParams['new_path']} params.new_path - New path for the file or directory.
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves on successful rename.
   */
  async StorageRename(this: BusyBar, params: StorageRenameParams, options?: RequestOptions): Promise<SuccessResponse> {
    return await renameStorageApi(this.apiClient, params, options);
  }
}
