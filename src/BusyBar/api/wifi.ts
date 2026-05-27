import type { BusyBarClient } from 'BusyBar/types/internal';
import type { RequestOptions, WifiConnectRequestConfig } from 'BusyBar/types';
import type { RequireKeys } from 'Global/types.utils';

async function status(client: BusyBarClient, params?: RequestOptions) {
  const { data, error } = await client.execute((signal) => client.GET('/wifi/status', { signal }), params);

  if (error) {
    throw error;
  }

  return data;
}

type RequiredIpConfig = RequireKeys<NonNullable<WifiConnectRequestConfig['ip_config']>, 'ip_method'>;

export type ConnectParams = RequireKeys<Omit<WifiConnectRequestConfig, 'ip_config'> & { ip_config: RequiredIpConfig }, 'ssid' | 'security' | 'ip_config'> &
  RequestOptions;

async function connect(client: BusyBarClient, params: ConnectParams) {
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
