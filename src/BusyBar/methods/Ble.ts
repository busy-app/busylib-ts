import { enable as enableBleApi, disable as disableBleApi, pairing as pairingBleApi, status as statusBleApi } from 'BusyBar/api/ble';
import type { RequestOptions, SuccessResponse, BleStatusResponse } from 'BusyBar/types';
import { BusyBar } from 'BusyBar/index';

export class BleMethods {
  /**
   * Enable BLE. Starts advertising.
   *
   * @param {RequestOptions} [options] - Optional parameters.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves on success.
   */
  async BleEnable(this: BusyBar, options?: RequestOptions): Promise<SuccessResponse> {
    return await enableBleApi(this.apiClient, options);
  }

  /**
   * Disable BLE. Stops advertising.
   *
   * @param {RequestOptions} [options] - Optional parameters.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves on success.
   */
  async BleDisable(this: BusyBar, options?: RequestOptions): Promise<SuccessResponse> {
    return await disableBleApi(this.apiClient, options);
  }

  /**
   * Remove pairing. Remove pairing with previous device.
   *
   * @param {RequestOptions} [options] - Optional parameters.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves on success.
   */
  async BleUnpair(this: BusyBar, options?: RequestOptions): Promise<SuccessResponse> {
    return await pairingBleApi(this.apiClient, options);
  }

  /**
   * Returns current BLE status.
   *
   * @param {RequestOptions} [options] - Optional parameters.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<BleStatusResponse>} A promise that resolves to the BLE status.
   */
  async BleStatusGet(this: BusyBar, options?: RequestOptions): Promise<BleStatusResponse> {
    return await statusBleApi(this.apiClient, options);
  }
}
