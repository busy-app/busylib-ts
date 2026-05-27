import type { BusyBarClient } from 'BusyBar/types/internal';
import type { RequestOptions, AssetsUploadQuery, AssetsDeleteQuery, BusyFile } from 'BusyBar/types';

export interface UploadParams extends RequestOptions, AssetsUploadQuery {
  data: BusyFile;
}

async function upload(client: BusyBarClient, params: UploadParams) {
  const { application_name, file, data } = params;

  const { data: responseData, error } = await client.execute(
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
    params
  );

  if (error) {
    throw error;
  }

  return responseData;
}

export interface DeleteParams extends RequestOptions, AssetsDeleteQuery {}

async function deleteAssets(client: BusyBarClient, params: DeleteParams) {
  const { application_name } = params;

  const { data, error } = await client.execute(
    (signal) =>
      client.DELETE('/assets/upload', {
        params: {
          query: {
            application_name
          }
        },
        signal
      }),
    params
  );

  if (error) {
    throw error;
  }

  return data;
}

export { upload, deleteAssets };
