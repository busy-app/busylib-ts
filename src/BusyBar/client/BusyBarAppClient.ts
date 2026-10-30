import { toFetchError } from './errors';
import { sendRequest, type SendInit, type TransportResult } from './transport';
import type { BusyBarAppConfig, HttpMethod, InitParam, PathsWithMethod, RequestClient, RequestInitFor, RequestOptions, ResponseData } from './types';
import type { RequestOptionsFor } from './types.internal';

type ClientInit = SendInit & RequestOptions;

/**
 * Client for apps that run on the BUSY Bar itself: requests go to the device's own HTTP API with only errors on top. An app needs no authentication (requests from the device itself are always allowed), no API version negotiation (the firmware checks the app's `api_version` when installing and launching it) and no proxy; this keeps every request as light as the bare `fetch`. It has no timeout either: the firmware cannot cancel a request, and it fails one itself when no data comes for too long.
 *
 * @class
 */
export class BusyBarAppClient implements RequestClient {
  private readonly baseUrl: string;
  private warned = false;

  /**
   * Creates a client for the device the app runs on.
   *
   * @param {BusyBarAppConfig} [config] - Client configuration.
   * @param {BusyBarAppConfig['addr']} [config.addr] - Device host or origin, e.g. `10.0.4.20` or `http://10.0.4.20`, `localhost` (the device the app runs on) if not provided. Taken as is: a host without a protocol gets `http://`, nothing else is checked.
   */
  constructor(config?: BusyBarAppConfig) {
    // No resolveAddress: an app talks to a device, never to the proxy, and its bundle should not carry the address checks of BusyBarClient.
    const addr = config?.addr ?? 'localhost';
    this.baseUrl = `${/^https?:\/\//i.test(addr) ? addr : `http://${addr}`}/api/`;
  }

  /**
   * Sends a typed request to any endpoint.
   *
   * @param {HttpMethod} method - HTTP method.
   * @param {string} path - Endpoint path from the API schema, e.g. `/status`.
   * @param {object} [init] - Transport init (`params`, `body`, `headers`, `parseAs`).
   * @returns {Promise} Response data; a non-2xx response is thrown as `FetchError`.
   */
  request<M extends HttpMethod, P extends PathsWithMethod<M>, I extends RequestInitFor<M, P>>(
    method: M,
    path: P,
    ...init: InitParam<I, RequestOptionsFor<BusyBarAppClient>>
  ): Promise<ResponseData<M, P, I>> {
    return this.send(method, path, init[0] as ClientInit | undefined) as Promise<ResponseData<M, P, I>>;
  }

  /**
   * Sends a typed GET request.
   *
   * @param {string} path - Endpoint path from the API schema, e.g. `/status`.
   * @param {object} [init] - Transport init (`params`, `headers`, `parseAs`).
   * @returns {Promise} Response data; a non-2xx response is thrown as `FetchError`.
   */
  GET<P extends PathsWithMethod<'GET'>, I extends RequestInitFor<'GET', P>>(
    path: P,
    ...init: InitParam<I, RequestOptionsFor<BusyBarAppClient>>
  ): Promise<ResponseData<'GET', P, I>> {
    return this.send('GET', path, init[0] as ClientInit | undefined) as Promise<ResponseData<'GET', P, I>>;
  }

  /**
   * Sends a typed POST request.
   *
   * @param {string} path - Endpoint path from the API schema, e.g. `/display/draw`.
   * @param {object} [init] - Transport init (`params`, `body`, `headers`, `parseAs`).
   * @returns {Promise} Response data; a non-2xx response is thrown as `FetchError`.
   */
  POST<P extends PathsWithMethod<'POST'>, I extends RequestInitFor<'POST', P>>(
    path: P,
    ...init: InitParam<I, RequestOptionsFor<BusyBarAppClient>>
  ): Promise<ResponseData<'POST', P, I>> {
    return this.send('POST', path, init[0] as ClientInit | undefined) as Promise<ResponseData<'POST', P, I>>;
  }

  /**
   * Sends a typed PUT request.
   *
   * @param {string} path - Endpoint path from the API schema, e.g. `/busy/snapshot`.
   * @param {object} [init] - Transport init (`params`, `body`, `headers`, `parseAs`).
   * @returns {Promise} Response data; a non-2xx response is thrown as `FetchError`.
   */
  PUT<P extends PathsWithMethod<'PUT'>, I extends RequestInitFor<'PUT', P>>(
    path: P,
    ...init: InitParam<I, RequestOptionsFor<BusyBarAppClient>>
  ): Promise<ResponseData<'PUT', P, I>> {
    return this.send('PUT', path, init[0] as ClientInit | undefined) as Promise<ResponseData<'PUT', P, I>>;
  }

  /**
   * Sends a typed DELETE request.
   *
   * @param {string} path - Endpoint path from the API schema, e.g. `/display/draw`.
   * @param {object} [init] - Transport init (`params`, `body`, `headers`, `parseAs`).
   * @returns {Promise} Response data; a non-2xx response is thrown as `FetchError`.
   */
  DELETE<P extends PathsWithMethod<'DELETE'>, I extends RequestInitFor<'DELETE', P>>(
    path: P,
    ...init: InitParam<I, RequestOptionsFor<BusyBarAppClient>>
  ): Promise<ResponseData<'DELETE', P, I>> {
    return this.send('DELETE', path, init[0] as ClientInit | undefined) as Promise<ResponseData<'DELETE', P, I>>;
  }

  // `timeout` and `signal` only get a warning, once per client: the types reject them, and a JavaScript app that passes them keeps running.
  private async send(method: HttpMethod, path: string, init: ClientInit | undefined): Promise<unknown> {
    if (!this.warned && (init?.timeout !== undefined || init?.signal !== undefined)) {
      this.warned = true;
      console.warn('BusyBarAppClient ignores timeout and signal: the BUSY Bar firmware cannot cancel a request');
    }

    let result: TransportResult;
    try {
      result = await sendRequest(this.baseUrl, method, path, init);
    } catch (error) {
      throw toError(error);
    }

    if (!result.response.ok) {
      throw toFetchError(result.response, result.error);
    }

    return result.data;
  }
}

// The firmware rejects a failed fetch or body read with a bare string, such as "Inactivity timeout" when no data comes for too long; it becomes an Error, named TimeoutError for the timeout, as with BusyBarClient.
function toError(error: unknown): unknown {
  return typeof error === 'string' ? Object.assign(new Error(error), error === 'Inactivity timeout' ? { name: 'TimeoutError' } : undefined) : error;
}
