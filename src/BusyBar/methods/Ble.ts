import {
  enable as enableBleApi,
  disable as disableBleApi,
  pairing as pairingBleApi,
  status as statusBleApi,
} from "BusyBar/api/ble";
import type {
  TimeoutOptions,
  SuccessResponse,
  BleStatusResponse,
} from "Global/types";
import { BusyBar } from "BusyBar/index";

export class BleMethods {
  /**
   * Enable BLE. Starts advertising.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} A promise that resolves on success.
   */
  async BleEnable(
    this: BusyBar,
    params?: TimeoutOptions,
  ): Promise<SuccessResponse> {
    return await enableBleApi(params);
  }

  /**
   * Disable BLE. Stops advertising.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} A promise that resolves on success.
   */
  async BleDisable(
    this: BusyBar,
    params?: TimeoutOptions,
  ): Promise<SuccessResponse> {
    return await disableBleApi(params);
  }

  /**
   * Remove pairing. Remove pairing with previous device.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} A promise that resolves on success.
   */
  async BleUnpair(
    this: BusyBar,
    params?: TimeoutOptions,
  ): Promise<SuccessResponse> {
    return await pairingBleApi(params);
  }

  /**
   * Returns current BLE status.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<BleStatusResponse>} A promise that resolves to the BLE status.
   */
  async BleStatusGet(
    this: BusyBar,
    params?: TimeoutOptions,
  ): Promise<BleStatusResponse> {
    return await statusBleApi(params);
  }
}
