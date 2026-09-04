import type { BusyBarClient } from 'BusyBar/types/internal';
import type {
  RequestOptions,
  StorageUploadFileParams,
  StorageDownloadFileParams,
  StorageDownloadFileOptions,
  StorageReadDirectoryParams,
  StorageRemoveParams,
  StorageCreateDirectoryParams,
  StorageRenameParams
} from 'BusyBar/types';

async function write(client: BusyBarClient, params: StorageUploadFileParams, options?: RequestOptions) {
  const { file, ...query } = params;

  const { data, error } = await client.execute(
    (signal) =>
      client.POST('/storage/write', {
        params: {
          query
        },
        headers: {
          'Content-Type': 'application/octet-stream'
        },
        body: file as unknown as string,
        signal
      }),
    options
  );

  if (error) {
    throw error;
  }

  return data;
}

async function read(client: BusyBarClient, params: StorageDownloadFileParams, options?: StorageDownloadFileOptions) {
  const { path } = params;

  const { data, error } = await client.execute(
    (signal) =>
      client.GET('/storage/read', {
        params: {
          query: {
            path
          }
        },
        parseAs: options?.as_array_buffer ? 'arrayBuffer' : 'blob',
        signal
      }),
    options
  );

  if (error) {
    throw error;
  }

  return data;
}

async function list(client: BusyBarClient, params: StorageReadDirectoryParams, options?: RequestOptions) {
  const { path } = params;

  const { data, error } = await client.execute(
    (signal) =>
      client.GET('/storage/list', {
        params: {
          query: {
            path
          }
        },
        signal
      }),
    options
  );

  if (error) {
    throw error;
  }

  return data;
}

async function remove(client: BusyBarClient, params: StorageRemoveParams, options?: RequestOptions) {
  const { path } = params;

  const { data, error } = await client.execute(
    (signal) =>
      client.DELETE('/storage/remove', {
        params: {
          query: {
            path
          }
        },
        signal
      }),
    options
  );

  if (error) {
    throw error;
  }

  return data;
}

async function mkdir(client: BusyBarClient, params: StorageCreateDirectoryParams, options?: RequestOptions) {
  const { path } = params;

  const { data, error } = await client.execute(
    (signal) =>
      client.POST('/storage/mkdir', {
        params: {
          query: {
            path
          }
        },
        signal
      }),
    options
  );

  if (error) {
    throw error;
  }

  return data;
}

async function status(client: BusyBarClient, options?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.GET('/storage/status', {
        signal
      }),
    options
  );

  if (error) {
    throw error;
  }

  return data;
}

async function rename(client: BusyBarClient, params: StorageRenameParams, options?: RequestOptions) {
  const { path, new_path } = params;

  const { data, error } = await client.execute(
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
    options
  );

  if (error) {
    throw error;
  }

  return data;
}

export { write, read, list, remove, mkdir, status, rename };
