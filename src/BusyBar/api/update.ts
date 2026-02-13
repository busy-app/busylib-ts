import { withTimeout, type BusyBarClient } from "BusyBar/api/createClient";
import type { TimeoutOptions } from "Global/types";
import type { BusyFile } from "BusyBar/types/global";

export interface UpdateParams extends TimeoutOptions {
  file: BusyFile;
}

async function update(client: BusyBarClient, params: UpdateParams) {
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

async function check(client: BusyBarClient, params?: TimeoutOptions) {
  const { data, error } = await withTimeout(
    (signal) => client.POST("/update/check", { signal }),
    params?.timeout,
  );

  if (error) {
    throw error;
  }

  return data;
}

async function status(client: BusyBarClient, params?: TimeoutOptions) {
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

async function changelog(client: BusyBarClient, params: ChangelogParams) {
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

async function install(client: BusyBarClient, params: InstallParams) {
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

async function abort(client: BusyBarClient, params?: TimeoutOptions) {
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
