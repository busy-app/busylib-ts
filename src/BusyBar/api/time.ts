import type { BusyBarClient } from 'BusyBar/types/internal';
import type { TimeoutOptions, TimestampInfo, SetTimezoneQuery } from 'BusyBar/types';

async function getTime(client: BusyBarClient, params?: TimeoutOptions) {
  const { data, error } = await client.withTimeout((signal) => client.GET('/time', { signal }), params?.timeout);

  if (error) {
    throw error;
  }

  return data;
}

export interface SetTimestampParams extends TimeoutOptions, TimestampInfo {}

async function setTimestamp(client: BusyBarClient, params: SetTimestampParams) {
  const { timestamp } = params;

  const { data, error } = await client.withTimeout(
    (signal) =>
      client.POST('/time/timestamp', {
        params: {
          query: { timestamp }
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

async function getTimezone(client: BusyBarClient, params?: TimeoutOptions) {
  const { data, error } = await client.withTimeout((signal) => client.GET('/time/timezone', { signal }), params?.timeout);

  if (error) {
    throw error;
  }

  return data;
}

export interface SetTimezoneParams extends TimeoutOptions, SetTimezoneQuery {}

async function setTimezone(client: BusyBarClient, params: SetTimezoneParams) {
  const { timezone } = params;

  const { data, error } = await client.withTimeout(
    (signal) =>
      client.POST('/time/timezone', {
        params: {
          query: { timezone }
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

async function getTzList(client: BusyBarClient, params?: TimeoutOptions) {
  const { data, error } = await client.withTimeout((signal) => client.GET('/time/tzlist', { signal }), params?.timeout);

  if (error) {
    throw error;
  }

  return data;
}

export { getTime, setTimestamp, getTimezone, setTimezone, getTzList };
