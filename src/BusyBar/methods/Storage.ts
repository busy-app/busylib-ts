import {
  write as writeStorageApi,
  read as readStorageApi,
  list as listStorageApi,
  remove as removeStorageApi,
  mkdir as mkdirStorageApi,
  status as statusStorageApi,
  UploadFileParams,
  DownloadFileParams,
  ReadDirectoryParams,
  RemoveParams,
  CreateDirectoryParams
} from 'BusyBar/api/storage';
import type { TimeoutOptions, SuccessResponse, StorageReadResponse, StorageList, StorageStatus } from 'Global/types';
import { BusyBar } from 'BusyBar/index';

export class StorageMethods {
  /**
   * Upload file to internal storage. Uploads a file to a specified path.
   *
   * @param {UploadFileParams} params - Upload parameters:
   *   @param {string} params.path - Destination path.
   *   @param {BusyFile} params.file - File content.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} A promise that resolves on successful upload.
   */
  async StorageWrite(this: BusyBar, params: UploadFileParams): Promise<SuccessResponse> {
    return await writeStorageApi(this.apiClient, params);
  }

  /**
   * Download file from internal storage. Downloads a file from a specified path.
   *
   * @param {DownloadFileParams} params - Download parameters:
   *   @param {string} params.path - Path to the file.
   *   @param {boolean} [params.asArrayBuffer] - Whether to return ArrayBuffer instead of Blob.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<StorageReadResponse>} A promise that resolves to the file content (Blob or ArrayBuffer).
   */
  async StorageRead(this: BusyBar, params: DownloadFileParams): Promise<StorageReadResponse> {
    return await readStorageApi(this.apiClient, params);
  }

  /**
   * List files on internal storage.
   *
   * @param {ReadDirectoryParams} params - List parameters:
   *   @param {string} params.path - Path to the directory.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<StorageList>} A promise that resolves to a list of files and directories.
   */
  async StorageListGet(this: BusyBar, params: ReadDirectoryParams): Promise<StorageList> {
    return await listStorageApi(this.apiClient, params);
  }

  /**
   * Remove a file on internal storage. Removes a file with a specified path.
   *
   * @param {RemoveParams} params - Remove parameters:
   *   @param {string} params.path - Path to the file to remove.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} A promise that resolves on successful removal.
   */
  async StorageRemove(this: BusyBar, params: RemoveParams): Promise<SuccessResponse> {
    return await removeStorageApi(this.apiClient, params);
  }

  /**
   * Create a directory on internal storage. Creates a new directory with a specified path.
   *
   * @param {CreateDirectoryParams} params - Directory creation parameters:
   *   @param {string} params.path - Path to the new directory.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} A promise that resolves on successful creation.
   */
  async StorageMkdir(this: BusyBar, params: CreateDirectoryParams): Promise<SuccessResponse> {
    return await mkdirStorageApi(this.apiClient, params);
  }

  /**
   * Show storage usage.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<StorageStatus>} A promise that resolves to the storage status.
   */
  async StorageStatusGet(this: BusyBar, params?: TimeoutOptions): Promise<StorageStatus> {
    return await statusStorageApi(this.apiClient, params);
  }
}
