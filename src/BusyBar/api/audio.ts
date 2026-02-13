import { withTimeout, type BusyBarClient } from "BusyBar/api/createClient";
import type { TimeoutOptions } from "Global/types";
import { paths, operations } from "Global/API";

export interface AudioPlayParams extends TimeoutOptions {
  appId: paths["/audio/play"]["post"]["parameters"]["query"]["app_id"];
  path: paths["/audio/play"]["post"]["parameters"]["query"]["path"];
}

async function play(client: BusyBarClient, params: AudioPlayParams) {
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

async function stop(client: BusyBarClient, params?: TimeoutOptions) {
  const { data, error } = await withTimeout(
    (signal) => client.DELETE("/audio/play", { signal }),
    params?.timeout,
  );

  if (error) {
    throw error;
  }

  return data;
}

async function getAudioVolume(client: BusyBarClient, params?: TimeoutOptions) {
  const { data, error } = await withTimeout(
    (signal) => client.GET("/audio/volume", { signal }),
    params?.timeout,
  );

  if (error) {
    throw error;
  }

  return data;
}

export interface AudioVolumeParams extends TimeoutOptions {
  volume: operations["setAudioVolume"]["parameters"]["query"]["volume"];
}
async function setAudioVolume(
  client: BusyBarClient,
  params: AudioVolumeParams,
) {
  const { volume } = params;

  if (typeof volume !== "number" || volume < 0 || volume > 100) {
    throw new Error("Volume must be a number between 0 and 100");
  }

  const { data, error } = await withTimeout(
    (signal) =>
      client.POST("/audio/volume", {
        params: {
          query: {
            volume,
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

export { play, stop, getAudioVolume, setAudioVolume };
