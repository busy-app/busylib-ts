import { getClient, withTimeout } from "BusyBar/api/createClient";
import type { TimeoutOptions } from "Global/types";

async function status(params?: TimeoutOptions) {
  const client = getClient();

  const { data, error } = await withTimeout(
    (signal) => client.GET("/matter/commissioning", { signal }),
    params?.timeout,
  );

  if (error) {
    throw error;
  }

  return data;
}

async function pairDevice(params?: TimeoutOptions) {
  const client = getClient();

  const { data, error } = await withTimeout(
    (signal) => client.POST("/matter/commissioning", { signal }),
    params?.timeout,
  );

  if (error) {
    throw error;
  }

  return data;
}

async function eraseDevices(params?: TimeoutOptions) {
  const client = getClient();

  const { data, error } = await withTimeout(
    (signal) => client.DELETE("/matter/commissioning", { signal }),
    params?.timeout,
  );

  if (error) {
    throw error;
  }

  return data;
}

export { status, pairDevice, eraseDevices };
