import type { BusyBarClient } from 'BusyBar/types/internal';
import type { RequestOptions, AccountBackendSetParams } from 'BusyBar/types';

async function getAccountState(client: BusyBarClient, options?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.GET('/account/status', {
        signal
      }),
    options
  );

  if (error) {
    throw error;
  }

  return data;
}

async function getAccountInfo(client: BusyBarClient, options?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.GET('/account/info', {
        signal
      }),
    options
  );

  if (error) {
    throw error;
  }

  return data;
}

async function getAccountBackend(client: BusyBarClient, options?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.GET('/account/backend', {
        signal
      }),
    options
  );

  if (error) {
    throw error;
  }

  return data;
}

async function setAccountBackend(client: BusyBarClient, params: AccountBackendSetParams, options?: RequestOptions) {
  const { server_url, client_cert_type, ignore_server_cert } = params;

  const { data, error } = await client.execute(
    (signal) =>
      client.PUT('/account/backend', {
        body: {
          server_url,
          client_cert_type,
          ignore_server_cert
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

async function unlinkDevice(client: BusyBarClient, options?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.DELETE('/account', {
        signal
      }),
    options
  );

  if (error) {
    throw error;
  }

  return data;
}

async function linkDevice(client: BusyBarClient, options?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.POST('/account/link', {
        signal
      }),
    options
  );

  if (error) {
    throw error;
  }

  return data;
}

export { getAccountState, getAccountInfo, getAccountBackend, setAccountBackend, unlinkDevice, linkDevice };
