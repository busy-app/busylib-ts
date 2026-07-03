import type { BusyBarClient } from 'BusyBar/types/internal';
import type { RequestOptions, WifiConnectParams } from 'BusyBar/types';

async function status(client: BusyBarClient, options?: RequestOptions) {
  const { data, error } = await client.execute((signal) => client.GET('/wifi/status', { signal }), options);

  if (error) {
    throw error;
  }

  return data;
}

async function connect(client: BusyBarClient, params: WifiConnectParams, options?: RequestOptions) {
  const { ssid, password, security, ip_config } = params;

  const { data, error } = await client.execute(
    (signal) =>
      client.POST('/wifi/connect', {
        body: {
          ssid,
          password,
          security,
          ip_config
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

async function disconnect(client: BusyBarClient, options?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.POST('/wifi/disconnect', {
        signal
      }),
    options
  );

  if (error) {
    throw error;
  }

  return data;
}

async function networks(client: BusyBarClient, options?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.GET('/wifi/networks', {
        signal
      }),
    options
  );

  if (error) {
    throw error;
  }

  return data;
}

export { status, connect, disconnect, networks };
