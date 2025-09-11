import { client } from "BusyBar/api/createClient";
import { paths } from "Global/API";

export interface AudioParams {
  appId: paths["/audio/play"]["post"]["parameters"]["query"]["app_id"];
  path: paths["/audio/play"]["post"]["parameters"]["query"]["path"];
}

async function play(params: AudioParams) {
  const { appId, path } = params;

  if (!client) {
    throw new Error("API client is not initialized");
  }

  const { data, error } = await client.POST("/audio/play", {
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

  const { data, error } = await client.DELETE("/audio/play");

  if (error) {
    throw error;
  }

  return data;
}

export { play, stop };
