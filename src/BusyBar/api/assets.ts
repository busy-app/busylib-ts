import type { BusyBarClient } from 'BusyBar/types/internal';
import type { AssetsUploadParams, AssetsDeleteParams } from 'BusyBar/types';

async function upload(client: BusyBarClient, params: AssetsUploadParams) {
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

async function deleteAssets(client: BusyBarClient, params: AssetsDeleteParams) {
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
