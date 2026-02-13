import {
  getTime as getTimeApi,
  getTimezone as getTimezoneApi,
  getTzList as getTzListApi,
  setTimestamp as setTimestampApi,
  setTimezone as setTimezoneApi,
  SetTimestampParams,
  SetTimezoneParams,
} from "BusyBar/api/time";
import type {
  TimeoutOptions,
  TimestampInfo,
  SuccessResponse,
  TimezoneList,
  TimezoneInfo,
} from "Global/types";
import { BusyBar } from "BusyBar/index";

export class TimeMethods {
  /**
   * Get current timestamp info.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<TimestampInfo>} A promise that resolves to the timestamp information.
   */
  async TimeGet(
    this: BusyBar,
    params?: TimeoutOptions,
  ): Promise<TimestampInfo> {
    return await getTimeApi(this.apiClient, params);
  }

  /**
   * @deprecated Use `TimeGet` instead. will be removed in the next release.
   */
  async SystemTime(
    this: BusyBar,
    params?: TimeoutOptions,
  ): Promise<TimestampInfo> {
    return await this.TimeGet(params);
  }

  /**
   * Set system timestamp.
   *
   * @param {SetTimestampParams} params - Parameters for setting the timestamp.
   *   @param {number} params.timestamp - Unix timestamp to set.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} A promise that resolves on success.
   */
  async TimeTimestampSet(
    this: BusyBar,
    params: SetTimestampParams,
  ): Promise<SuccessResponse> {
    return await setTimestampApi(this.apiClient, params);
  }

  /**
   * @deprecated Use `TimeTimestampSet` instead. will be removed in the next release.
   */
  async SystemTimeTimestamp(
    this: BusyBar,
    params: SetTimestampParams,
  ): Promise<SuccessResponse> {
    return await this.TimeTimestampSet(params);
  }

  /**
   * Get current timezone.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<TimezoneInfo>} A promise that resolves to the timezone information.
   */
  async TimeTimezoneGet(
    this: BusyBar,
    params?: TimeoutOptions,
  ): Promise<TimezoneInfo> {
    return await getTimezoneApi(this.apiClient, params);
  }

  /**
   * Set system timezone.
   *
   * @param {SetTimezoneParams} params - Parameters for setting the timezone.
   *   @param {string} params.timezone - Timezone string to set (e.g., "Europe/Moscow").
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} A promise that resolves on success.
   */
  async TimeTimezoneSet(
    this: BusyBar,
    params: SetTimezoneParams,
  ): Promise<SuccessResponse> {
    return await setTimezoneApi(this.apiClient, params);
  }

  /**
   * @deprecated Use `TimeTimezoneSet` instead. will be removed in the next release.
   */
  async SystemTimeTimezone(
    this: BusyBar,
    params: SetTimezoneParams,
  ): Promise<SuccessResponse> {
    return await this.TimeTimezoneSet(params);
  }

  /**
   * Get list of supported timezones.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<TimezoneList>} A promise that resolves to a list of timezone items.
   */
  async TimeTzListGet(
    this: BusyBar,
    params?: TimeoutOptions,
  ): Promise<TimezoneList> {
    return await getTzListApi(this.apiClient, params);
  }

  /**
   * @deprecated Use `TimeTzListGet` instead. will be removed in the next release.
   */
  async SystemTimeTzList(
    this: BusyBar,
    params?: TimeoutOptions,
  ): Promise<TimezoneList> {
    return await this.TimeTzListGet(params);
  }
}
