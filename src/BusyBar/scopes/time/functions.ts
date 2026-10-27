import type { BusyBarClient } from 'BusyBar/client/BusyBarClient';
import type { RequestOptions } from 'BusyBar/client/types';
import type { TimeTimestampParams, TimeTimezoneParams, TimestampInfo, TimezoneInfo, TimezoneList } from 'BusyBar/scopes/time/types';
import type { SuccessResponse } from 'BusyBar/types';

/**
 * Get current timestamp info.
 *
 * @param {BusyBarClient} client - BUSY Bar client.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<TimestampInfo>} A promise that resolves to the timestamp information.
 */
export async function timeGet(client: BusyBarClient, options?: RequestOptions): Promise<TimestampInfo> {
  return client.GET('/time', options);
}

/**
 * Set system timestamp.
 *
 * @param {BusyBarClient} client - BUSY Bar client.
 * @param {TimeTimestampParams} params - Parameters for setting the timestamp.
 *   @param {TimeTimestampParams['timestamp']} params.timestamp - Unix timestamp to set.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<SuccessResponse>} A promise that resolves on success.
 */
export async function timeTimestampSet(client: BusyBarClient, params: TimeTimestampParams, options?: RequestOptions): Promise<SuccessResponse> {
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
 * @param {BusyBarClient} client - BUSY Bar client.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<TimezoneInfo>} A promise that resolves to the timezone information.
 */
export async function timeTimezoneGet(client: BusyBarClient, options?: RequestOptions): Promise<TimezoneInfo> {
  return client.GET('/time/timezone', options);
}

/**
 * Set system timezone.
 *
 * @param {BusyBarClient} client - BUSY Bar client.
 * @param {TimeTimezoneParams} params - Parameters for setting the timezone.
 *   @param {TimeTimezoneParams['timezone']} params.timezone - Timezone string to set (e.g., "Europe/Moscow").
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<SuccessResponse>} A promise that resolves on success.
 */
export async function timeTimezoneSet(client: BusyBarClient, params: TimeTimezoneParams, options?: RequestOptions): Promise<SuccessResponse> {
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
 * @param {BusyBarClient} client - BUSY Bar client.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<TimezoneList>} A promise that resolves to a list of timezone items.
 */
export async function timeTzListGet(client: BusyBarClient, options?: RequestOptions): Promise<TimezoneList> {
  return client.GET('/time/tzlist', options);
}
