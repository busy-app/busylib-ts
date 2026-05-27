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
   * @param {RequestOptions} [params] - Optional parameters.
   *   @param {RequestOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<TimestampInfo>} A promise that resolves to the timestamp information.
   */
  async TimeGet(this: BusyBar, params?: RequestOptions): Promise<TimestampInfo> {
    return await getTimeApi(this.apiClient, params);
  }

  /**
   * Set system timestamp.
   *
   * @param {TimeTimestampParams} params - Parameters for setting the timestamp.
   *   @param {TimeTimestampParams['timestamp']} params.timestamp - Unix timestamp to set.
   *   @param {TimeTimestampParams['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {TimeTimestampParams['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves on success.
   */
  async TimeTimestampSet(this: BusyBar, params: TimeTimestampParams): Promise<SuccessResponse> {
    return await setTimestampApi(this.apiClient, params);
  }

  /**
   * Get current timezone.
   *
   * @param {RequestOptions} [params] - Optional parameters.
   *   @param {RequestOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<TimezoneInfo>} A promise that resolves to the timezone information.
   */
  async TimeTimezoneGet(this: BusyBar, params?: RequestOptions): Promise<TimezoneInfo> {
    return await getTimezoneApi(this.apiClient, params);
  }

  /**
   * Set system timezone.
   *
   * @param {TimeTimezoneParams} params - Parameters for setting the timezone.
   *   @param {TimeTimezoneParams['timezone']} params.timezone - Timezone string to set (e.g., "Europe/Moscow").
   *   @param {TimeTimezoneParams['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {TimeTimezoneParams['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves on success.
   */
  async TimeTimezoneSet(this: BusyBar, params: TimeTimezoneParams): Promise<SuccessResponse> {
    return await setTimezoneApi(this.apiClient, params);
  }

  /**
   * Get list of supported timezones.
   *
   * @param {RequestOptions} [params] - Optional parameters.
   *   @param {RequestOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<TimezoneList>} A promise that resolves to a list of timezone items.
   */
  async TimeTzListGet(this: BusyBar, params?: RequestOptions): Promise<TimezoneList> {
    return await getTzListApi(this.apiClient, params);
  }
}
