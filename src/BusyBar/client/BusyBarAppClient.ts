import { DEFAULT_TIMEOUT, resolveAddress } from './config';
import { toFetchError } from './errors';
import { withTimeout } from './signal';
import { sendRequest, type SendInit } from './transport';
import type { BusyBarAppConfig, HttpMethod, InitParam, PathsWithMethod, RequestClient, RequestInitFor, RequestOptions, ResponseData } from './types';

type ClientInit = SendInit & RequestOptions;

/**
 * Client for apps that run on the BUSY Bar itself: requests go to the device's own HTTP API with only a timeout and errors on top. An app needs no authentication (requests from the device itself are always allowed), no API version negotiation (the firmware checks the app's `api_version` when installing and launching it) and no proxy; this keeps every request as light as the bare `fetch`.
 *
 * @class
 */
export class BusyBarAppClient implements RequestClient {
  private readonly baseUrl: string;
  private readonly timeout: number;

  /**
   * Creates a client for the device the app runs on.
   *
   * @param {BusyBarAppConfig} [config] - Client configuration.
   * @param {BusyBarAppConfig['addr']} [config.addr] - Device address, `localhost` (the device the app runs on) if not provided.
   * @param {BusyBarAppConfig['timeout']} [config.timeout] - Default timeout for all requests in milliseconds, `3000` if not provided; can be overridden per request. The firmware cannot cancel a request, so a timeout rejects the promise while the request itself runs to the end.
   */
  constructor(config?: BusyBarAppConfig) {
    this.baseUrl = resolveAddress({ addr: config?.addr ?? 'localhost' }).baseUrl;
    this.timeout = config?.timeout ?? DEFAULT_TIMEOUT;
  }

  /**
   * Sends a typed request to any endpoint.
   *
   * @param {HttpMethod} method - HTTP method.
   * @param {string} path - Endpoint path from the API schema, e.g. `/status`.
   * @param {object} [init] - Transport init (`params`, `body`, `headers`, `parseAs`) plus `timeout`.
   * @returns {Promise} Response data; a non-2xx response is thrown as `FetchError`.
   */
  request<M extends HttpMethod, P extends PathsWithMethod<M>, I extends RequestInitFor<M, P>>(
    method: M,
    path: P,
    ...init: InitParam<I>
  ): Promise<ResponseData<M, P, I>> {
    return this.send(method, path, init[0] as ClientInit | undefined) as Promise<ResponseData<M, P, I>>;
  }

  /**
   * Sends a typed GET request.
   *
   * @param {string} path - Endpoint path from the API schema, e.g. `/status`.
   * @param {object} [init] - Transport init (`params`, `headers`, `parseAs`) plus `timeout`.
   * @returns {Promise} Response data; a non-2xx response is thrown as `FetchError`.
   */
  GET<P extends PathsWithMethod<'GET'>, I extends RequestInitFor<'GET', P>>(path: P, ...init: InitParam<I>): Promise<ResponseData<'GET', P, I>> {
    return this.send('GET', path, init[0] as ClientInit | undefined) as Promise<ResponseData<'GET', P, I>>;
  }

  /**
   * Sends a typed POST request.
   *
   * @param {string} path - Endpoint path from the API schema, e.g. `/display/draw`.
   * @param {object} [init] - Transport init (`params`, `body`, `headers`, `parseAs`) plus `timeout`.
   * @returns {Promise} Response data; a non-2xx response is thrown as `FetchError`.
   */
  POST<P extends PathsWithMethod<'POST'>, I extends RequestInitFor<'POST', P>>(path: P, ...init: InitParam<I>): Promise<ResponseData<'POST', P, I>> {
    return this.send('POST', path, init[0] as ClientInit | undefined) as Promise<ResponseData<'POST', P, I>>;
  }

  /**
   * Sends a typed PUT request.
   *
   * @param {string} path - Endpoint path from the API schema, e.g. `/busy/snapshot`.
   * @param {object} [init] - Transport init (`params`, `body`, `headers`, `parseAs`) plus `timeout`.
   * @returns {Promise} Response data; a non-2xx response is thrown as `FetchError`.
   */
  PUT<P extends PathsWithMethod<'PUT'>, I extends RequestInitFor<'PUT', P>>(path: P, ...init: InitParam<I>): Promise<ResponseData<'PUT', P, I>> {
    return this.send('PUT', path, init[0] as ClientInit | undefined) as Promise<ResponseData<'PUT', P, I>>;
  }

  /**
   * Sends a typed DELETE request.
   *
   * @param {string} path - Endpoint path from the API schema, e.g. `/display/draw`.
   * @param {object} [init] - Transport init (`params`, `body`, `headers`, `parseAs`) plus `timeout`.
   * @returns {Promise} Response data; a non-2xx response is thrown as `FetchError`.
   */
  DELETE<P extends PathsWithMethod<'DELETE'>, I extends RequestInitFor<'DELETE', P>>(path: P, ...init: InitParam<I>): Promise<ResponseData<'DELETE', P, I>> {
    return this.send('DELETE', path, init[0] as ClientInit | undefined) as Promise<ResponseData<'DELETE', P, I>>;
  }

  // The transport reads only its own fields of `init`, so `timeout` is left in it; `signal` goes to fetch as is, the device firmware ignores it.
  private async send(method: HttpMethod, path: string, init: ClientInit | undefined): Promise<unknown> {
    const result = await withTimeout(sendRequest(this.baseUrl, method, path, init), init?.timeout ?? this.timeout);

    if (!result.response.ok) {
      throw toFetchError(result.response, result.error);
    }

    return result.data;
  }
}
