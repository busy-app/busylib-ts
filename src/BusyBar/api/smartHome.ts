import type { BusyBarClient } from 'BusyBar/types/internal';
import type { RequestOptions, SmartHomeSwitchStateParams } from 'BusyBar/types';

async function pairingInfoGet(client: BusyBarClient, options?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.GET('/smart_home/pairing', {
        signal
      }),
    options
  );

  if (error) {
    throw error;
  }

  return data;
}

async function pairingPayloadPost(client: BusyBarClient, options?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.POST('/smart_home/pairing', {
        signal
      }),
    options
  );

  if (error) {
    throw error;
  }

  return data;
}

async function pairingDelete(client: BusyBarClient, options?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.DELETE('/smart_home/pairing', {
        signal
      }),
    options
  );

  if (error) {
    throw error;
  }

  return data;
}

async function switchStateGet(client: BusyBarClient, options?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.GET('/smart_home/switch', {
        signal
      }),
    options
  );

  if (error) {
    throw error;
  }

  return data;
}

async function switchStatePost(client: BusyBarClient, params: SmartHomeSwitchStateParams, options?: RequestOptions) {
  const { state, startup } = params;

  const { data, error } = await client.execute(
    (signal) =>
      client.POST('/smart_home/switch', {
        body: {
          state,
          startup
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

export { pairingInfoGet, pairingPayloadPost, pairingDelete, switchStateGet, switchStatePost };
