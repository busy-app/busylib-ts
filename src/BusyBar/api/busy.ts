import type { BusyBarClient } from 'BusyBar/types/internal';
import type { RequestOptions, BusySnapshotSetParams, BusyProfileGetParams, BusyProfileSetParams } from 'BusyBar/types';

async function getSnapshot(client: BusyBarClient, options?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.GET('/busy/snapshot', {
        signal
      }),
    options
  );

  if (error) {
    throw error;
  }

  return data;
}

async function setSnapshot(client: BusyBarClient, params: BusySnapshotSetParams, options?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.PUT('/busy/snapshot', {
        body: params,
        signal
      }),
    options
  );

  if (error) {
    throw error;
  }

  return data;
}

async function getProfile(client: BusyBarClient, params: BusyProfileGetParams, options?: RequestOptions) {
  const { slot } = params;

  const { data, error } = await client.execute(
    (signal) =>
      client.GET('/busy/profiles/{slot}', {
        params: {
          path: { slot }
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

async function setProfile(client: BusyBarClient, params: BusyProfileSetParams, options?: RequestOptions) {
  const { slot, ...body } = params;

  const { data, error } = await client.execute(
    (signal) =>
      client.PUT('/busy/profiles/{slot}', {
        params: {
          path: { slot }
        },
        body,
        signal
      }),
    options
  );

  if (error) {
    throw error;
  }

  return data;
}

export { getSnapshot, setSnapshot, getProfile, setProfile };
