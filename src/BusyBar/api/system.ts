import { getClient, withTimeout } from "BusyBar/api/createClient";
import type { TimeoutOptions } from "Global/types";
import type { BusyFile } from "BusyBar/types/global";
import { operations } from "src/Global/API";

async function version(params?: TimeoutOptions) {
  const client = getClient();

  const { data, error } = await withTimeout(
    (signal) => client.GET("/version", { signal }),
    params?.timeout,
  );

  if (error) {
    throw error;
  }

  return data;
}

export interface UpdateParams extends TimeoutOptions {
  name?: string;
  file: BusyFile;
}

async function update(params: UpdateParams) {
  const client = getClient();

  const { name, file } = params;

  const { data, error } = await withTimeout(
    (signal) =>
      client.POST("/update", {
        params: {
          query: {
            name,
          },
        },
        headers: {
          "Content-Type": "application/octet-stream",
        },
        body: file as unknown as string,
        signal,
      }),
    params.timeout,
  );

  if (error) {
    throw error;
  }

  return data;
}

async function status(params?: TimeoutOptions) {
  const client = getClient();

  const { data, error } = await withTimeout(
    (signal) => client.GET("/status", { signal }),
    params?.timeout,
  );

  if (error) {
    throw error;
  }

  return data;
}

async function systemStatus(params?: TimeoutOptions) {
  const client = getClient();

  const { data, error } = await withTimeout(
    (signal) => client.GET("/status/system", { signal }),
    params?.timeout,
  );

  if (error) {
    throw error;
  }

  return data;
}

async function powerStatus(params?: TimeoutOptions) {
  const client = getClient();

  const { data, error } = await withTimeout(
    (signal) => client.GET("/status/power", { signal }),
    params?.timeout,
  );

  if (error) {
    throw error;
  }

  return data;
}

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

export {
  version,
  update,
  status,
  systemStatus,
  powerStatus,
  getTime,
  setTimestamp,
  setTimezone,
};
