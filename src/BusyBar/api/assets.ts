import { withTimeout, type BusyBarClient } from 'BusyBar/api/createClient';
import type { TimeoutOptions, AssetsUploadQuery, AssetsDeleteQuery } from 'Global/types';
import type { BusyFile } from 'BusyBar/types/global';

export interface UploadParams extends TimeoutOptions, AssetsUploadQuery {
  data: BusyFile;
}

async function upload(client: BusyBarClient, params: UploadParams) {
  const { application_name, file, data } = params;

  const { data: responseData, error } = await withTimeout(
    (signal) =>
      client.POST('/assets/upload', {
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
        signal
      }),
    params.timeout
  );

  if (error) {
    throw error;
  }

  return responseData;
}

export interface DeleteParams extends TimeoutOptions, AssetsDeleteQuery {}

async function deleteAssets(client: BusyBarClient, params: DeleteParams) {
  const { application_name } = params;

  const { data, error } = await withTimeout(
    (signal) =>
      client.DELETE('/assets/upload', {
        params: {
          query: {
            application_name
          }
        },
        signal
      }),
    params.timeout
  );

  if (error) {
    throw error;
  }

  return data;
}

export { upload, deleteAssets };
