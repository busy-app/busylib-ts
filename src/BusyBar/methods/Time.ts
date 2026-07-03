import {
  getTime as getTimeApi,
  getTimezone as getTimezoneApi,
  getTzList as getTzListApi,
  setTimestamp as setTimestampApi,
  setTimezone as setTimezoneApi
} from 'BusyBar/api/time';
import type { RequestOptions, TimestampInfo, SuccessResponse, TimezoneList, TimezoneInfo, TimeTimestampParams, TimeTimezoneParams } from 'BusyBar/types';
import { BusyBar } from 'BusyBar/index';

export class TimeMethods {
  /**
   * Get current timestamp info.
   *
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<TimestampInfo>} A promise that resolves to the timestamp information.
   */
  async TimeGet(this: BusyBar, options?: RequestOptions): Promise<TimestampInfo> {
    return await getTimeApi(this.apiClient, options);
  }

  /**
   * Set system timestamp.
   *
   * @param {TimeTimestampParams} params - Parameters for setting the timestamp.
   *   @param {TimeTimestampParams['timestamp']} params.timestamp - Unix timestamp to set.
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves on success.
   */
  async TimeTimestampSet(this: BusyBar, params: TimeTimestampParams, options?: RequestOptions): Promise<SuccessResponse> {
    return await setTimestampApi(this.apiClient, params, options);
  }

  /**
   * Get current timezone.
   *
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<TimezoneInfo>} A promise that resolves to the timezone information.
   */
  async TimeTimezoneGet(this: BusyBar, options?: RequestOptions): Promise<TimezoneInfo> {
    return await getTimezoneApi(this.apiClient, options);
  }

  /**
   * Set system timezone.
   *
   * @param {TimeTimezoneParams} params - Parameters for setting the timezone.
   *   @param {TimeTimezoneParams['timezone']} params.timezone - Timezone string to set (e.g., "Europe/Moscow").
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves on success.
   */
  async TimeTimezoneSet(this: BusyBar, params: TimeTimezoneParams, options?: RequestOptions): Promise<SuccessResponse> {
    return await setTimezoneApi(this.apiClient, params, options);
  }

  /**
   * Get list of supported timezones.
   *
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<TimezoneList>} A promise that resolves to a list of timezone items.
   */
  async TimeTzListGet(this: BusyBar, options?: RequestOptions): Promise<TimezoneList> {
    return await getTzListApi(this.apiClient, options);
  }
}
