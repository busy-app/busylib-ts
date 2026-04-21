import {
  draw as drawApi,
  clear as clearApi,
  getScreenFrame as getScreenFrameApi,
  DrawParams,
  ClearParams,
  GetScreenFrameParams,
  getDisplayBrightness as getDisplayBrightnessApi,
  setDisplayBrightness as setDisplayBrightnessApi,
  BrightnessParams
} from 'BusyBar/api/display';
import type { TimeoutOptions, SuccessResponse, DisplayBrightnessInfo } from 'BusyBar/types';
import { BusyBar } from 'BusyBar/index';

export class DisplayMethods {
  /**
   * Draw on display. Sends drawing data to the display. Supports JSON-defined display elements.
   *
   * @param {DrawParams} params - Parameters for the draw operation.
   *   @param {string} params.application_name - Application ID for organizing assets.
   *   @param {Array} params.elements - Display elements to draw.
   *   @param {number} [params.priority=50] - Draw priority in the range [1, 100].
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
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
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} A promise that resolves on successful clear command.
   */
  async DisplayClear(this: BusyBar, params?: ClearParams): Promise<SuccessResponse> {
    return await clearApi(this.apiClient, params);
  }

  /**
   * Get single frame for requested screen.
   *
   * @param {GetScreenFrameParams} params - Parameters for the frame request.
   *   @param {number} params.display - Type of the display (Front = 0, Back = 1).
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<Blob>} A promise that resolves to the screen frame as a Blob.
   */
  async DisplayScreenFrameGet(this: BusyBar, params: GetScreenFrameParams): Promise<Blob> {
    return (await getScreenFrameApi(this.apiClient, params)) as Blob;
  }

  /**
   * Get display brightness.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<DisplayBrightnessInfo>} A promise that resolves to the brightness information.
   */
  async DisplayBrightnessGet(this: BusyBar, params?: TimeoutOptions): Promise<DisplayBrightnessInfo> {
    return await getDisplayBrightnessApi(this.apiClient, params);
  }

  /**
   * Set display brightness.
   *
   * @param {BrightnessParams} params - Brightness parameters.
   *   @param {number | 'auto'} params.value - Brightness (0-100 or "auto").
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} A promise that resolves on success.
   */
  async DisplayBrightnessSet(this: BusyBar, params: BrightnessParams): Promise<SuccessResponse> {
    return await setDisplayBrightnessApi(this.apiClient, params);
  }
}
