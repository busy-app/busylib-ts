import {
  write as writeStorageApi,
  read as readStorageApi,
  list as listStorageApi,
  remove as removeStorageApi,
  mkdir as mkdirStorageApi,
  status as statusStorageApi,
  rename as renameStorageApi,
  UploadFileParams,
  DownloadFileParams,
  ReadDirectoryParams,
  RemoveParams,
  CreateDirectoryParams,
  RenameParams
} from 'BusyBar/api/storage';
import type { RequestOptions, SuccessResponse, StorageReadResponse, StorageList, StorageStatus } from 'BusyBar/types';
import { BusyBar } from 'BusyBar/index';

export class StorageMethods {
  /**
   * Upload file to internal storage. Uploads a file to a specified path.
   *
   * @param {UploadFileParams} params - Upload parameters:
   *   @param {UploadFileParams['path']} params.path - Destination path.
   *   @param {UploadFileParams['file']} params.file - File content.
   *   @param {UploadFileParams['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {UploadFileParams['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves on successful upload.
   */
  async StorageWrite(this: BusyBar, params: UploadFileParams): Promise<SuccessResponse> {
    return await writeStorageApi(this.apiClient, params);
  }

  /**
   * Download file from internal storage. Downloads a file from a specified path.
   *
   * @param {DownloadFileParams} params - Download parameters:
   *   @param {DownloadFileParams['path']} params.path - Path to the file.
   *   @param {DownloadFileParams['as_array_buffer']} [params.as_array_buffer] - Whether to return ArrayBuffer instead of Blob.
   *   @param {DownloadFileParams['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {DownloadFileParams['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<StorageReadResponse>} A promise that resolves to the file content (Blob or ArrayBuffer).
   */
  async StorageRead(this: BusyBar, params: DownloadFileParams): Promise<StorageReadResponse> {
    return await readStorageApi(this.apiClient, params);
  }

  /**
   * List files on internal storage.
   *
   * @param {ReadDirectoryParams} params - List parameters:
   *   @param {ReadDirectoryParams['path']} params.path - Path to the directory.
   *   @param {ReadDirectoryParams['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {ReadDirectoryParams['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<StorageList>} A promise that resolves to a list of files and directories.
   */
  async StorageListGet(this: BusyBar, params: ReadDirectoryParams): Promise<StorageList> {
    return await listStorageApi(this.apiClient, params);
  }

  /**
   * Remove a file on internal storage. Removes a file with a specified path.
   *
   * @param {RemoveParams} params - Remove parameters:
   *   @param {RemoveParams['path']} params.path - Path to the file to remove.
   *   @param {RemoveParams['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {RemoveParams['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves on successful removal.
   */
  async StorageRemove(this: BusyBar, params: RemoveParams): Promise<SuccessResponse> {
    return await removeStorageApi(this.apiClient, params);
  }

  /**
   * Create a directory on internal storage. Creates a new directory with a specified path.
   *
   * @param {CreateDirectoryParams} params - Directory creation parameters:
   *   @param {CreateDirectoryParams['path']} params.path - Path to the new directory.
   *   @param {CreateDirectoryParams['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {CreateDirectoryParams['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves on successful creation.
   */
  async StorageMkdir(this: BusyBar, params: CreateDirectoryParams): Promise<SuccessResponse> {
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
   * @param {RenameParams} params - Rename parameters:
   *   @param {RenameParams['path']} params.path - Current path of the file or directory.
   *   @param {RenameParams['new_path']} params.new_path - New path for the file or directory.
   *   @param {RenameParams['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {RenameParams['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves on successful rename.
   */
  async StorageRename(this: BusyBar, params: RenameParams): Promise<SuccessResponse> {
    return await renameStorageApi(this.apiClient, params);
  }
}
