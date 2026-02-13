import { withTimeout, type BusyBarClient } from "BusyBar/api/createClient";
import type { TimeoutOptions } from "Global/types";
import type { paths } from "Global/API";
import type { BusyFile } from "BusyBar/types/global";

export interface UploadParams extends TimeoutOptions {
  appId: paths["/assets/upload"]["post"]["parameters"]["query"]["app_id"];
  fileName: paths["/assets/upload"]["post"]["parameters"]["query"]["file"];
  file: BusyFile;
}
async function upload(client: BusyBarClient, params: UploadParams) {
  const { appId, fileName, file } = params;

  const { data, error } = await withTimeout(
    (signal) =>
      client.POST("/assets/upload", {
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
        signal,
      }),
    params.timeout,
  );

  if (error) {
    throw error;
  }

  return data;
}

export interface DeleteParams extends TimeoutOptions {
  appId: paths["/assets/upload"]["delete"]["parameters"]["query"]["app_id"];
}
async function deleteAssets(client: BusyBarClient, params: DeleteParams) {
  const { appId } = params;

  const { data, error } = await withTimeout(
    (signal) =>
      client.DELETE("/assets/upload", {
        params: {
          query: {
            app_id: appId,
          },
        },
        signal,
      }),
    params.timeout,
  );

  if (error) {
    throw error;
  }

  return data;
}

export { upload, deleteAssets };
