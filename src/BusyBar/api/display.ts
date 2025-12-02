import { client } from "BusyBar/api/createClient";
import { components } from "Global/API";

export interface DrawParams {
  appId: components["schemas"]["DisplayElements"]["app_id"];
  elements: components["schemas"]["DisplayElements"]["elements"];
}

async function draw(params: DrawParams) {
  if (!client) {
    throw new Error("API client is not initialized");
  }

  const { appId, elements } = params;

  const { data, error } = await client.POST("/display/draw", {
    body: {
      app_id: appId,
      elements: elements,
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

async function clear() {
  if (!client) {
    throw new Error("API client is not initialized");
  }

  const { data, error } = await client.DELETE("/display/draw");

  if (error) {
    throw error;
  }

  return data;
}

export { draw, clear };
