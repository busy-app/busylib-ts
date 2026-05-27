import {
  draw as drawApi,
  clear as clearApi,
  getScreenFrame as getScreenFrameApi,
  DrawParams,
  ClearParams,
  GetScreenFrameParams,
  GetScreenFrameOptions,
  GetScreenFrameResult,
  getDisplayBrightness as getDisplayBrightnessApi,
  setDisplayBrightness as setDisplayBrightnessApi,
  BrightnessParams
} from 'BusyBar/api/display';
import type { RequestOptions, SuccessResponse, DisplayBrightnessInfo } from 'BusyBar/types';
import { BusyBar } from 'BusyBar/index';

export class DisplayMethods {
  /**
   * Draw on display. Sends drawing data to the display. Supports JSON-defined display elements.
   *
   * @param {DrawParams} params - Parameters for the draw operation.
   *   @param {string} params.application_name - Application ID for organizing assets.
   *   @param {Array} params.elements - Display elements to draw.
   *   @param {number} [params.priority=50] - Draw priority in the range [1, 100].
   *   @param {DrawParams['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {DrawParams['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves on successful draw command.
   */
  async DisplayDraw(this: BusyBar, params: DrawParams): Promise<SuccessResponse> {
    return await drawApi(this.apiClient, params);
  }

  /**
   * Clear display. Deletes display elements drawn by the Canvas application.
   * If application_name is specified, only elements for that app are removed.
   *
   * @param {ClearParams} [params] - Optional parameters.
   *   @param {string} [params.application_name] - Application identifier.
   *   @param {ClearParams['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {ClearParams['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves on successful clear command.
   */
  async DisplayClear(this: BusyBar, params?: ClearParams): Promise<SuccessResponse> {
    return await clearApi(this.apiClient, params);
  }

  /**
   * Get single frame for requested screen.
   *
   * @param {GetScreenFrameParams} params - Parameters for the frame request.
   *   @param {GetScreenFrameParams['display']} params.display - Type of the display (Front = 0, Back = 1).
   *   @param {GetScreenFrameParams['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {GetScreenFrameParams['signal']} [params.signal] - AbortSignal to cancel the request.
   * @param {GetScreenFrameOptions} [options] - Options for the response format.
   *   @param {GetScreenFrameOptions['dataType']} [options.dataType='blob'] - Data type of the response. Use 'binary' to get Uint8Array instead of Blob.
   *   @param {GetScreenFrameOptions['format']} [options.format] - Pixel format, only applicable when dataType is 'binary'. 'raw' returns device-native format, 'rgba' converts to RGBA.
   * @returns {Promise<Blob>} A promise that resolves to the screen frame as a Blob.
   * @returns {Promise<ArrayBuffer>} A promise that resolves to the screen frame as an ArrayBuffer when dataType is 'arrayBuffer'.
   */
  async DisplayScreenFrameGet<T extends GetScreenFrameOptions | undefined>(
    this: BusyBar,
    params: GetScreenFrameParams,
    options?: T
  ): Promise<GetScreenFrameResult<T>> {
    return getScreenFrameApi(this.apiClient, params, options);
  }

  /**
   * Get display brightness.
   *
   * @param {RequestOptions} [params] - Optional parameters.
   *   @param {RequestOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<DisplayBrightnessInfo>} A promise that resolves to the brightness information.
   */
  async DisplayBrightnessGet(this: BusyBar, params?: RequestOptions): Promise<DisplayBrightnessInfo> {
    return await getDisplayBrightnessApi(this.apiClient, params);
  }

  /**
   * Set display brightness.
   *
   * @param {BrightnessParams} params - Brightness parameters.
   *   @param {BrightnessParams['value']} params.value - Brightness (0-100 or "auto").
   *   @param {BrightnessParams['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {BrightnessParams['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves on success.
   */
  async DisplayBrightnessSet(this: BusyBar, params: BrightnessParams): Promise<SuccessResponse> {
    return await setDisplayBrightnessApi(this.apiClient, params);
  }
}
