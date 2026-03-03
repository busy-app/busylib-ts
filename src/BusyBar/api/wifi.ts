import { withTimeout, type BusyBarClient } from 'BusyBar/api/createClient';
import type { TimeoutOptions } from 'Global/types';
import type { components } from 'Global/API';
import type { DeepCamelize, RequireKeys } from 'BusyBar/types/utils';

async function status(client: BusyBarClient, params?: TimeoutOptions) {
  const { data, error } = await withTimeout((signal) => client.GET('/wifi/status', { signal }), params?.timeout);

  if (error) {
    throw error;
  }

  return data;
}

type CamelizedRequest = DeepCamelize<components['schemas']['ConnectRequestConfig']>;

type RequiredIpConfig = RequireKeys<NonNullable<CamelizedRequest['ipConfig']>, 'ipMethod'>;

export type ConnectParams = RequireKeys<Omit<CamelizedRequest, 'ipConfig'> & { ipConfig: RequiredIpConfig }, 'ssid' | 'security' | 'ipConfig'> & TimeoutOptions;

async function connect(client: BusyBarClient, params: ConnectParams) {
  const { data, error } = await withTimeout(
    (signal) =>
      client.POST('/wifi/connect', {
        body: {
          ssid: params.ssid,
          password: params.password,
          security: params.security,
          ip_config: {
            ip_method: params.ipConfig.ipMethod,
            address: params.ipConfig.address,
            mask: params.ipConfig.mask,
            gateway: params.ipConfig.gateway
          }
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
