import type { BusyBarClient } from 'BusyBar/types/internal';
import type { TimeoutOptions, SmartHomeSwitchState } from 'BusyBar/types';

async function pairingInfoGet(client: BusyBarClient, params?: TimeoutOptions) {
  const { data, error } = await client.withTimeout((signal) => client.GET('/smart_home/pairing', { signal }), params?.timeout);

  if (error) {
    throw error;
  }

  return data;
}

async function pairingPayloadPost(client: BusyBarClient, params?: TimeoutOptions) {
  const { data, error } = await client.withTimeout((signal) => client.POST('/smart_home/pairing', { signal }), params?.timeout);

  if (error) {
    throw error;
  }

  return data;
}

async function pairingDelete(client: BusyBarClient, params?: TimeoutOptions) {
  const { data, error } = await client.withTimeout((signal) => client.DELETE('/smart_home/pairing', { signal }), params?.timeout);

  if (error) {
    throw error;
  }

  return data;
}

async function switchStateGet(client: BusyBarClient, params?: TimeoutOptions) {
  const { data, error } = await client.withTimeout((signal) => client.GET('/smart_home/switch', { signal }), params?.timeout);

  if (error) {
    throw error;
  }

  return data;
}

async function switchStatePost(client: BusyBarClient, params: SmartHomeSwitchState & TimeoutOptions) {
  const { timeout, ...payload } = params;
  const { data, error } = await client.withTimeout((signal) => client.POST('/smart_home/switch', { body: payload, signal }), timeout);

  if (error) {
    throw error;
  }

  return data;
}

export { pairingInfoGet, pairingPayloadPost, pairingDelete, switchStateGet, switchStatePost };
