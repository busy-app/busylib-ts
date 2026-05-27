import {
  getTime as getTimeApi,
  getTimezone as getTimezoneApi,
  getTzList as getTzListApi,
  setTimestamp as setTimestampApi,
  setTimezone as setTimezoneApi,
  SetTimestampParams,
  SetTimezoneParams
} from 'BusyBar/api/time';
import type { RequestOptions, TimestampInfo, SuccessResponse, TimezoneList, TimezoneInfo } from 'BusyBar/types';
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
   * @param {SetTimestampParams} params - Parameters for setting the timestamp.
   *   @param {SetTimestampParams['timestamp']} params.timestamp - Unix timestamp to set.
   *   @param {SetTimestampParams['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {SetTimestampParams['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves on success.
   */
  async TimeTimestampSet(this: BusyBar, params: SetTimestampParams): Promise<SuccessResponse> {
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
   * @param {SetTimezoneParams} params - Parameters for setting the timezone.
   *   @param {SetTimezoneParams['timezone']} params.timezone - Timezone string to set (e.g., "Europe/Moscow").
   *   @param {SetTimezoneParams['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {SetTimezoneParams['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves on success.
   */
  async TimeTimezoneSet(this: BusyBar, params: SetTimezoneParams): Promise<SuccessResponse> {
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
