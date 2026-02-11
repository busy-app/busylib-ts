import { getClient, withTimeout } from "BusyBar/api/createClient";
import type { TimeoutOptions } from "Global/types";

async function enable(params?: TimeoutOptions) {
  const client = getClient();

  const { data, error } = await withTimeout(
    (signal) => client.POST("/ble/enable", { signal }),
    params?.timeout,
  );

  if (error) {
    throw error;
  }

  return data;
}

async function disable(params?: TimeoutOptions) {
  const client = getClient();

  const { data, error } = await withTimeout(
    (signal) => client.POST("/ble/disable", { signal }),
    params?.timeout,
  );

  if (error) {
    throw error;
  }

  return data;
}

async function pairing(params?: TimeoutOptions) {
  const client = getClient();

  const { data, error } = await withTimeout(
    (signal) => client.DELETE("/ble/pairing", { signal }),
    params?.timeout,
  );

  if (error) {
    throw error;
  }

  return data;
}

async function status(params?: TimeoutOptions) {
  const client = getClient();

  const { data, error } = await withTimeout(
    (signal) => client.GET("/ble/status", { signal }),
    params?.timeout,
  );

  if (error) {
    throw error;
  }

  return data;
}

export { enable, disable, pairing, status };
