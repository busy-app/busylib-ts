import { getClient, withTimeout } from "BusyBar/api/createClient";
import type { TimeoutOptions } from "Global/types";
import type { operations } from "Global/API";
import type { BusyFile } from "BusyBar/types/global";

export interface UploadFileParams extends TimeoutOptions {
  path: operations["writeStorageFile"]["parameters"]["query"]["path"];
  file: BusyFile;
}

async function write(params: UploadFileParams) {
  const client = getClient();

  const { path, file } = params;

  const { data, error } = await withTimeout(
    (signal) =>
      client.POST("/storage/write", {
        params: {
          query: {
            path,
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

export interface DownloadFileParams extends TimeoutOptions {
  path: operations["readStorageFile"]["parameters"]["query"]["path"];
  asArrayBuffer?: boolean;
}

async function read(params: DownloadFileParams) {
  const client = getClient();

  const { path, asArrayBuffer } = params;

  const { data, error } = await withTimeout(
    (signal) =>
      client.GET("/storage/read", {
        params: {
          query: {
            path,
          },
        },
        parseAs: asArrayBuffer ? "arrayBuffer" : "blob",
        signal,
      }),
    params.timeout,
  );

  if (error) {
    throw error;
  }

  return data;
}

export interface ReadDirectoryParams extends TimeoutOptions {
  path: operations["listStorageFiles"]["parameters"]["query"]["path"];
}

async function list(params: ReadDirectoryParams) {
  const client = getClient();

  const { path } = params;

  const { data, error } = await withTimeout(
    (signal) =>
      client.GET("/storage/list", {
        params: {
          query: {
            path,
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

export interface RemoveParams extends TimeoutOptions {
  path: operations["removeStorageFile"]["parameters"]["query"]["path"];
}

async function remove(params: RemoveParams) {
  const client = getClient();

  const { path } = params;

  const { data, error } = await withTimeout(
    (signal) =>
      client.DELETE("/storage/remove", {
        params: {
          query: {
            path,
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

export interface CreateDirectoryParams extends TimeoutOptions {
  path: operations["createStorageDir"]["parameters"]["query"]["path"];
}

async function mkdir(params: CreateDirectoryParams) {
  const client = getClient();

  const { path } = params;

  const { data, error } = await withTimeout(
    (signal) =>
      client.POST("/storage/mkdir", {
        params: {
          query: {
            path,
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

async function status(params?: TimeoutOptions) {
  const client = getClient();

  const { data, error } = await withTimeout(
    (signal) => client.GET("/storage/status", { signal }),
    params?.timeout,
  );

  if (error) {
    throw error;
  }

  return data;
}

export { write, read, list, remove, mkdir, status };
