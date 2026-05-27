import type { BusyBarClient } from 'BusyBar/types/internal';
import type { RequestOptions, SmartHomeSwitchState } from 'BusyBar/types';

async function pairingInfoGet(client: BusyBarClient, params?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.GET('/smart_home/pairing', {
        signal
      }),
    params
  );

  if (error) {
    throw error;
  }

  return data;
}

async function pairingPayloadPost(client: BusyBarClient, params?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.POST('/smart_home/pairing', {
        signal
      }),
    params
  );

  if (error) {
    throw error;
  }

  return data;
}

async function pairingDelete(client: BusyBarClient, params?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.DELETE('/smart_home/pairing', {
        signal
      }),
    params
  );

  if (error) {
    throw error;
  }

  return data;
}

async function switchStateGet(client: BusyBarClient, params?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.GET('/smart_home/switch', {
        signal
      }),
    params
  );

  if (error) {
    throw error;
  }

  return data;
}

export interface SmartHomeSwitchStateParams extends RequestOptions, SmartHomeSwitchState {}

async function switchStatePost(client: BusyBarClient, params: SmartHomeSwitchStateParams) {
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
    params
  );

  if (error) {
    throw error;
  }

  return data;
}

export { pairingInfoGet, pairingPayloadPost, pairingDelete, switchStateGet, switchStatePost };
