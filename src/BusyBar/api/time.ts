import type { BusyBarClient } from 'BusyBar/types/internal';
import type { RequestOptions, TimeTimestampParams, TimeTimezoneParams } from 'BusyBar/types';

async function getTime(client: BusyBarClient, options?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.GET('/time', {
        signal
      }),
    options
  );

  if (error) {
    throw error;
  }

  return data;
}

async function setTimestamp(client: BusyBarClient, params: TimeTimestampParams, options?: RequestOptions) {
  const { timestamp } = params;

  const { data, error } = await client.execute(
    (signal) =>
      client.POST('/time/timestamp', {
        params: {
          query: { timestamp }
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

async function getTimezone(client: BusyBarClient, options?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.GET('/time/timezone', {
        signal
      }),
    options
  );

  if (error) {
    throw error;
  }

  return data;
}

async function setTimezone(client: BusyBarClient, params: TimeTimezoneParams, options?: RequestOptions) {
  const { timezone } = params;

  const { data, error } = await client.execute(
    (signal) =>
      client.POST('/time/timezone', {
        params: {
          query: { timezone }
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

async function getTzList(client: BusyBarClient, options?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.GET('/time/tzlist', {
        signal
      }),
    options
  );

  if (error) {
    throw error;
  }

  return data;
}

export { getTime, setTimestamp, getTimezone, setTimezone, getTzList };
