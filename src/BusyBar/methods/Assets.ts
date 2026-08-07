import { upload as uploadAssetsApi, deleteAssets as deleteAssetsApi } from 'BusyBar/api/assets';
import type { RequestOptions, SuccessResponse, AssetsUploadParams, AssetsDeleteParams } from 'BusyBar/types';
import { BusyBar } from 'BusyBar/index';

export class AssetsMethods {
  /**
   * Upload asset file with app ID. Upload a file to the application-specific assets directory. If the directory does not yet exist, it will be created automatically. Additionally, if the file name contains a subdirectory, it will be created as well, and the file will be placed inside of it.
   *
   * @param {AssetsUploadParams} params - Parameters for the upload.
   *   @param {AssetsUploadParams['application_name']} params.application_name - Application name for organizing assets.
   *   @param {AssetsUploadParams['file']} params.file - File path for the uploaded asset within the app assets directory.
   *   @param {AssetsUploadParams['data']} params.data - File data to upload.
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} Result of the upload operation.
   */
  async AssetsUpload(this: BusyBar, params: AssetsUploadParams, options?: RequestOptions): Promise<SuccessResponse> {
    return await uploadAssetsApi(this.apiClient, params, options);
  }

  /**
   * Delete app assets. Deletes all assets for a specific app ID.
   *
   * @param {AssetsDeleteParams} params - Parameters for the delete.
   *   @param {AssetsDeleteParams['application_name']} params.application_name - Application name whose assets should be deleted.
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} Result of the delete operation.
   */
  async AssetsDelete(this: BusyBar, params: AssetsDeleteParams, options?: RequestOptions): Promise<SuccessResponse> {
    return await deleteAssetsApi(this.apiClient, params, options);
  }
}
