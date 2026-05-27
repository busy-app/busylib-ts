import type { BusyBarClient } from 'BusyBar/types/internal';
import type { RequestOptions } from 'BusyBar/types';

async function version(client: BusyBarClient, params?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.GET('/version', {
        signal
      }),
    params
  );

  if (error) {
    throw error;
  }

  return data;
}

async function status(client: BusyBarClient, params?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.GET('/status', {
        signal
      }),
    params
  );

  if (error) {
    throw error;
  }

  return data;
}

async function systemStatus(client: BusyBarClient, params?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.GET('/status/system', {
        signal
      }),
    params
  );

  if (error) {
    throw error;
  }

  return data;
}

async function powerStatus(client: BusyBarClient, params?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.GET('/status/power', {
        signal
      }),
    params
  );

  if (error) {
    throw error;
  }

  return data;
}

async function deviceStatus(client: BusyBarClient, params?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.GET('/status/device', {
        signal
      }),
    params
  );

  if (error) {
    throw error;
  }

  return data;
}

async function firmwareStatus(client: BusyBarClient, params?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.GET('/status/firmware', {
        signal
      }),
    params
  );

  if (error) {
    throw error;
  }

  return data;
}

async function transport(client: BusyBarClient, params?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.GET('/transport', {
        signal
      }),
    params
  );

  if (error) {
    throw error;
  }

  return data;
}

export { version, status, systemStatus, powerStatus, deviceStatus, firmwareStatus, transport };
