import { client } from "BusyBar/api/createClient";
import type { components, operations } from "BusyBar/types/APIv0";

export interface UploadFileParams {
  path: operations["writeStorageFile"]["parameters"]["query"]["path"];
  file: Buffer | Blob | File | ArrayBuffer;
}

async function write(params: UploadFileParams) {
  if (!client) {
    throw new Error("API client is not initialized");
  }

  const { path, file } = params;

  const { data, error } = await client.POST("/v0/storage/write", {
    params: {
      query: {
        path,
      },
    },
    headers: {
      "Content-Type": "application/octet-stream",
    },
    body: file as unknown as string,
  });

  if (error) {
    throw error;
  }

  return data;
}

export interface DownloadFileParams {
  path: operations["readStorageFile"]["parameters"]["query"]["path"];
  asArrayBuffer?: boolean;
}

async function read(params: DownloadFileParams) {
  if (!client) {
    throw new Error("API client is not initialized");
  }

  const { path, asArrayBuffer } = params;

  const { data, error } = await client.GET("/v0/storage/read", {
    params: {
      query: {
        path,
      },
    },
    parseAs: asArrayBuffer ? "arrayBuffer" : "blob",
  });

  if (error) {
    throw error;
  }

  return data;
}

export interface ReadDirectoryParams {
  path: operations["listStorageFiles"]["parameters"]["query"]["path"];
}
export type StorageListElement = components["schemas"]["StorageListElement"];

async function list(params: ReadDirectoryParams) {
  if (!client) {
    throw new Error("API client is not initialized");
  }

  const { path } = params;

  const { data, error } = await client.GET("/v0/storage/list", {
    params: {
      query: {
        path,
      },
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

export interface RemoveParams {
  path: operations["removeStorageFile"]["parameters"]["query"]["path"];
}

async function remove(params: RemoveParams) {
  if (!client) {
    throw new Error("API client is not initialized");
  }

  const { path } = params;

  const { data, error } = await client.DELETE("/v0/storage/remove", {
    params: {
      query: {
        path,
      },
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

export interface CreateDirectoryParams {
  path: operations["createStorageDir"]["parameters"]["query"]["path"];
}

async function mkdir(params: CreateDirectoryParams) {
  if (!client) {
    throw new Error("API client is not initialized");
  }

  const { path } = params;

  const { data, error } = await client.POST("/v0/storage/mkdir", {
    params: {
      query: {
        path,
      },
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

export { write, read, list, remove, mkdir };
