import { upload as uploadAssetsApi, deleteAssets as deleteAssetsApi, UploadParams, DeleteParams } from 'BusyBar/api/assets';
import type { SuccessResponse } from 'BusyBar/types';
import { BusyBar } from 'BusyBar/index';

export class AssetsMethods {
  /**
   * Upload asset file with app ID. Uploads a file to a specific app's assets directory.
   *
   * @param {UploadParams} params - Parameters for the upload.
   *   @param {string} params.application_name - Application name for organizing assets.
   *   @param {string} params.file - Filename for the uploaded asset.
   *   @param {BusyFile} params.data - File data to upload.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} Result of the upload operation.
   */
  async AssetsUpload(this: BusyBar, params: UploadParams): Promise<SuccessResponse> {
    return await uploadAssetsApi(this.apiClient, params);
  }

  /**
   * Delete app assets. Deletes all assets for a specific app ID.
   *
   * @param {DeleteParams} params - Parameters for the delete.
   *   @param {string} params.application_name - Application name whose assets should be deleted.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} Result of the delete operation.
   */
  async AssetsDelete(this: BusyBar, params: DeleteParams): Promise<SuccessResponse> {
    return await deleteAssetsApi(this.apiClient, params);
  }
}
