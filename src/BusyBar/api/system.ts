import { withTimeout, type BusyBarClient } from 'BusyBar/api/createClient';
import type { TimeoutOptions } from 'Global/types';

async function version(client: BusyBarClient, params?: TimeoutOptions) {
  const { data, error } = await withTimeout((signal) => client.GET('/version', { signal }), params?.timeout);

  if (error) {
    throw error;
  }

  return data;
}

async function status(client: BusyBarClient, params?: TimeoutOptions) {
  const { data, error } = await withTimeout((signal) => client.GET('/status', { signal }), params?.timeout);

  if (error) {
    throw error;
  }

  return data;
}

async function systemStatus(client: BusyBarClient, params?: TimeoutOptions) {
  const { data, error } = await withTimeout((signal) => client.GET('/status/system', { signal }), params?.timeout);

  if (error) {
    throw error;
  }

  return data;
}

async function powerStatus(client: BusyBarClient, params?: TimeoutOptions) {
  const { data, error } = await withTimeout((signal) => client.GET('/status/power', { signal }), params?.timeout);

  if (error) {
    throw error;
  }

  return data;
}

export { version, status, systemStatus, powerStatus };
