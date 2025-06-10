import { client } from "api/createClient";
import type { paths } from "types/APIv0";

export interface UploadParams {
  appId: paths["/v0/assets/upload"]["post"]["parameters"]["query"]["app_id"];
  fileName: paths["/v0/assets/upload"]["post"]["parameters"]["query"]["file"];
  file: Buffer | Blob | File | ArrayBuffer;
}
async function upload(params: UploadParams) {
  const { appId, fileName, file } = params;

  if (!client) {
    throw new Error("API client is not initialized");
  }

  const { data, error } = await client.POST("/v0/assets/upload", {
    params: {
      query: {
        app_id: appId,
        file: fileName,
      },
    },
    headers: {
      "Content-Type": "application/octet-stream",
    },
    body: file as unknown as string,
  });

  if (error) {
    throw error;
  }

  return data;
}

export interface DeleteParams {
  appId: paths["/v0/assets/upload"]["delete"]["parameters"]["query"]["app_id"];
}
async function deleteAssets(params: DeleteParams) {
  const { appId } = params;

  if (!client) {
    throw new Error("API client is not initialized");
  }

  const { data, error } = await client.DELETE("/v0/assets/upload", {
    params: {
      query: {
        app_id: appId,
      },
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

export { upload, deleteAssets };
