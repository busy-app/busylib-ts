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
   *   @param {StorageUploadFileParams['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {StorageUploadFileParams['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves on successful upload.
   */
  async StorageWrite(this: BusyBar, params: StorageUploadFileParams): Promise<SuccessResponse> {
    return await writeStorageApi(this.apiClient, params);
  }

  /**
   * Download file from internal storage. Downloads a file from a specified path.
   *
   * @param {StorageDownloadFileParams} params - Download parameters:
   *   @param {StorageDownloadFileParams['path']} params.path - Path to the file.
   *   @param {StorageDownloadFileParams['as_array_buffer']} [params.as_array_buffer] - Whether to return ArrayBuffer instead of Blob.
   *   @param {StorageDownloadFileParams['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {StorageDownloadFileParams['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<StorageReadResponse>} A promise that resolves to the file content (Blob or ArrayBuffer).
   */
  async StorageRead(this: BusyBar, params: StorageDownloadFileParams): Promise<StorageReadResponse> {
    return await readStorageApi(this.apiClient, params);
  }

  /**
   * List files on internal storage.
   *
   * @param {StorageReadDirectoryParams} params - List parameters:
   *   @param {StorageReadDirectoryParams['path']} params.path - Path to the directory.
   *   @param {StorageReadDirectoryParams['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {StorageReadDirectoryParams['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<StorageList>} A promise that resolves to a list of files and directories.
   */
  async StorageListGet(this: BusyBar, params: StorageReadDirectoryParams): Promise<StorageList> {
    return await listStorageApi(this.apiClient, params);
  }

  /**
   * Remove a file on internal storage. Removes a file with a specified path.
   *
   * @param {StorageRemoveParams} params - Remove parameters:
   *   @param {StorageRemoveParams['path']} params.path - Path to the file to remove.
   *   @param {StorageRemoveParams['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {StorageRemoveParams['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves on successful removal.
   */
  async StorageRemove(this: BusyBar, params: StorageRemoveParams): Promise<SuccessResponse> {
    return await removeStorageApi(this.apiClient, params);
  }

  /**
   * Create a directory on internal storage. Creates a new directory with a specified path.
   *
   * @param {StorageCreateDirectoryParams} params - Directory creation parameters:
   *   @param {StorageCreateDirectoryParams['path']} params.path - Path to the new directory.
   *   @param {StorageCreateDirectoryParams['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {StorageCreateDirectoryParams['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves on successful creation.
   */
  async StorageMkdir(this: BusyBar, params: StorageCreateDirectoryParams): Promise<SuccessResponse> {
    return await mkdirStorageApi(this.apiClient, params);
  }

  /**
   * Show storage usage.
   *
   * @param {RequestOptions} [params] - Optional parameters.
   *   @param {RequestOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<StorageStatus>} A promise that resolves to the storage status.
   */
  async StorageStatusGet(this: BusyBar, params?: RequestOptions): Promise<StorageStatus> {
    return await statusStorageApi(this.apiClient, params);
  }

  /**
   * Rename/move a file. Moves a file to a new location.
   *
   * @param {StorageRenameParams} params - Rename parameters:
   *   @param {StorageRenameParams['path']} params.path - Current path of the file or directory.
   *   @param {StorageRenameParams['new_path']} params.new_path - New path for the file or directory.
   *   @param {StorageRenameParams['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {StorageRenameParams['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves on successful rename.
   */
  async StorageRename(this: BusyBar, params: StorageRenameParams): Promise<SuccessResponse> {
    return await renameStorageApi(this.apiClient, params);
  }
}
