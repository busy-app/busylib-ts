import type { RequestClient } from 'BusyBar/client/types';
import type { RequestOptionsFor } from 'BusyBar/client/types.internal';
import type {
  LogDumpParams,
  LogDumpResponse,
  NetworkInterfaceInfo,
  Status,
  StatusDevice,
  StatusFirmware,
  StatusPower,
  StatusSystem,
  VersionInfo
} from 'BusyBar/scopes/system/types';

/**
 * Get API version information.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<VersionInfo>} A promise that resolves to an object containing the `api_semver` string.
 */
export async function systemVersionGet<C extends RequestClient>(client: C, options?: RequestOptionsFor<C>): Promise<VersionInfo> {
  return client.GET('/version', options);
}

/**
 * Get full status.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<Status>} Current status of the device.
 */
export async function systemStatusGet<C extends RequestClient>(client: C, options?: RequestOptionsFor<C>): Promise<Status> {
  return client.GET('/status', options);
}

/**
 * Get system status.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<StatusSystem>} Current system status.
 */
export async function systemInfoGet<C extends RequestClient>(client: C, options?: RequestOptionsFor<C>): Promise<StatusSystem> {
  return client.GET('/status/system', options);
}

/**
 * Get power status.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<StatusPower>} Current power status.
 */
export async function systemStatusPowerGet<C extends RequestClient>(client: C, options?: RequestOptionsFor<C>): Promise<StatusPower> {
  return client.GET('/status/power', options);
}

/**
 * Get device status.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<StatusDevice>} Current device status.
 */
export async function systemStatusDeviceGet<C extends RequestClient>(client: C, options?: RequestOptionsFor<C>): Promise<StatusDevice> {
  return client.GET('/status/device', options);
}

/**
 * Get firmware status.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<StatusFirmware>} Current firmware status.
 */
export async function systemStatusFirmwareGet<C extends RequestClient>(client: C, options?: RequestOptionsFor<C>): Promise<StatusFirmware> {
  return client.GET('/status/firmware', options);
}

/**
 * Get device transport information.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<NetworkInterfaceInfo>} Current transport info (usb/wifi).
 */
export async function systemTransportGet<C extends RequestClient>(client: C, options?: RequestOptionsFor<C>): Promise<NetworkInterfaceInfo> {
  return client.GET('/transport', options);
}

/**
 * Dump captured log. Snapshot the in-memory log buffer to a file (defaults to /ext/log.txt).
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {LogDumpParams} [params] - Optional parameters.
 *   @param {LogDumpParams['filename']} [params.filename] - Destination file name without extension (defaults to `log`).
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<LogDumpResponse>} A promise that resolves to the result and the full path to the written log file.
 */
export async function systemLogDump<C extends RequestClient>(client: C, params?: LogDumpParams, options?: RequestOptionsFor<C>): Promise<LogDumpResponse> {
  return client.POST('/log_dump', {
    params: {
      query: {
        filename: params?.filename
      }
    },
    ...options
  });
}
