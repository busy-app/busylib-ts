import {
  draw as drawApi,
  clear as clearApi,
  getScreenFrame as getScreenFrameApi,
  DrawParams,
  GetScreenFrameParams,
  getDisplayBrightness as getDisplayBrightnessApi,
  setDisplayBrightness as setDisplayBrightnessApi,
  BrightnessParams,
} from "BusyBar/api/display";
import type {
  TimeoutOptions,
  SuccessResponse,
  DisplayBrightnessInfo,
} from "Global/types";
import { BusyBar } from "BusyBar/index";

export class DisplayMethods {
  /**
   * Draw on display. Starts the Canvas application if not running.
   *
   * @param {DrawParams} params - Parameters for the draw operation.
   *   @param {DrawParams['appId']} params.appId - Application ID.
   *   @param {DrawParams['elements']} params.elements - Display elements to draw.
   *   @param {DrawParams['priority']} [params.priority=6] - Priority for the draw request (1-10).
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} A promise that resolves on successful draw command.
   */
  async DisplayDraw(
    this: BusyBar,
    params: DrawParams,
  ): Promise<SuccessResponse> {
    return await drawApi(this.apiClient, params);
  }

  /**
   * Clear display. Clears the display and stops the Canvas application if running.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} A promise that resolves on successful clear command.
   */
  async DisplayClear(
    this: BusyBar,
    params?: TimeoutOptions,
  ): Promise<SuccessResponse> {
    return await clearApi(this.apiClient, params);
  }

  /**
   * Get single frame for requested screen.
   *
   * @param {GetScreenFrameParams} params - Parameters for the frame request.
   *   @param {string} params.display - Display identifier.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<Blob>} A promise that resolves to the screen frame as a Blob.
   */
  async DisplayScreenFrameGet(
    this: BusyBar,
    params: GetScreenFrameParams,
  ): Promise<Blob> {
    return (await getScreenFrameApi(this.apiClient, params)) as Blob;
  }

  /**
   * Get display brightness.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<DisplayBrightnessInfo>} A promise that resolves to the brightness information.
   */
  async DisplayBrightnessGet(
    this: BusyBar,
    params?: TimeoutOptions,
  ): Promise<DisplayBrightnessInfo> {
    return await getDisplayBrightnessApi(this.apiClient, params);
  }

  /**
   * Set display brightness.
   *
   * @param {BrightnessParams} params - Brightness parameters:
   *   @param {BrightnessParams['value']} [params.value] - Brightness (0-100 or "auto").
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} A promise that resolves on success.
   */
  async DisplayBrightnessSet(
    this: BusyBar,
    params: BrightnessParams,
  ): Promise<SuccessResponse> {
    return await setDisplayBrightnessApi(this.apiClient, params);
  }
}
