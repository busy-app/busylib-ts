import { enable as enableBleApi, disable as disableBleApi, pairing as pairingBleApi, status as statusBleApi } from 'BusyBar/api/ble';
import type { RequestOptions, SuccessResponse, BleStatusResponse } from 'BusyBar/types';
import { BusyBar } from 'BusyBar/index';

export class BleMethods {
  /**
   * Enable BLE. Starts advertising.
   *
   * @param {RequestOptions} [params] - Optional parameters.
   *   @param {RequestOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves on success.
   */
  async BleEnable(this: BusyBar, params?: RequestOptions): Promise<SuccessResponse> {
    return await enableBleApi(this.apiClient, params);
  }

  /**
   * Disable BLE. Stops advertising.
   *
   * @param {RequestOptions} [params] - Optional parameters.
   *   @param {RequestOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves on success.
   */
  async BleDisable(this: BusyBar, params?: RequestOptions): Promise<SuccessResponse> {
    return await disableBleApi(this.apiClient, params);
  }

  /**
   * Remove pairing. Remove pairing with previous device.
   *
   * @param {RequestOptions} [params] - Optional parameters.
   *   @param {RequestOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves on success.
   */
  async BleUnpair(this: BusyBar, params?: RequestOptions): Promise<SuccessResponse> {
    return await pairingBleApi(this.apiClient, params);
  }

  /**
   * Returns current BLE status.
   *
   * @param {RequestOptions} [params] - Optional parameters.
   *   @param {RequestOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<BleStatusResponse>} A promise that resolves to the BLE status.
   */
  async BleStatusGet(this: BusyBar, params?: RequestOptions): Promise<BleStatusResponse> {
    return await statusBleApi(this.apiClient, params);
  }
}
