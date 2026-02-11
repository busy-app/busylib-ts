import { getClient, withTimeout } from "BusyBar/api/createClient";
import type { TimeoutOptions } from "Global/types";
import type { operations } from "Global/API";
import type { NameInfo } from "Global/types";

async function getHttpAccess(params?: TimeoutOptions) {
  const client = getClient();

  const { data, error } = await withTimeout(
    (signal) => client.GET("/access", { signal }),
    params?.timeout,
  );

  if (error) {
    throw error;
  }

  return data;
}

export interface HttpAccessParams extends TimeoutOptions {
  mode: operations["setHttpAccess"]["parameters"]["query"]["mode"];
  key: operations["setHttpAccess"]["parameters"]["query"]["key"];
}
async function setHttpAccess(params: HttpAccessParams) {
  const client = getClient();

  let { mode, key } = params;
  key = key ?? "";

  if (String(key).trim() && !/^\d{4,10}$/.test(String(key))) {
    throw new Error("Key must be a string of 4 to 10 digits");
  }

  const { data, error } = await withTimeout(
    (signal) =>
      client.POST("/access", {
        params: {
          query: {
            mode,
            key,
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

async function getName(params?: TimeoutOptions) {
  const client = getClient();

  const { data, error } = await withTimeout(
    (signal) => client.GET("/name", { signal }),
    params?.timeout,
  );

  if (error) {
    throw error;
  }

  return data;
}

export interface NameParams extends TimeoutOptions {
  name: NameInfo["name"];
}

async function setName(params: NameParams) {
  const client = getClient();

  const { data, error } = await withTimeout(
    (signal) =>
      client.POST("/name", {
        body: params,
        signal,
      }),
    params.timeout,
  );

  if (error) {
    throw error;
  }

  return data;
}

export { getHttpAccess, setHttpAccess, getName, setName };
