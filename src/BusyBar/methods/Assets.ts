import { upload as uploadAssetsApi, deleteAssets as deleteAssetsApi, UploadParams, DeleteParams } from 'BusyBar/api/assets';
import type { SuccessResponse } from 'BusyBar/types';
import { BusyBar } from 'BusyBar/index';

export class AssetsMethods {
  /**
   * Upload asset file with app ID. Uploads a file to a specific app's assets directory.
   *
   * @param {UploadParams} params - Parameters for the upload.
   *   @param {UploadParams['application_name']} params.application_name - Application name for organizing assets.
   *   @param {UploadParams['file']} params.file - Filename for the uploaded asset.
   *   @param {UploadParams['data']} params.data - File data to upload.
   *   @param {UploadParams['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {UploadParams['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} Result of the upload operation.
   */
  async AssetsUpload(this: BusyBar, params: UploadParams): Promise<SuccessResponse> {
    return await uploadAssetsApi(this.apiClient, params);
  }

  /**
   * Delete app assets. Deletes all assets for a specific app ID.
   *
   * @param {DeleteParams} params - Parameters for the delete.
   *   @param {DeleteParams['application_name']} params.application_name - Application name whose assets should be deleted.
   *   @param {DeleteParams['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {DeleteParams['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} Result of the delete operation.
   */
  async AssetsDelete(this: BusyBar, params: DeleteParams): Promise<SuccessResponse> {
    return await deleteAssetsApi(this.apiClient, params);
  }
}
