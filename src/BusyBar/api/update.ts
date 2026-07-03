import type { BusyBarClient } from 'BusyBar/types/internal';
import type { RequestOptions, UpdateFromFileParams, UpdateChangelogParams, UpdateInstallParams, UpdateAutoUpdateParams } from 'BusyBar/types';

async function update(client: BusyBarClient, params: UpdateFromFileParams, options?: RequestOptions) {
  const { file } = params;

  const { data, error } = await client.execute(
    (signal) =>
      client.POST('/update', {
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

async function check(client: BusyBarClient, options?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.POST('/update/check', {
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
      client.GET('/update/status', {
        signal
      }),
    options
  );

  if (error) {
    throw error;
  }

  return data;
}

async function changelog(client: BusyBarClient, params: UpdateChangelogParams, options?: RequestOptions) {
  const { version } = params;

  const { data, error } = await client.execute(
    (signal) =>
      client.GET('/update/changelog', {
        params: {
          query: {
            version
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

async function install(client: BusyBarClient, params: UpdateInstallParams, options?: RequestOptions) {
  const { version } = params;

  const { data, error } = await client.execute(
    (signal) =>
      client.POST('/update/install', {
        params: {
          query: {
            version
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

async function abort(client: BusyBarClient, options?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.POST('/update/abort_download', {
        signal
      }),
    options
  );

  if (error) {
    throw error;
  }

  return data;
}

async function getAutoUpdate(client: BusyBarClient, options?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.GET('/update/autoupdate', {
        signal
      }),
    options
  );

  if (error) {
    throw error;
  }

  return data;
}

async function setAutoUpdate(client: BusyBarClient, params: UpdateAutoUpdateParams, options?: RequestOptions) {
  const { is_enabled, interval_start, interval_end } = params;

  const { data, error } = await client.execute(
    (signal) =>
      client.POST('/update/autoupdate', {
        body: {
          is_enabled,
          interval_start,
          interval_end
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

export { update, check, status, changelog, install, abort, getAutoUpdate, setAutoUpdate };
