import type { BusyBarClient } from 'BusyBar/types/internal';
import type { RequestOptions, WifiConnectParams } from 'BusyBar/types';

async function status(client: BusyBarClient, params?: RequestOptions) {
  const { data, error } = await client.execute((signal) => client.GET('/wifi/status', { signal }), params);

  if (error) {
    throw error;
  }

  return data;
}

async function connect(client: BusyBarClient, params: WifiConnectParams) {
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
    params
  );

  if (error) {
    throw error;
  }

  return data;
}

async function disconnect(client: BusyBarClient, params?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.POST('/wifi/disconnect', {
        signal
      }),
    params
  );

  if (error) {
    throw error;
  }

  return data;
}

async function networks(client: BusyBarClient, params?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.GET('/wifi/networks', {
        signal
      }),
    params
  );

  if (error) {
    throw error;
  }

  return data;
}

export { status, connect, disconnect, networks };
