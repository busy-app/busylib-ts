import type { BusyBarClient } from 'BusyBar/api/createClient';
import type { TimeoutOptions } from 'Global/types';

async function enable(client: BusyBarClient, params?: TimeoutOptions) {
  const { data, error } = await client.withTimeout((signal) => client.POST('/ble/enable', { signal }), params?.timeout);

  if (error) {
    throw error;
  }

  return data;
}

async function disable(client: BusyBarClient, params?: TimeoutOptions) {
  const { data, error } = await client.withTimeout((signal) => client.POST('/ble/disable', { signal }), params?.timeout);

  if (error) {
    throw error;
  }

  return data;
}

async function pairing(client: BusyBarClient, params?: TimeoutOptions) {
  const { data, error } = await client.withTimeout((signal) => client.DELETE('/ble/pairing', { signal }), params?.timeout);

  if (error) {
    throw error;
  }

  return data;
}

async function status(client: BusyBarClient, params?: TimeoutOptions) {
  const { data, error } = await client.withTimeout((signal) => client.GET('/ble/status', { signal }), params?.timeout);

  if (error) {
    throw error;
  }

  return data;
}

export { enable, disable, pairing, status };
