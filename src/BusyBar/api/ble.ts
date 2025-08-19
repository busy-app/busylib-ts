import { client } from "BusyBar/api/createClient";

async function enable() {
  if (!client) {
    throw new Error("API client is not initialized");
  }

  const { data, error } = await client.POST("/ble/enable");

  if (error) {
    throw error;
  }

  return data;
}

async function disable() {
  if (!client) {
    throw new Error("API client is not initialized");
  }

  const { data, error } = await client.POST("/ble/disable");

  if (error) {
    throw error;
  }

  return data;
}

export { enable, disable };
