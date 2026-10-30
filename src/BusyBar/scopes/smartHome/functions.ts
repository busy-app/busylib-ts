import type { RequestClient } from 'BusyBar/client/types';
import type { RequestOptionsFor } from 'BusyBar/client/types.internal';
import type { SmartHomePairingInfo, SmartHomePairingPayload, SmartHomeSwitchState, SmartHomeSwitchStateParams } from 'BusyBar/scopes/smartHome/types';
import type { SuccessResponse } from 'BusyBar/types';

/**
 * Smart home commissioning status.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<SmartHomePairingInfo>} A promise that resolves to the pairing info.
 */
export async function smartHomePairingGet<C extends RequestClient>(client: C, options?: RequestOptionsFor<C>): Promise<SmartHomePairingInfo> {
  return client.GET('/smart_home/pairing', options);
}

/**
 * Link device to a smart home.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<SmartHomePairingPayload>} A promise that resolves to the pairing payload.
 */
export async function smartHomePair<C extends RequestClient>(client: C, options?: RequestOptionsFor<C>): Promise<SmartHomePairingPayload> {
  return client.POST('/smart_home/pairing', options);
}

/**
 * Erase all smart home links.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<SuccessResponse>} A promise that resolves on success.
 */
export async function smartHomeErase<C extends RequestClient>(client: C, options?: RequestOptionsFor<C>): Promise<SuccessResponse> {
  return client.DELETE('/smart_home/pairing', options);
}

/**
 * Get state of emulated smart home switch.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<SmartHomeSwitchState>} A promise that resolves to the switch state.
 */
export async function smartHomeSwitchStateGet<C extends RequestClient>(client: C, options?: RequestOptionsFor<C>): Promise<SmartHomeSwitchState> {
  return client.GET('/smart_home/switch', options);
}

/**
 * Set state of emulated smart home switch.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {SmartHomeSwitchStateParams} params - Switch state.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<SuccessResponse>} A promise that resolves on success.
 */
export async function smartHomeSwitchStateSet<C extends RequestClient>(
  client: C,
  params: SmartHomeSwitchStateParams,
  options?: RequestOptionsFor<C>
): Promise<SuccessResponse> {
  const { state, startup } = params;

  return client.POST('/smart_home/switch', {
    body: {
      state,
      startup
    },
    ...options
  });
}
