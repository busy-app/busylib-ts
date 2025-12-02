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

async function pairing() {
  if (!client) {
    throw new Error("API client is not initialized");
  }

  const { data, error } = await client.DELETE("/ble/pairing");

  if (error) {
    throw error;
  }

  return data;
}

async function status() {
  if (!client) {
    throw new Error("API client is not initialized");
  }

  const { data, error } = await client.GET("/ble/status");

  if (error) {
    throw error;
  }

  return data;
}

export { enable, disable, pairing, status };
