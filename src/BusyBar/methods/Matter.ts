import {
  status as statusMatterApi,
  pairDevice as pairDeviceMatterApi,
  eraseDevices as eraseDevicesMatterApi,
} from "BusyBar/api/matter";
import type {
  TimeoutOptions,
  SuccessResponse,
  MatterStatus,
  MatterPairingInfo,
} from "Global/types";
import { BusyBar } from "BusyBar/index";

export class MatterMethods {
  /**
   * Get Matter status.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<MatterStatus>} A promise that resolves to the Matter status.
   */
  async MatterStatusGet(
    this: BusyBar,
    params?: TimeoutOptions,
  ): Promise<MatterStatus> {
    return await statusMatterApi(this.apiClient, params);
  }

  /**
   * Pair Matter device.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<MatterPairingInfo>} A promise that resolves on success.
   */
  async MatterPair(
    this: BusyBar,
    params?: TimeoutOptions,
  ): Promise<MatterPairingInfo> {
    return await pairDeviceMatterApi(this.apiClient, params);
  }

  /**
   * Erase Matter devices.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} A promise that resolves on success.
   */
  async MatterErase(
    this: BusyBar,
    params?: TimeoutOptions,
  ): Promise<SuccessResponse> {
    return await eraseDevicesMatterApi(this.apiClient, params);
  }
}
