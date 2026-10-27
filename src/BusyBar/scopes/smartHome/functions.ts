import type { BusyBarClient } from 'BusyBar/client/BusyBarClient';
import type { RequestOptions } from 'BusyBar/client/types';
import type { SmartHomePairingInfo, SmartHomePairingPayload, SmartHomeSwitchState, SmartHomeSwitchStateParams } from 'BusyBar/scopes/smartHome/types';
import type { SuccessResponse } from 'BusyBar/types';

/**
 * Smart home commissioning status.
 *
 * @param {BusyBarClient} client - BUSY Bar client.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<SmartHomePairingInfo>} A promise that resolves to the pairing info.
 */
export async function smartHomePairingGet(client: BusyBarClient, options?: RequestOptions): Promise<SmartHomePairingInfo> {
  return client.GET('/smart_home/pairing', options);
}

/**
 * Link device to a smart home.
 *
 * @param {BusyBarClient} client - BUSY Bar client.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<SmartHomePairingPayload>} A promise that resolves to the pairing payload.
 */
export async function smartHomePair(client: BusyBarClient, options?: RequestOptions): Promise<SmartHomePairingPayload> {
  return client.POST('/smart_home/pairing', options);
}

/**
 * Erase all smart home links.
 *
 * @param {BusyBarClient} client - BUSY Bar client.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<SuccessResponse>} A promise that resolves on success.
 */
export async function smartHomeErase(client: BusyBarClient, options?: RequestOptions): Promise<SuccessResponse> {
  return client.DELETE('/smart_home/pairing', options);
}

/**
 * Get state of emulated smart home switch.
 *
 * @param {BusyBarClient} client - BUSY Bar client.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<SmartHomeSwitchState>} A promise that resolves to the switch state.
 */
export async function smartHomeSwitchStateGet(client: BusyBarClient, options?: RequestOptions): Promise<SmartHomeSwitchState> {
  return client.GET('/smart_home/switch', options);
}

/**
 * Set state of emulated smart home switch.
 *
 * @param {BusyBarClient} client - BUSY Bar client.
 * @param {SmartHomeSwitchStateParams} params - Switch state.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<SuccessResponse>} A promise that resolves on success.
 */
export async function smartHomeSwitchStateSet(client: BusyBarClient, params: SmartHomeSwitchStateParams, options?: RequestOptions): Promise<SuccessResponse> {
  const { state, startup } = params;

  return client.POST('/smart_home/switch', {
    body: {
      state,
      startup
    },
    ...options
  });
}
