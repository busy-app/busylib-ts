import type { BusyBarClient } from 'BusyBar/types/internal';
import type { RequestOptions, AccountProfileSetParams } from 'BusyBar/types';

async function getAccountState(client: BusyBarClient, params?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.GET('/account/status', {
        signal
      }),
    params
  );

  if (error) {
    throw error;
  }

  return data;
}

async function getAccountInfo(client: BusyBarClient, params?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.GET('/account/info', {
        signal
      }),
    params
  );

  if (error) {
    throw error;
  }

  return data;
}

async function getAccountProfile(client: BusyBarClient, params?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.GET('/account/profile', {
        signal
      }),
    params
  );

  if (error) {
    throw error;
  }

  return data;
}

async function setAccountProfile(client: BusyBarClient, params: AccountProfileSetParams) {
  const { profile, custom_url } = params;

  const { data, error } = await client.execute(
    (signal) =>
      client.POST('/account/profile', {
        params: {
          query: {
            profile,
            custom_url
          }
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

async function unlinkDevice(client: BusyBarClient, params?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.DELETE('/account', {
        signal
      }),
    params
  );

  if (error) {
    throw error;
  }

  return data;
}

async function linkDevice(client: BusyBarClient, params?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.POST('/account/link', {
        signal
      }),
    params
  );

  if (error) {
    throw error;
  }

  return data;
}

export { getAccountState, getAccountInfo, getAccountProfile, setAccountProfile, unlinkDevice, linkDevice };
