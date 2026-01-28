import { getClient, withTimeout } from "BusyBar/api/createClient";
import type { TimeoutOptions } from "Global/types";
import { components } from "Global/API";

export interface DrawParams extends TimeoutOptions {
  appId: components["schemas"]["DisplayElements"]["app_id"];
  elements: components["schemas"]["DisplayElements"]["elements"];
}

async function draw(params: DrawParams) {
  const client = getClient();

  const { appId, elements } = params;

  const { data, error } = await withTimeout(
    (signal) =>
      client.POST("/display/draw", {
        body: {
          app_id: appId,
          elements: elements,
        },
        signal,
      }),
    params.timeout
  );

  if (error) {
    throw error;
  }

  return data;
}

async function clear(params?: TimeoutOptions) {
  const client = getClient();

  const { data, error } = await withTimeout(
    (signal) => client.DELETE("/display/draw", { signal }),
    params?.timeout
  );

  if (error) {
    throw error;
  }

  return data;
}

export { draw, clear };
