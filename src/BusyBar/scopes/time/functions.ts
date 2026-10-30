import type { RequestClient } from 'BusyBar/client/types';
import type { RequestOptionsFor } from 'BusyBar/client/types.internal';
import type { TimeTimestampParams, TimeTimezoneParams, TimestampInfo, TimezoneInfo, TimezoneList } from 'BusyBar/scopes/time/types';
import type { SuccessResponse } from 'BusyBar/types';

/**
 * Get current timestamp info.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<TimestampInfo>} A promise that resolves to the timestamp information.
 */
export async function timeGet<C extends RequestClient>(client: C, options?: RequestOptionsFor<C>): Promise<TimestampInfo> {
  return client.GET('/time', options);
}

/**
 * Set system timestamp.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {TimeTimestampParams} params - Parameters for setting the timestamp.
 *   @param {TimeTimestampParams['timestamp']} params.timestamp - Unix timestamp to set.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<SuccessResponse>} A promise that resolves on success.
 */
export async function timeTimestampSet<C extends RequestClient>(
  client: C,
  params: TimeTimestampParams,
  options?: RequestOptionsFor<C>
): Promise<SuccessResponse> {
  const { timestamp } = params;

  return client.POST('/time/timestamp', {
    params: {
      query: { timestamp }
    },
    ...options
  });
}

/**
 * Get current timezone.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<TimezoneInfo>} A promise that resolves to the timezone information.
 */
export async function timeTimezoneGet<C extends RequestClient>(client: C, options?: RequestOptionsFor<C>): Promise<TimezoneInfo> {
  return client.GET('/time/timezone', options);
}

/**
 * Set system timezone.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {TimeTimezoneParams} params - Parameters for setting the timezone.
 *   @param {TimeTimezoneParams['timezone']} params.timezone - Timezone string to set (e.g., "Europe/Moscow").
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<SuccessResponse>} A promise that resolves on success.
 */
export async function timeTimezoneSet<C extends RequestClient>(
  client: C,
  params: TimeTimezoneParams,
  options?: RequestOptionsFor<C>
): Promise<SuccessResponse> {
  const { timezone } = params;

  return client.POST('/time/timezone', {
    params: {
      query: { timezone }
    },
    ...options
  });
}

/**
 * Get list of supported timezones.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<TimezoneList>} A promise that resolves to a list of timezone items.
 */
export async function timeTzListGet<C extends RequestClient>(client: C, options?: RequestOptionsFor<C>): Promise<TimezoneList> {
  return client.GET('/time/tzlist', options);
}
