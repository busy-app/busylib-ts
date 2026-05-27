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
   * @param {RequestOptions} [params] - Optional parameters.
   *   @param {RequestOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SmartHomePairingInfo>} A promise that resolves to the pairing info.
   */
  async SmartHomePairingGet(this: BusyBar, params?: RequestOptions): Promise<SmartHomePairingInfo> {
    return await statusSmartHomeApi(this.apiClient, params);
  }

  /**
   * Link device to a smart home.
   *
   * @param {RequestOptions} [params] - Optional parameters.
   *   @param {RequestOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SmartHomePairingPayload>} A promise that resolves to the pairing payload.
   */
  async SmartHomePair(this: BusyBar, params?: RequestOptions): Promise<SmartHomePairingPayload> {
    return await pairDeviceSmartHomeApi(this.apiClient, params);
  }

  /**
   * Erase all smart home links.
   *
   * @param {RequestOptions} [params] - Optional parameters.
   *   @param {RequestOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves on success.
   */
  async SmartHomeErase(this: BusyBar, params?: RequestOptions): Promise<SuccessResponse> {
    return await eraseDevicesSmartHomeApi(this.apiClient, params);
  }

  /**
   * Get state of emulated smart home switch.
   *
   * @param {RequestOptions} [params] - Optional parameters.
   *   @param {RequestOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SmartHomeSwitchState>} A promise that resolves to the switch state.
   */
  async SmartHomeSwitchStateGet(this: BusyBar, params?: RequestOptions): Promise<SmartHomeSwitchState> {
    return await switchStateGetApi(this.apiClient, params);
  }

  /**
   * Set state of emulated smart home switch.
   *
   * @param {SmartHomeSwitchStateParams} params - Switch state and optional timeout.
   *   @param {SmartHomeSwitchStateParams['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {SmartHomeSwitchStateParams['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves on success.
   */
  async SmartHomeSwitchStateSet(this: BusyBar, params: SmartHomeSwitchStateParams): Promise<SuccessResponse> {
    return await switchStatePostApi(this.apiClient, params);
  }

  // ALIASES for backward compatibility (Matter -> SmartHome)

  /**
   * @deprecated Use SmartHomePairingGet instead.
   */
  async MatterStatusGet(this: BusyBar, params?: RequestOptions): Promise<SmartHomePairingInfo> {
    return await this.SmartHomePairingGet(params);
  }

  /**
   * @deprecated Use SmartHomePair instead.
   */
  async MatterPair(this: BusyBar, params?: RequestOptions): Promise<SmartHomePairingPayload> {
    return await this.SmartHomePair(params);
  }

  /**
   * @deprecated Use SmartHomeErase instead.
   */
  async MatterErase(this: BusyBar, params?: RequestOptions): Promise<SuccessResponse> {
    return await this.SmartHomeErase(params);
  }
}
