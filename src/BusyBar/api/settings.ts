import type { BusyBarClient } from 'BusyBar/types/internal';
import type { TimeoutOptions, HttpAccessQuery, NameInfo } from 'BusyBar/types';

async function getHttpAccess(client: BusyBarClient, params?: TimeoutOptions) {
  const { data, error } = await client.withTimeout((signal) => client.GET('/access', { signal }), params?.timeout);

  if (error) {
    throw error;
  }

  return data;
}

export interface HttpAccessParams extends TimeoutOptions, HttpAccessQuery {}

async function setHttpAccess(client: BusyBarClient, params: HttpAccessParams) {
  const { mode, key } = params;
  const keyValue = key ?? '';

  if (String(keyValue).trim() && !/^\d{4,10}$/.test(String(keyValue))) {
    throw new Error('Key must be a string of 4 to 10 digits');
  }

  const { data, error } = await client.withTimeout(
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
    params.timeout
  );

  if (error) {
    throw error;
  }

  return data;
}

async function getName(client: BusyBarClient, params?: TimeoutOptions) {
  const { data, error } = await client.withTimeout((signal) => client.GET('/name', { signal }), params?.timeout);

  if (error) {
    throw error;
  }

  return data;
}

export interface NameParams extends TimeoutOptions, NameInfo {}

async function setName(client: BusyBarClient, params: NameParams) {
  const { name } = params;

  const { data, error } = await client.withTimeout(
    (signal) =>
      client.POST('/name', {
        body: { name },
        signal
      }),
    params.timeout
  );

  if (error) {
    throw error;
  }

  return data;
}

export { getHttpAccess, setHttpAccess, getName, setName };
