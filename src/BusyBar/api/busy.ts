import type { BusyBarClient } from 'BusyBar/types/internal';
import type { RequestOptions, BusySnapshotSetParams, BusyProfileGetParams, BusyProfileSetParams } from 'BusyBar/types';

async function getSnapshot(client: BusyBarClient, params?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.GET('/busy/snapshot', {
        signal
      }),
    params
  );

  if (error) {
    throw error;
  }

  return data;
}

async function setSnapshot(client: BusyBarClient, params: BusySnapshotSetParams) {
  const { timeout, signal: _signal, ...body } = params;

  const { data, error } = await client.execute(
    (signal) =>
      client.PUT('/busy/snapshot', {
        body,
        signal
      }),
    params
  );

  if (error) {
    throw error;
  }

  return data;
}

async function getProfile(client: BusyBarClient, params: BusyProfileGetParams) {
  const { slot } = params;

  const { data, error } = await client.execute(
    (signal) =>
      client.GET('/busy/profiles/{slot}', {
        params: {
          path: { slot }
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

async function setProfile(client: BusyBarClient, params: BusyProfileSetParams) {
  const { slot, timeout, signal: _signal, ...body } = params;

  const { data, error } = await client.execute(
    (signal) =>
      client.PUT('/busy/profiles/{slot}', {
        params: {
          path: { slot }
        },
        body,
        signal
      }),
    params
  );

  if (error) {
    throw error;
  }

  return data;
}

export { getSnapshot, setSnapshot, getProfile, setProfile };
