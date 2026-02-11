import { getClient, withTimeout } from "BusyBar/api/createClient";
import type { TimeoutOptions } from "Global/types";
import { operations } from "src/Global/API";

async function getTime(params?: TimeoutOptions) {
  const client = getClient();

  const { data, error } = await withTimeout(
    (signal) => client.GET("/time", { signal }),
    params?.timeout,
  );

  if (error) {
    throw error;
  }

  return data;
}

export interface SetTimestampParams extends TimeoutOptions {
  timestamp: operations["setTimeTimestamp"]["parameters"]["query"]["timestamp"];
}

async function setTimestamp(params: SetTimestampParams) {
  const client = getClient();

  const { data, error } = await withTimeout(
    (signal) =>
      client.POST("/time/timestamp", {
        params: {
          query: { ...params, timeout: undefined },
        },
        signal,
      }),
    params.timeout,
  );

  if (error) {
    throw error;
  }

  return data;
}

async function getTimezone(params?: TimeoutOptions) {
  const client = getClient();

  const { data, error } = await withTimeout(
    (signal) => client.GET("/time/timezone", { signal }),
    params?.timeout,
  );

  if (error) {
    throw error;
  }

  return data;
}

export interface SetTimezoneParams extends TimeoutOptions {
  timezone: operations["setTimeTimezone"]["parameters"]["query"]["timezone"];
}

async function setTimezone(params: SetTimezoneParams) {
  const client = getClient();

  const { data, error } = await withTimeout(
    (signal) =>
      client.POST("/time/timezone", {
        params: {
          query: { ...params, timeout: undefined },
        },
        signal,
      }),
    params.timeout,
  );

  if (error) {
    throw error;
  }

  return data;
}

async function getTzList(params?: TimeoutOptions) {
  const client = getClient();

  const { data, error } = await withTimeout(
    (signal) => client.GET("/time/tzlist", { signal }),
    params?.timeout,
  );

  if (error) {
    throw error;
  }

  return data;
}

export { getTime, setTimestamp, getTimezone, setTimezone, getTzList };
