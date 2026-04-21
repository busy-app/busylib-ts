import type { BusyBarClient } from 'BusyBar/types/internal';
import type { AutoUpdateSettings, TimeoutOptions, UpdateChangelogQuery, UpdateInstallQuery, BusyFile } from 'BusyBar/types';

export interface UpdateParams extends TimeoutOptions {
  file: BusyFile;
}

async function update(client: BusyBarClient, params: UpdateParams) {
  const { file } = params;

  const { data, error } = await client.withTimeout(
    (signal) =>
      client.POST('/update', {
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

async function check(client: BusyBarClient, params?: TimeoutOptions) {
  const { data, error } = await client.withTimeout((signal) => client.POST('/update/check', { signal }), params?.timeout);

  if (error) {
    throw error;
  }

  return data;
}

async function status(client: BusyBarClient, params?: TimeoutOptions) {
  const { data, error } = await client.withTimeout((signal) => client.GET('/update/status', { signal }), params?.timeout);

  if (error) {
    throw error;
  }

  return data;
}

export interface ChangelogParams extends TimeoutOptions, UpdateChangelogQuery {}

async function changelog(client: BusyBarClient, params: ChangelogParams) {
  const { version } = params;

  const { data, error } = await client.withTimeout(
    (signal) =>
      client.GET('/update/changelog', {
        params: {
          query: {
            version
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

export interface InstallParams extends TimeoutOptions, UpdateInstallQuery {}

async function install(client: BusyBarClient, params: InstallParams) {
  const { version } = params;

  const { data, error } = await client.withTimeout(
    (signal) =>
      client.POST('/update/install', {
        params: {
          query: {
            version
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

async function abort(client: BusyBarClient, params?: TimeoutOptions) {
  const { data, error } = await client.withTimeout((signal) => client.POST('/update/abort_download', { signal }), params?.timeout);

  if (error) {
    throw error;
  }

  return data;
}

export interface AutoUpdateParams extends TimeoutOptions, AutoUpdateSettings {}

async function getAutoUpdate(client: BusyBarClient, params?: TimeoutOptions) {
  const { data, error } = await client.withTimeout((signal) => client.GET('/update/autoupdate', { signal }), params?.timeout);

  if (error) {
    throw error;
  }

  return data;
}

async function setAutoUpdate(client: BusyBarClient, params: AutoUpdateParams) {
  const { is_enabled, interval_start, interval_end } = params;

  const { data, error } = await client.withTimeout(
    (signal) =>
      client.POST('/update/autoupdate', {
        body: { is_enabled, interval_start, interval_end },
        signal
      }),
    params.timeout
  );

  if (error) {
    throw error;
  }

  return data;
}

export { update, check, status, changelog, install, abort, getAutoUpdate, setAutoUpdate };
