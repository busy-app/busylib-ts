import {
  pairingInfoGet as statusSmartHomeApi,
  pairingPayloadPost as pairDeviceSmartHomeApi,
  pairingDelete as eraseDevicesSmartHomeApi,
  switchStateGet as switchStateGetApi,
  switchStatePost as switchStatePostApi
} from 'BusyBar/api/smartHome';
import type {
  RequestOptions,
  SuccessResponse,
  SmartHomePairingInfo,
  SmartHomePairingPayload,
  SmartHomeSwitchState,
  SmartHomeSwitchStateParams
} from 'BusyBar/types';
import { BusyBar } from 'BusyBar/index';

export class SmartHomeMethods {
  /**
   * Smart home commissioning status.
   *
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SmartHomePairingInfo>} A promise that resolves to the pairing info.
   */
  async SmartHomePairingGet(this: BusyBar, options?: RequestOptions): Promise<SmartHomePairingInfo> {
    return await statusSmartHomeApi(this.apiClient, options);
  }

  /**
   * Link device to a smart home.
   *
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SmartHomePairingPayload>} A promise that resolves to the pairing payload.
   */
  async SmartHomePair(this: BusyBar, options?: RequestOptions): Promise<SmartHomePairingPayload> {
    return await pairDeviceSmartHomeApi(this.apiClient, options);
  }

  /**
   * Erase all smart home links.
   *
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves on success.
   */
  async SmartHomeErase(this: BusyBar, options?: RequestOptions): Promise<SuccessResponse> {
    return await eraseDevicesSmartHomeApi(this.apiClient, options);
  }

  /**
   * Get state of emulated smart home switch.
   *
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SmartHomeSwitchState>} A promise that resolves to the switch state.
   */
  async SmartHomeSwitchStateGet(this: BusyBar, options?: RequestOptions): Promise<SmartHomeSwitchState> {
    return await switchStateGetApi(this.apiClient, options);
  }

  /**
   * Set state of emulated smart home switch.
   *
   * @param {SmartHomeSwitchStateParams} params - Switch state.
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves on success.
   */
  async SmartHomeSwitchStateSet(this: BusyBar, params: SmartHomeSwitchStateParams, options?: RequestOptions): Promise<SuccessResponse> {
    return await switchStatePostApi(this.apiClient, params, options);
  }
}
