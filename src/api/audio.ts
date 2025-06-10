import { client } from "api/createClient";
import { paths } from "types/APIv0";

export interface AudioParams {
  appId: paths["/v0/audio/play"]["post"]["parameters"]["query"]["app_id"];
  path: paths["/v0/audio/play"]["post"]["parameters"]["query"]["path"];
}

async function play(params: AudioParams) {
  const { appId, path } = params;

  if (!client) {
    throw new Error("API client is not initialized");
  }

  const { data, error } = await client.POST("/v0/audio/play", {
    params: {
      query: {
        app_id: appId,
        path,
      },
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

async function stop() {
  if (!client) {
    throw new Error("API client is not initialized");
  }

  const { data, error } = await client.DELETE("/v0/audio/play");

  if (error) {
    throw error;
  }

  return data;
}

export { play, stop };
