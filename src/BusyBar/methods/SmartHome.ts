import {
  pairingInfoGet as statusSmartHomeApi,
  pairingPayloadPost as pairDeviceSmartHomeApi,
  pairingDelete as eraseDevicesSmartHomeApi,
  switchStateGet as switchStateGetApi,
  switchStatePost as switchStatePostApi
} from 'BusyBar/api/smartHome';
import type { TimeoutOptions, SuccessResponse, SmartHomePairingInfo, SmartHomePairingPayload, SmartHomeSwitchState } from 'Global/types';
import { BusyBar } from 'BusyBar/index';

export class SmartHomeMethods {
  /**
   * Smart home commissioning status.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SmartHomePairingInfo>} A promise that resolves to the pairing info.
   */
  async SmartHomePairingGet(this: BusyBar, params?: TimeoutOptions): Promise<SmartHomePairingInfo> {
    return await statusSmartHomeApi(this.apiClient, params);
  }

  /**
   * Link device to a smart home.
   *
   * @param {TimeoutOptions} [params] - Optional timeout.
   * @returns {Promise<SmartHomePairingPayload>} A promise that resolves to the pairing payload.
   */
  async SmartHomePair(this: BusyBar, params?: TimeoutOptions): Promise<SmartHomePairingPayload> {
    return await pairDeviceSmartHomeApi(this.apiClient, params);
  }

  /**
   * Erase all smart home links.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} A promise that resolves on success.
   */
  async SmartHomeErase(this: BusyBar, params?: TimeoutOptions): Promise<SuccessResponse> {
    return await eraseDevicesSmartHomeApi(this.apiClient, params);
  }

  /**
   * Get state of emulated smart home switch.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SmartHomeSwitchState>} A promise that resolves to the switch state.
   */
  async SmartHomeSwitchStateGet(this: BusyBar, params?: TimeoutOptions): Promise<SmartHomeSwitchState> {
    return await switchStateGetApi(this.apiClient, params);
  }

  /**
   * Set state of emulated smart home switch.
   *
   * @param {SmartHomeSwitchState & TimeoutOptions} params - Switch state and optional timeout.
   * @returns {Promise<SuccessResponse>} A promise that resolves on success.
   */
  async SmartHomeSwitchStateSet(this: BusyBar, params: SmartHomeSwitchState & TimeoutOptions): Promise<SuccessResponse> {
    return await switchStatePostApi(this.apiClient, params);
  }

  // ALIASES for backward compatibility (Matter -> SmartHome)

  /**
   * @deprecated Use SmartHomePairingGet instead.
   */
  async MatterStatusGet(this: BusyBar, params?: TimeoutOptions): Promise<SmartHomePairingInfo> {
    return await this.SmartHomePairingGet(params);
  }

  /**
   * @deprecated Use SmartHomePair instead.
   */
  async MatterPair(this: BusyBar, params?: TimeoutOptions): Promise<SmartHomePairingPayload> {
    return await this.SmartHomePair(params);
  }

  /**
   * @deprecated Use SmartHomeErase instead.
   */
  async MatterErase(this: BusyBar, params?: TimeoutOptions): Promise<SuccessResponse> {
    return await this.SmartHomeErase(params);
  }
}
