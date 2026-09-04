import type { BusyBarClient } from 'BusyBar/types/internal';
import type {
  RequestOptions,
  DisplayDrawParams,
  DisplayClearParams,
  ScreenFrameGetParams,
  ScreenFrameGetOptions,
  ScreenFrameGetResult,
  DisplayBrightnessParams
} from 'BusyBar/types';
import { Display } from 'Global/types';
import { blobToUint8Array, bgrToRgba, getDisplayDimensions, convertL4toRGBA } from 'Global/utils/frameData';

async function draw(client: BusyBarClient, params: DisplayDrawParams, options?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.POST('/display/draw', {
        body: {
          ...params,
          priority: params.priority ?? 50
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

async function clear(client: BusyBarClient, params?: DisplayClearParams, options?: RequestOptions) {
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
    options
  );

  if (error) {
    throw error;
  }

  return data;
}

async function getScreenFrame<T extends ScreenFrameGetOptions | undefined>(
  client: BusyBarClient,
  params: ScreenFrameGetParams,
  options?: T
): Promise<ScreenFrameGetResult<T>> {
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
    options
  );

  if (error) {
    throw error;
  }

  if (!data) {
    return undefined as ScreenFrameGetResult<T>;
  }

  if (options?.dataType === 'binary') {
    const raw = await blobToUint8Array(data);

    if (options.format === 'rgba') {
      const { width, height } = getDisplayDimensions(display as Display);

      if (display === Display.BACK) {
        return new Uint8Array(convertL4toRGBA(raw, width, height).buffer) as ScreenFrameGetResult<T>;
      }

      return bgrToRgba(raw, width, height) as ScreenFrameGetResult<T>;
    }

    return raw as ScreenFrameGetResult<T>;
  }

  return data as ScreenFrameGetResult<T>;
}

async function getDisplayBrightness(client: BusyBarClient, options?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.GET('/display/brightness', {
        signal
      }),
    options
  );

  if (error) {
    throw error;
  }

  return data;
}

async function setDisplayBrightness(client: BusyBarClient, params: DisplayBrightnessParams, options?: RequestOptions) {
  const { value } = params;

  type Brightness = number | 'auto';

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
    options
  );

  if (error) {
    throw error;
  }

  return data;
}

export { draw, clear, getScreenFrame, getDisplayBrightness, setDisplayBrightness };
