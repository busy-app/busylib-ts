import type { BusyBarClient } from 'BusyBar/types/internal';
import type { RequestOptions } from 'BusyBar/types';

async function enable(client: BusyBarClient, options?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.POST('/ble/enable', {
        signal
      }),
    options
  );

  if (error) {
    throw error;
  }

  return data;
}

async function disable(client: BusyBarClient, options?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.POST('/ble/disable', {
        signal
      }),
    options
  );

  if (error) {
    throw error;
  }

  return data;
}

async function pairing(client: BusyBarClient, options?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.DELETE('/ble/pairing', {
        signal
      }),
    options
  );

  if (error) {
    throw error;
  }

  return data;
}

async function status(client: BusyBarClient, options?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.GET('/ble/status', {
        signal
      }),
    options
  );

  if (error) {
    throw error;
  }

  return data;
}

export { enable, disable, pairing, status };
