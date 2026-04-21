import type { BusyBarClient } from 'BusyBar/api/createClient';
import type {
  TimeoutOptions,
  StorageWriteQuery,
  StorageReadQuery,
  StorageListQuery,
  StorageRemoveQuery,
  StorageCreateDirQuery,
  StorageRenameQuery
} from 'Global/types';
import type { BusyFile } from 'BusyBar/types/global';

export interface UploadFileParams extends TimeoutOptions, StorageWriteQuery {
  file: BusyFile;
}

async function write(client: BusyBarClient, params: UploadFileParams) {
  const { path, file } = params;

  const { data, error } = await client.withTimeout(
    (signal) =>
      client.POST('/storage/write', {
        params: {
          query: {
            path
          }
        },
        headers: {
          'Content-Type': 'application/octet-stream'
        },
        body: file as unknown as string,
        signal
      }),
    params.timeout
  );

  if (error) {
    throw error;
  }

  return data;
}

export interface DownloadFileParams extends TimeoutOptions, StorageReadQuery {
  as_array_buffer?: boolean;
}

async function read(client: BusyBarClient, params: DownloadFileParams) {
  const { path, as_array_buffer } = params;

  const { data, error } = await client.withTimeout(
    (signal) =>
      client.GET('/storage/read', {
        params: {
          query: {
            path
          }
        },
        parseAs: as_array_buffer ? 'arrayBuffer' : 'blob',
        signal
      }),
    params.timeout
  );

  if (error) {
    throw error;
  }

  return data;
}

export interface ReadDirectoryParams extends TimeoutOptions, StorageListQuery {}

async function list(client: BusyBarClient, params: ReadDirectoryParams) {
  const { path } = params;

  const { data, error } = await client.withTimeout(
    (signal) =>
      client.GET('/storage/list', {
        params: {
          query: {
            path
          }
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

export interface RemoveParams extends TimeoutOptions, StorageRemoveQuery {}

async function remove(client: BusyBarClient, params: RemoveParams) {
  const { path } = params;

  const { data, error } = await client.withTimeout(
    (signal) =>
      client.DELETE('/storage/remove', {
        params: {
          query: {
            path
          }
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

export interface CreateDirectoryParams extends TimeoutOptions, StorageCreateDirQuery {}

async function mkdir(client: BusyBarClient, params: CreateDirectoryParams) {
  const { path } = params;

  const { data, error } = await client.withTimeout(
    (signal) =>
      client.POST('/storage/mkdir', {
        params: {
          query: {
            path
          }
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

async function status(client: BusyBarClient, params?: TimeoutOptions) {
  const { data, error } = await client.withTimeout((signal) => client.GET('/storage/status', { signal }), params?.timeout);

  if (error) {
    throw error;
  }

  return data;
}

export interface RenameParams extends TimeoutOptions, StorageRenameQuery {}

async function rename(client: BusyBarClient, params: RenameParams) {
  const { path, new_path } = params;

  const { data, error } = await client.withTimeout(
    (signal) =>
      client.POST('/storage/rename', {
        params: {
          query: {
            path,
            new_path
          }
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

export { write, read, list, remove, mkdir, status, rename };
