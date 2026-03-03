import { withTimeout, type BusyBarClient } from 'BusyBar/api/createClient';
import type { TimeoutOptions } from 'Global/types';
import type { operations } from 'Global/API';

async function getAccountState(client: BusyBarClient, params?: TimeoutOptions) {
  const { data, error } = await withTimeout((signal) => client.GET('/account/status', { signal }), params?.timeout);

  if (error) {
    throw error;
  }

  return data;
}

async function getAccountInfo(client: BusyBarClient, params?: TimeoutOptions) {
  const { data, error } = await withTimeout((signal) => client.GET('/account/info', { signal }), params?.timeout);

  if (error) {
    throw error;
  }

  return data;
}

async function getAccountProfile(client: BusyBarClient, params?: TimeoutOptions) {
  const { data, error } = await withTimeout((signal) => client.GET('/account/profile', { signal }), params?.timeout);

  if (error) {
    throw error;
  }

  return data;
}

export interface SetAccountProfileParams extends TimeoutOptions {
  profile: operations['setAccountProfile']['parameters']['query']['profile'];
}

async function setAccountProfile(client: BusyBarClient, params: SetAccountProfileParams) {
  const { profile } = params;

  const { data, error } = await withTimeout(
    (signal) =>
      client.POST('/account/profile', {
        params: {
          query: {
            profile
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

async function unlinkDevice(client: BusyBarClient, params?: TimeoutOptions) {
  const { data, error } = await withTimeout((signal) => client.DELETE('/account', { signal }), params?.timeout);

  if (error) {
    throw error;
  }

  return data;
}

async function linkDevice(client: BusyBarClient, params?: TimeoutOptions) {
  const { data, error } = await withTimeout((signal) => client.POST('/account/link', { signal }), params?.timeout);

  if (error) {
    throw error;
  }

  return data;
}

export { getAccountState, getAccountInfo, getAccountProfile, setAccountProfile, unlinkDevice, linkDevice };
