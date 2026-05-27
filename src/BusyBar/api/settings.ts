import type { BusyBarClient } from 'BusyBar/types/internal';
import type { RequestOptions, HttpAccessQuery, NameInfo } from 'BusyBar/types';

async function getHttpAccess(client: BusyBarClient, params?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.GET('/access', {
        signal
      }),
    params
  );

  if (error) {
    throw error;
  }

  return data;
}

export interface HttpAccessParams extends RequestOptions, HttpAccessQuery {}

async function setHttpAccess(client: BusyBarClient, params: HttpAccessParams) {
  const { mode, key } = params;
  const keyValue = key ?? '';

  if (String(keyValue).trim() && !/^\d{4,10}$/.test(String(keyValue))) {
    throw new Error('Key must be a string of 4 to 10 digits');
  }

  const { data, error } = await client.execute(
    (signal) =>
      client.POST('/access', {
        params: {
          query: {
            mode,
            key: keyValue
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

async function getName(client: BusyBarClient, params?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.GET('/name', {
        signal
      }),
    params
  );

  if (error) {
    throw error;
  }

  return data;
}

export interface NameParams extends RequestOptions, NameInfo {}

async function setName(client: BusyBarClient, params: NameParams) {
  const { name } = params;

  const { data, error } = await client.execute(
    (signal) =>
      client.POST('/name', {
        body: {
          name
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

export { getHttpAccess, setHttpAccess, getName, setName };
