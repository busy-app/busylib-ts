import { client } from "BusyBar/api/createClient";

async function getMqttStatus() {
  if (!client) {
    throw new Error("API client is not initialized");
  }

  const { data, error } = await client.GET("/account");

  if (error) {
    throw error;
  }

  return data;
}

async function unlinkDevice() {
  if (!client) {
    throw new Error("API client is not initialized");
  }

  const { data, error } = await client.DELETE("/account");

  if (error) {
    throw error;
  }

  return data;
}

async function linkDevice() {
  if (!client) {
    throw new Error("API client is not initialized");
  }

  const { data, error } = await client.POST("/account/link");

  if (error) {
    throw error;
  }

  return data;
}

export { getMqttStatus, unlinkDevice, linkDevice };
