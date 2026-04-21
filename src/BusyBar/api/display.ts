import type { BusyBarClient } from 'BusyBar/api/createClient';
import type { TimeoutOptions, DisplayElements, ClearDisplayQuery, ScreenQuery } from 'Global/types';

export interface DrawParams extends TimeoutOptions, DisplayElements {}

export interface ClearParams extends TimeoutOptions, Partial<ClearDisplayQuery> {}

export interface GetScreenFrameParams extends TimeoutOptions, ScreenQuery {}

type Brightness = number | 'auto';
export interface BrightnessParams extends TimeoutOptions {
  value: Brightness;
}

async function draw(client: BusyBarClient, params: DrawParams) {
  const { application_name, elements, priority = 50, timeout } = params;

  const { data, error } = await client.withTimeout(
    (signal) =>
      client.POST('/display/draw', {
        body: {
          application_name,
          priority,
          elements
        },
        signal
      }),
    timeout
  );

  if (error) {
    throw error;
  }

  return data;
}

async function clear(client: BusyBarClient, params?: ClearParams) {
  const { data, error } = await client.withTimeout(
    (signal) =>
      client.DELETE('/display/draw', {
        params: {
          query: {
            application_name: params?.application_name
          }
        },
        signal
      }),
    params?.timeout
  );

  if (error) {
    throw error;
  }

  return data;
}

async function getScreenFrame(client: BusyBarClient, params: GetScreenFrameParams) {
  const { display, timeout } = params;

  const { data, error } = await client.withTimeout(
    (signal) =>
      client.GET('/screen', {
        params: {
          query: {
            display
          }
        },
        parseAs: 'blob',
        signal
      }),
    timeout
  );

  if (error) {
    throw error;
  }

  return data;
}

async function getDisplayBrightness(client: BusyBarClient, params?: TimeoutOptions) {
  const { data, error } = await client.withTimeout((signal) => client.GET('/display/brightness', { signal }), params?.timeout);

  if (error) {
    throw error;
  }

  return data;
}

async function setDisplayBrightness(client: BusyBarClient, params: BrightnessParams) {
  const { value } = params;

  const normalize = (val: Brightness): string => {
    if (typeof val === 'number') {
      if (val < 0 || val > 100) {
        throw new Error("Brightness value must be between 0 and 100 or 'auto'");
      }
      return String(val);
    }
    if (val === 'auto') {
      return 'auto';
    }
    return 'auto';
  };

  const valueQuery = normalize(value);

  const { data, error } = await client.withTimeout(
    (signal) =>
      client.POST('/display/brightness', {
        params: {
          query: {
            value: valueQuery
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

export { draw, clear, getScreenFrame, getDisplayBrightness, setDisplayBrightness };
