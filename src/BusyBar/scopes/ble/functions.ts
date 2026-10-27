import type { BusyBarClient } from 'BusyBar/client/BusyBarClient';
import type { RequestOptions } from 'BusyBar/client/types';
import type { BleStatusResponse } from 'BusyBar/scopes/ble/types';
import type { SuccessResponse } from 'BusyBar/types';

/**
 * Enable BLE. Starts advertising.
 *
 * @param {BusyBarClient} client - BUSY Bar client.
 * @param {RequestOptions} [options] - Optional parameters.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<SuccessResponse>} A promise that resolves on success.
 */
export async function bleEnable(client: BusyBarClient, options?: RequestOptions): Promise<SuccessResponse> {
  return client.POST('/ble/enable', options);
}

/**
 * Disable BLE. Stops advertising.
 *
 * @param {BusyBarClient} client - BUSY Bar client.
 * @param {RequestOptions} [options] - Optional parameters.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<SuccessResponse>} A promise that resolves on success.
 */
export async function bleDisable(client: BusyBarClient, options?: RequestOptions): Promise<SuccessResponse> {
  return client.POST('/ble/disable', options);
}

/**
 * Remove pairing. Remove pairing with previous device.
 *
 * @param {BusyBarClient} client - BUSY Bar client.
 * @param {RequestOptions} [options] - Optional parameters.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<SuccessResponse>} A promise that resolves on success.
 */
export async function bleUnpair(client: BusyBarClient, options?: RequestOptions): Promise<SuccessResponse> {
  return client.DELETE('/ble/pairing', options);
}

/**
 * Returns current BLE status.
 *
 * @param {BusyBarClient} client - BUSY Bar client.
 * @param {RequestOptions} [options] - Optional parameters.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<BleStatusResponse>} A promise that resolves to the BLE status.
 */
export async function bleStatusGet(client: BusyBarClient, options?: RequestOptions): Promise<BleStatusResponse> {
  return client.GET('/ble/status', options);
}
