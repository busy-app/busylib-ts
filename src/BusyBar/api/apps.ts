import type { BusyBarClient } from 'BusyBar/types/internal';
import type {
  RequestOptions,
  AppsStageParams,
  AppsInstallParams,
  AppsRemoveParams,
  AppsSettingsGetParams,
  AppsSettingsSetParams,
  AppsSettingsResetParams
} from 'BusyBar/types';

async function stage(client: BusyBarClient, params: AppsStageParams, options?: RequestOptions) {
  const { file } = params;

  const { data, error } = await client.execute(
    (signal) =>
      client.POST('/apps/stage', {
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

async function install(client: BusyBarClient, params: AppsInstallParams, options?: RequestOptions) {
  const { install_key } = params;

  const { data, error } = await client.execute(
    (signal) =>
      client.POST('/apps/install', {
        params: {
          query: {
            install_key
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

async function remove(client: BusyBarClient, params: AppsRemoveParams, options?: RequestOptions) {
  const { app_id } = params;

  const { data, error } = await client.execute(
    (signal) =>
      client.DELETE('/apps', {
        params: {
          query: {
            app_id
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

async function list(client: BusyBarClient, options?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.GET('/apps/list', {
        signal
      }),
    options
  );

  if (error) {
    throw error;
  }

  return data;
}

async function getSettings(client: BusyBarClient, params: AppsSettingsGetParams, options?: RequestOptions) {
  const { app_id } = params;

  const { data, error } = await client.execute(
    (signal) =>
      client.GET('/apps/settings', {
        params: {
          query: {
            app_id
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

async function setSettings(client: BusyBarClient, params: AppsSettingsSetParams, options?: RequestOptions) {
  const { app_id, settings } = params;

  const { data, error } = await client.execute(
    (signal) =>
      client.PUT('/apps/settings', {
        params: {
          query: {
            app_id
          }
        },
        body: settings,
        signal
      }),
    options
  );

  if (error) {
    throw error;
  }

  return data;
}

async function resetSettings(client: BusyBarClient, params: AppsSettingsResetParams, options?: RequestOptions) {
  const { app_id } = params;

  const { data, error } = await client.execute(
    (signal) =>
      client.DELETE('/apps/settings', {
        params: {
          query: {
            app_id
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

export { stage, install, remove, list, getSettings, setSettings, resetSettings };
