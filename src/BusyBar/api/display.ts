import type { BusyBarClient } from 'BusyBar/types/internal';
import type { RequestOptions, DisplayElements, ClearDisplayQuery, ScreenQuery } from 'BusyBar/types';
import { Display } from 'BusyBar/types';
import { blobToUint8Array, bgrToRgba, getDisplayDimensions, convertL4toRGBA } from 'Global/utils/frameData';

export interface DrawParams extends RequestOptions, DisplayElements {}

export interface ClearParams extends RequestOptions, Partial<ClearDisplayQuery> {}

export interface GetScreenFrameParams extends RequestOptions, ScreenQuery {}

export type GetScreenFrameOptions = { dataType: 'binary'; format?: 'raw' | 'rgba' } | { dataType?: 'blob'; format?: never };

export type GetScreenFrameResult<T extends GetScreenFrameOptions | undefined> = T extends { dataType: 'binary' } ? Uint8Array | undefined : Blob | undefined;

type Brightness = number | 'auto';
export interface BrightnessParams extends RequestOptions {
  value: Brightness;
}

async function draw(client: BusyBarClient, params: DrawParams) {
  const { application_name, elements, priority = 50 } = params;

  const { data, error } = await client.execute(
    (signal) =>
      client.POST('/display/draw', {
        body: {
          application_name,
          priority,
          elements
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

async function clear(client: BusyBarClient, params?: ClearParams) {
  const { data, error } = await client.execute(
    (signal) =>
      client.DELETE('/display/draw', {
        params: {
          query: {
            application_name: params?.application_name
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

async function getScreenFrame<T extends GetScreenFrameOptions | undefined>(
  client: BusyBarClient,
  params: GetScreenFrameParams,
  options?: T
): Promise<GetScreenFrameResult<T>> {
  const { display } = params;

  const { data, error } = await client.execute(
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
    params
  );

  if (error) {
    throw error;
  }

  if (!data) {
    return undefined as GetScreenFrameResult<T>;
  }

  if (options?.dataType === 'binary') {
    const raw = await blobToUint8Array(data);

    if (options.format === 'rgba') {
      const { width, height } = getDisplayDimensions(display as Display);

      if (display === Display.BACK) {
        return new Uint8Array(convertL4toRGBA(raw, width, height).buffer) as GetScreenFrameResult<T>;
      }

      return bgrToRgba(raw, width, height) as GetScreenFrameResult<T>;
    }

    return raw as GetScreenFrameResult<T>;
  }

  return data as GetScreenFrameResult<T>;
}

async function getDisplayBrightness(client: BusyBarClient, params?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.GET('/display/brightness', {
        signal
      }),
    params
  );

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

  const { data, error } = await client.execute(
    (signal) =>
      client.POST('/display/brightness', {
        params: {
          query: {
            value: valueQuery
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

export { draw, clear, getScreenFrame, getDisplayBrightness, setDisplayBrightness };
