import type { BusyBarClient } from 'BusyBar/types/internal';
import type { RequestOptions, LogDumpParams } from 'BusyBar/types';

async function version(client: BusyBarClient, options?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.GET('/version', {
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
      client.GET('/status', {
        signal
      }),
    options
  );

  if (error) {
    throw error;
  }

  return data;
}

async function systemStatus(client: BusyBarClient, options?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.GET('/status/system', {
        signal
      }),
    options
  );

  if (error) {
    throw error;
  }

  return data;
}

async function powerStatus(client: BusyBarClient, options?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.GET('/status/power', {
        signal
      }),
    options
  );

  if (error) {
    throw error;
  }

  return data;
}

async function deviceStatus(client: BusyBarClient, options?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.GET('/status/device', {
        signal
      }),
    options
  );

  if (error) {
    throw error;
  }

  return data;
}

async function firmwareStatus(client: BusyBarClient, options?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.GET('/status/firmware', {
        signal
      }),
    options
  );

  if (error) {
    throw error;
  }

  return data;
}

async function transport(client: BusyBarClient, options?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.GET('/transport', {
        signal
      }),
    options
  );

  if (error) {
    throw error;
  }

  return data;
}

async function logDump(client: BusyBarClient, params?: LogDumpParams, options?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.POST('/log_dump', {
        params: {
          query: {
            filename: params?.filename
          }
        },
        signal
      }),
    options
  );

  if (error) {
    throw error;
  }

  return data;
}

export { version, status, systemStatus, powerStatus, deviceStatus, firmwareStatus, transport, logDump };
