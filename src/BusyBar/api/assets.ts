import { client } from "BusyBar/api/createClient";
import type { paths } from "Global/API";
import type { BusyFile } from "BusyBar/types/global";

export interface UploadParams {
  appId: paths["/assets/upload"]["post"]["parameters"]["query"]["app_id"];
  fileName: paths["/assets/upload"]["post"]["parameters"]["query"]["file"];
  file: BusyFile;
}
async function upload(params: UploadParams) {
  const { appId, fileName, file } = params;

  if (!client) {
    throw new Error("API client is not initialized");
  }

  const { data, error } = await client.POST("/assets/upload", {
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
  appId: paths["/assets/upload"]["delete"]["parameters"]["query"]["app_id"];
}
async function deleteAssets(params: DeleteParams) {
  const { appId } = params;

  if (!client) {
    throw new Error("API client is not initialized");
  }

  const { data, error } = await client.DELETE("/assets/upload", {
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
