import { withTimeout, type BusyBarClient } from 'BusyBar/api/createClient';
import type { TimeoutOptions } from 'Global/types';
import { operations } from 'src/Global/API';

async function getTime(client: BusyBarClient, params?: TimeoutOptions) {
  const { data, error } = await withTimeout((signal) => client.GET('/time', { signal }), params?.timeout);

  if (error) {
    throw error;
  }

  return data;
}

export interface SetTimestampParams extends TimeoutOptions {
  timestamp: operations['setTimeTimestamp']['parameters']['query']['timestamp'];
}

async function setTimestamp(client: BusyBarClient, params: SetTimestampParams) {
  const { data, error } = await withTimeout(
    (signal) =>
      client.POST('/time/timestamp', {
        params: {
          query: { ...params, timeout: undefined }
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
  const { data, error } = await withTimeout((signal) => client.GET('/time/timezone', { signal }), params?.timeout);

  if (error) {
    throw error;
  }

  return data;
}

export interface SetTimezoneParams extends TimeoutOptions {
  timezone: operations['setTimeTimezone']['parameters']['query']['timezone'];
}

async function setTimezone(client: BusyBarClient, params: SetTimezoneParams) {
  const { data, error } = await withTimeout(
    (signal) =>
      client.POST('/time/timezone', {
        params: {
          query: { ...params, timeout: undefined }
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
  const { data, error } = await withTimeout((signal) => client.GET('/time/tzlist', { signal }), params?.timeout);

  if (error) {
    throw error;
  }

  return data;
}

export { getTime, setTimestamp, getTimezone, setTimezone, getTzList };
