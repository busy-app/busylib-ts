import { Display } from 'Global/types';
import { blobToUint8Array, bgrToRgba, getDisplayDimensions, convertL4toRGBA } from 'Global/utils/frameData';
import type { BusyBarClient } from 'BusyBar/client/BusyBarClient';
import type { RequestOptions } from 'BusyBar/client/types';
import type { SuccessResponse } from 'BusyBar/types';
import type {
  DisplayBrightnessInfo,
  DisplayBrightnessParams,
  DisplayClearParams,
  DisplayDrawParams,
  ScreenFrameGetOptions,
  ScreenFrameGetParams,
  ScreenFrameGetResult
} from 'BusyBar/scopes/display/types';

/**
 * Draw on display. Sends drawing data to the display. Supports JSON-defined display elements.
 *
 * @param {BusyBarClient} client - BUSY Bar client.
 * @param {DisplayDrawParams} params - Parameters for the draw operation.
 *   @param {string} params.application_name - Application ID for organizing assets.
 *   @param {Array} params.elements - Display elements to draw.
 *   @param {number} [params.priority=50] - Draw priority in the range [1, 100].
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<SuccessResponse>} A promise that resolves on successful draw command.
 */
export async function displayDraw(client: BusyBarClient, params: DisplayDrawParams, options?: RequestOptions): Promise<SuccessResponse> {
  return client.POST('/display/draw', {
    body: {
      ...params,
      priority: params.priority ?? 50
    },
    ...options
  });
}

/**
 * Clear display. Deletes display elements drawn via this API.
 *
 * @param {BusyBarClient} client - BUSY Bar client.
 * @param {DisplayClearParams} [params] - Optional parameters.
 *   @param {DisplayClearParams['application_name']} [params.application_name] - Fill in this field for a sanity check that you actually own these elements. Omit it to delete them anyway.
 *   @param {DisplayClearParams['element_ids']} [params.element_ids] - Unique identifiers of elements that should be deleted. Omit this field to delete all elements.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<SuccessResponse>} A promise that resolves on successful clear command.
 */
export async function displayClear(client: BusyBarClient, params?: DisplayClearParams, options?: RequestOptions): Promise<SuccessResponse> {
  return client.DELETE('/display/draw', {
    body: params ?? {},
    ...options
  });
}

/**
 * Get single frame for requested screen.
 *
 * @param {BusyBarClient} client - BUSY Bar client.
 * @param {ScreenFrameGetParams} params - Parameters for the frame request.
 *   @param {ScreenFrameGetParams['display']} params.display - Type of the display (Front = 0, Back = 1).
 * @param {ScreenFrameGetOptions} [options] - Options for the response format and request.
 *   @param {ScreenFrameGetOptions['dataType']} [options.dataType='blob'] - Data type of the response. Use 'binary' to get Uint8Array instead of Blob.
 *   @param {ScreenFrameGetOptions['format']} [options.format] - Pixel format, only applicable when dataType is 'binary'. 'raw' returns device-native format, 'rgba' converts to RGBA.
 *   @param {ScreenFrameGetOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {ScreenFrameGetOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<Blob>} A promise that resolves to the screen frame as a Blob.
 * @returns {Promise<ArrayBuffer>} A promise that resolves to the screen frame as an ArrayBuffer when dataType is 'arrayBuffer'.
 */
export async function displayScreenFrameGet<T extends ScreenFrameGetOptions | undefined>(
  client: BusyBarClient,
  params: ScreenFrameGetParams,
  options?: T
): Promise<ScreenFrameGetResult<T>> {
  const { display } = params;

  const data = await client.GET('/screen', {
    params: {
      query: {
        display
      }
    },
    parseAs: 'blob',
    timeout: options?.timeout,
    signal: options?.signal
  });

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

/**
 * Get display brightness.
 *
 * @param {BusyBarClient} client - BUSY Bar client.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<DisplayBrightnessInfo>} A promise that resolves to the brightness information.
 */
export async function displayBrightnessGet(client: BusyBarClient, options?: RequestOptions): Promise<DisplayBrightnessInfo> {
  return client.GET('/display/brightness', options);
}

/**
 * Set display brightness.
 *
 * @param {BusyBarClient} client - BUSY Bar client.
 * @param {DisplayBrightnessParams} params - Brightness parameters.
 *   @param {DisplayBrightnessParams['value']} params.value - Brightness (0-100 or "auto").
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<SuccessResponse>} A promise that resolves on success.
 */
export async function displayBrightnessSet(client: BusyBarClient, params: DisplayBrightnessParams, options?: RequestOptions): Promise<SuccessResponse> {
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

  return client.POST('/display/brightness', {
    params: {
      query: {
        value: valueQuery
      }
    },
    ...options
  });
}
