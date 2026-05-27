import type { BusyBarClient } from 'BusyBar/types/internal';
import type { RequestOptions, TimeTimestampParams, TimeTimezoneParams } from 'BusyBar/types';

async function getTime(client: BusyBarClient, params?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.GET('/time', {
        signal
      }),
    params
  );

  if (error) {
    throw error;
  }

  return data;
}

async function setTimestamp(client: BusyBarClient, params: TimeTimestampParams) {
  const { timestamp } = params;

  const { data, error } = await client.execute(
    (signal) =>
      client.POST('/time/timestamp', {
        params: {
          query: { timestamp }
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

async function getTimezone(client: BusyBarClient, params?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.GET('/time/timezone', {
        signal
      }),
    params
  );

  if (error) {
    throw error;
  }

  return data;
}

async function setTimezone(client: BusyBarClient, params: TimeTimezoneParams) {
  const { timezone } = params;

  const { data, error } = await client.execute(
    (signal) =>
      client.POST('/time/timezone', {
        params: {
          query: { timezone }
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

async function getTzList(client: BusyBarClient, params?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.GET('/time/tzlist', {
        signal
      }),
    params
  );

  if (error) {
    throw error;
  }

  return data;
}

export { getTime, setTimestamp, getTimezone, setTimezone, getTzList };
