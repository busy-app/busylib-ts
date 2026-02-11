import { getClient, withTimeout } from "BusyBar/api/createClient";
import type { TimeoutOptions } from "Global/types";
import type { operations } from "Global/API";

async function getAccountState(params?: TimeoutOptions) {
  const client = getClient();

  const { data, error } = await withTimeout(
    (signal) => client.GET("/account/status", { signal }),
    params?.timeout,
  );

  if (error) {
    throw error;
  }

  return data;
}

async function getAccountInfo(params?: TimeoutOptions) {
  const client = getClient();

  const { data, error } = await withTimeout(
    (signal) => client.GET("/account/info", { signal }),
    params?.timeout,
  );

  if (error) {
    throw error;
  }

  return data;
}

async function getAccountProfile(params?: TimeoutOptions) {
  const client = getClient();

  const { data, error } = await withTimeout(
    (signal) => client.GET("/account/profile", { signal }),
    params?.timeout,
  );

  if (error) {
    throw error;
  }

  return data;
}

export interface SetAccountProfileParams extends TimeoutOptions {
  profile: operations["setAccountProfile"]["parameters"]["query"]["profile"];
}

async function setAccountProfile(params: SetAccountProfileParams) {
  const client = getClient();

  const { profile } = params;

  const { data, error } = await withTimeout(
    (signal) =>
      client.POST("/account/profile", {
        params: {
          query: {
            profile,
          },
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

async function unlinkDevice(params?: TimeoutOptions) {
  const client = getClient();

  const { data, error } = await withTimeout(
    (signal) => client.DELETE("/account", { signal }),
    params?.timeout,
  );

  if (error) {
    throw error;
  }

  return data;
}

async function linkDevice(params?: TimeoutOptions) {
  const client = getClient();

  const { data, error } = await withTimeout(
    (signal) => client.POST("/account/link", { signal }),
    params?.timeout,
  );

  if (error) {
    throw error;
  }

  return data;
}

export {
  getAccountState,
  getAccountInfo,
  getAccountProfile,
  setAccountProfile,
  unlinkDevice,
  linkDevice,
};
