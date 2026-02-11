import { getClient, withTimeout } from "BusyBar/api/createClient";
import type { TimeoutOptions } from "Global/types";
import type { BusyFile } from "BusyBar/types/global";

export interface UpdateParams extends TimeoutOptions {
  file: BusyFile;
}

async function update(params: UpdateParams) {
  const client = getClient();

  const { file } = params;

  const { data, error } = await withTimeout(
    (signal) =>
      client.POST("/update", {
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

async function check(params?: TimeoutOptions) {
  const client = getClient();

  const { data, error } = await withTimeout(
    (signal) => client.POST("/update/check", { signal }),
    params?.timeout,
  );

  if (error) {
    throw error;
  }

  return data;
}

async function status(params?: TimeoutOptions) {
  const client = getClient();

  const { data, error } = await withTimeout(
    (signal) => client.GET("/update/status", { signal }),
    params?.timeout,
  );

  if (error) {
    throw error;
  }

  return data;
}

export interface ChangelogParams extends TimeoutOptions {
  version: string;
}

async function changelog(params: ChangelogParams) {
  const client = getClient();

  const { version } = params;

  const { data, error } = await withTimeout(
    (signal) =>
      client.GET("/update/changelog", {
        params: {
          query: {
            version,
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

export interface InstallParams extends TimeoutOptions {
  version: string;
}

async function install(params: InstallParams) {
  const client = getClient();

  const { version } = params;

  const { data, error } = await withTimeout(
    (signal) =>
      client.POST("/update/install", {
        params: {
          query: {
            version,
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

async function abort(params?: TimeoutOptions) {
  const client = getClient();

  const { data, error } = await withTimeout(
    (signal) => client.POST("/update/abort_download", { signal }),
    params?.timeout,
  );

  if (error) {
    throw error;
  }

  return data;
}

export { update, check, status, changelog, install, abort };
