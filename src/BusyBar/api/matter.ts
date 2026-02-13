import { withTimeout, type BusyBarClient } from "BusyBar/api/createClient";
import type { TimeoutOptions } from "Global/types";

async function status(client: BusyBarClient, params?: TimeoutOptions) {
  const { data, error } = await withTimeout(
    (signal) => client.GET("/matter/commissioning", { signal }),
    params?.timeout,
  );

  if (error) {
    throw error;
  }

  return data;
}

async function pairDevice(client: BusyBarClient, params?: TimeoutOptions) {
  const { data, error } = await withTimeout(
    (signal) => client.POST("/matter/commissioning", { signal }),
    params?.timeout,
  );

  if (error) {
    throw error;
  }

  return data;
}

async function eraseDevices(client: BusyBarClient, params?: TimeoutOptions) {
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
