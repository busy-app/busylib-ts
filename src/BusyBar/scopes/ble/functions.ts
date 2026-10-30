import type { RequestClient } from 'BusyBar/client/types';
import type { RequestOptionsFor } from 'BusyBar/client/types.internal';
import type { BleStatusResponse } from 'BusyBar/scopes/ble/types';
import type { SuccessResponse } from 'BusyBar/types';

/**
 * Enable BLE. Starts advertising.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {RequestOptions} [options] - Optional parameters.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<SuccessResponse>} A promise that resolves on success.
 */
export async function bleEnable<C extends RequestClient>(client: C, options?: RequestOptionsFor<C>): Promise<SuccessResponse> {
  return client.POST('/ble/enable', options);
}

/**
 * Disable BLE. Stops advertising.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {RequestOptions} [options] - Optional parameters.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<SuccessResponse>} A promise that resolves on success.
 */
export async function bleDisable<C extends RequestClient>(client: C, options?: RequestOptionsFor<C>): Promise<SuccessResponse> {
  return client.POST('/ble/disable', options);
}

/**
 * Remove pairing. Remove pairing with previous device.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {RequestOptions} [options] - Optional parameters.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<SuccessResponse>} A promise that resolves on success.
 */
export async function bleUnpair<C extends RequestClient>(client: C, options?: RequestOptionsFor<C>): Promise<SuccessResponse> {
  return client.DELETE('/ble/pairing', options);
}

/**
 * Returns current BLE status.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {RequestOptions} [options] - Optional parameters.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<BleStatusResponse>} A promise that resolves to the BLE status.
 */
export async function bleStatusGet<C extends RequestClient>(client: C, options?: RequestOptionsFor<C>): Promise<BleStatusResponse> {
  return client.GET('/ble/status', options);
}
