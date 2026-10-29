import type { RequestClient, RequestOptions } from 'BusyBar/client/types';
import type { AssetsDeleteParams, AssetsUploadParams } from 'BusyBar/scopes/assets/types';
import type { SuccessResponse } from 'BusyBar/types';

/**
 * Upload asset file with app ID. Upload a file to the application-specific assets directory. If the directory does not yet exist, it will be created automatically. Additionally, if the file name contains a subdirectory, it will be created as well, and the file will be placed inside of it.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {AssetsUploadParams} params - Parameters for the upload.
 *   @param {AssetsUploadParams['application_name']} params.application_name - Application name for organizing assets.
 *   @param {AssetsUploadParams['file']} params.file - File path for the uploaded asset within the app assets directory.
 *   @param {AssetsUploadParams['data']} params.data - File data to upload.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<SuccessResponse>} Result of the upload operation.
 */
export async function assetsUpload(client: RequestClient, params: AssetsUploadParams, options?: RequestOptions): Promise<SuccessResponse> {
  const { application_name, file, data } = params;

  return client.POST('/assets/upload', {
    params: {
      query: {
        application_name,
        file
      }
    },
    headers: {
      'Content-Type': 'application/octet-stream'
    },
    body: data as unknown as string,
    ...options
  });
}

/**
 * Delete app assets. Deletes all assets for a specific app ID.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {AssetsDeleteParams} params - Parameters for the delete.
 *   @param {AssetsDeleteParams['application_name']} params.application_name - Application name whose assets should be deleted.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<SuccessResponse>} Result of the delete operation.
 */
export async function assetsDelete(client: RequestClient, params: AssetsDeleteParams, options?: RequestOptions): Promise<SuccessResponse> {
  const { application_name } = params;

  return client.DELETE('/assets/upload', {
    params: {
      query: {
        application_name
      }
    },
    ...options
  });
}
