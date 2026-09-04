import type { BusyBarClient } from 'BusyBar/types/internal';
import type { RequestOptions, HttpAccessParams, NameParams, AccessTokenCreateParams, AccessTokenRevokeParams } from 'BusyBar/types';

async function getHttpAccess(client: BusyBarClient, options?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.GET('/access', {
        signal
      }),
    options
  );

  if (error) {
    throw error;
  }

  return data;
}

async function setHttpAccess(client: BusyBarClient, params: HttpAccessParams, options?: RequestOptions) {
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
    options
  );

  if (error) {
    throw error;
  }

  return data;
}

async function getName(client: BusyBarClient, options?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.GET('/name', {
        signal
      }),
    options
  );

  if (error) {
    throw error;
  }

  return data;
}

async function setName(client: BusyBarClient, params: NameParams, options?: RequestOptions) {
  const { name } = params;

  const { data, error } = await client.execute(
    (signal) =>
      client.POST('/name', {
        body: {
          name
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

async function getAccessTokens(client: BusyBarClient, options?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.GET('/access/tokens', {
        signal
      }),
    options
  );

  if (error) {
    throw error;
  }

  return data;
}

async function createAccessToken(client: BusyBarClient, params: AccessTokenCreateParams, options?: RequestOptions) {
  const { name } = params;

  const { data, error } = await client.execute(
    (signal) =>
      client.POST('/access/tokens', {
        body: {
          name
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

async function deleteAllAccessTokens(client: BusyBarClient, options?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.DELETE('/access/tokens', {
        signal
      }),
    options
  );

  if (error) {
    throw error;
  }

  return data;
}

async function revokeAccessToken(client: BusyBarClient, params: AccessTokenRevokeParams, options?: RequestOptions) {
  const { short_id: shortId } = params;

  const { data, error } = await client.execute(
    (signal) =>
      client.DELETE('/access/tokens/{short_id}', {
        params: {
          path: { short_id: shortId }
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

export { getHttpAccess, setHttpAccess, getName, setName, getAccessTokens, createAccessToken, deleteAllAccessTokens, revokeAccessToken };
