import { getClient, withTimeout } from "BusyBar/api/createClient";
import type { TimeoutOptions } from "Global/types";

async function getMqttStatus(params?: TimeoutOptions) {
  const client = getClient();

  const { data, error } = await withTimeout(
    (signal) => client.GET("/account", { signal }),
    params?.timeout
  );

  if (error) {
    throw error;
  }

  return data;
}

async function unlinkDevice(params?: TimeoutOptions) {
  const client = getClient();

  const { data, error } = await withTimeout(
    (signal) => client.DELETE("/account", { signal }),
    params?.timeout
  );

  if (error) {
    throw error;
  }

  return data;
}

async function linkDevice(params?: TimeoutOptions) {
  const client = getClient();

  const { data, error } = await withTimeout(
    (signal) => client.POST("/account/link", { signal }),
    params?.timeout
  );

  if (error) {
    throw error;
  }

  return data;
}

export { getMqttStatus, unlinkDevice, linkDevice };
