import type { BusyBarClient } from 'BusyBar/types/internal';
import type {
  RequestOptions,
  StorageUploadFileParams,
  StorageDownloadFileParams,
  StorageReadDirectoryParams,
  StorageRemoveParams,
  StorageCreateDirectoryParams,
  StorageRenameParams
} from 'BusyBar/types';

async function write(client: BusyBarClient, params: StorageUploadFileParams) {
  const { path, file } = params;

  const { data, error } = await client.execute(
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
    params
  );

  if (error) {
    throw error;
  }

  return data;
}

async function read(client: BusyBarClient, params: StorageDownloadFileParams) {
  const { path, as_array_buffer } = params;

  const { data, error } = await client.execute(
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
    params
  );

  if (error) {
    throw error;
  }

  return data;
}

async function list(client: BusyBarClient, params: StorageReadDirectoryParams) {
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
    params
  );

  if (error) {
    throw error;
  }

  return data;
}

async function remove(client: BusyBarClient, params: StorageRemoveParams) {
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
    params
  );

  if (error) {
    throw error;
  }

  return data;
}

async function mkdir(client: BusyBarClient, params: StorageCreateDirectoryParams) {
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
    params
  );

  if (error) {
    throw error;
  }

  return data;
}

async function status(client: BusyBarClient, params?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.GET('/storage/status', {
        signal
      }),
    params
  );

  if (error) {
    throw error;
  }

  return data;
}

async function rename(client: BusyBarClient, params: StorageRenameParams) {
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
    params
  );

  if (error) {
    throw error;
  }

  return data;
}

export { write, read, list, remove, mkdir, status, rename };
