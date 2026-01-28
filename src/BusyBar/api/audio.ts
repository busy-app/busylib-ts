import { getClient, withTimeout } from "BusyBar/api/createClient";
import type { TimeoutOptions } from "Global/types";
import { paths } from "Global/API";

export interface AudioPlayParams extends TimeoutOptions {
  appId: paths["/audio/play"]["post"]["parameters"]["query"]["app_id"];
  path: paths["/audio/play"]["post"]["parameters"]["query"]["path"];
}

async function play(params: AudioPlayParams) {
  const client = getClient();

  const { appId, path } = params;

  const { data, error } = await withTimeout(
    (signal) =>
      client.POST("/audio/play", {
        params: {
          query: {
            app_id: appId,
            path,
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

async function stop(params?: TimeoutOptions) {
  const client = getClient();

  const { data, error } = await withTimeout(
    (signal) => client.DELETE("/audio/play", { signal }),
    params?.timeout,
  );

  if (error) {
    throw error;
  }

  return data;
}

export { play, stop };
