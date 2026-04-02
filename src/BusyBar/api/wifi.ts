import { withTimeout, type BusyBarClient } from 'BusyBar/api/createClient';
import type { TimeoutOptions, WifiConnectRequestConfig } from 'Global/types';
import type { RequireKeys } from 'BusyBar/types/utils';

async function status(client: BusyBarClient, params?: TimeoutOptions) {
  const { data, error } = await withTimeout((signal) => client.GET('/wifi/status', { signal }), params?.timeout);

  if (error) {
    throw error;
  }

  return data;
}

type RequiredIpConfig = RequireKeys<NonNullable<WifiConnectRequestConfig['ip_config']>, 'ip_method'>;

export type ConnectParams = RequireKeys<
  Omit<WifiConnectRequestConfig, 'ip_config'> & { ip_config: RequiredIpConfig },
  'ssid' | 'security' | 'ip_config'
> & TimeoutOptions;

async function connect(client: BusyBarClient, params: ConnectParams) {
  const { ssid, password, security, ip_config } = params;

  const { data, error } = await withTimeout(
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
    params.timeout
  );

  if (error) {
    throw error;
  }

  return data;
}

async function disconnect(client: BusyBarClient, params?: TimeoutOptions) {
  const { data, error } = await withTimeout((signal) => client.POST('/wifi/disconnect', { signal }), params?.timeout);

  if (error) {
    throw error;
  }

  return data;
}

async function networks(client: BusyBarClient, params?: TimeoutOptions) {
  const { data, error } = await withTimeout((signal) => client.GET('/wifi/networks', { signal }), params?.timeout);

  if (error) {
    throw error;
  }

  return data;
}

export { status, connect, disconnect, networks };
