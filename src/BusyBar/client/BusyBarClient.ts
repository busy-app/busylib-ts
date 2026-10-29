import { DEFAULT_TIMEOUT, resolveAddress } from './config';
import { toFetchError } from './errors';
import { withSignal } from './signal';
import { createTransport, sendRequest, type SendInit, type TransportResult } from './transport';
import type {
  ApiClient,
  ApiSemver,
  BusyBarConfig,
  HttpMethod,
  InitParam,
  PathsWithMethod,
  RequestClient,
  RequestInitFor,
  RequestOptions,
  ResponseData
} from './types';
import type { ApiKey } from './types.internal';

const VERSION_PATH = '/version';

type ClientInit = SendInit & RequestOptions;

/**
 * Core BUSY Bar client: holds the connection state and runs every request through one pipeline (timeout and abort, API version negotiation, auth headers, retry on 405, errors).
 *
 * @class
 */
export class BusyBarClient implements RequestClient {
  private readonly address: string;
  private readonly baseUrl: string;
  private transport: ApiClient | null = null;
  private readonly timeout: number;
  private token: string | undefined;
  private apiKey: ApiKey | undefined;
  private semver: ApiSemver = '';

  // Shared `/version` request, so parallel calls negotiate the version once.
  private versionRequest: Promise<void> | null = null;

  /**
   * Creates a BUSY Bar client for the given device or proxy.
   *
   * @param {BusyBarConfig} [config] - BUSY Bar connection configuration.
   * @param {BusyBarConfig['addr']} [config.addr] - Device address or proxy endpoint: an IP address (e.g. `192.168.0.10`), a domain name or a full URL; `http://` is added when no protocol is specified.
   * @param {BusyBarConfig['token']} [config.token] - Authentication token, required when `addr` points to a secured proxy endpoint such as `https://api.busy.app`.
   * @param {BusyBarConfig['timeout']} [config.timeout] - Default timeout for all requests in milliseconds, `3000` if not provided; can be overridden per request.
   * @param {BusyBarConfig['HTTPAccessPassword']} [config.HTTPAccessPassword] - HTTP access password sent in the "X-API-Token" header.
   */
  constructor(config?: BusyBarConfig) {
    const { addr, baseUrl } = resolveAddress(config);

    this.address = addr;
    this.baseUrl = baseUrl;
    this.timeout = config?.timeout ?? DEFAULT_TIMEOUT;
    this.token = config?.token;
    this.apiKey = config?.HTTPAccessPassword;
  }

  /**
   * Device host address.
   * @type {string}
   */
  get addr(): string {
    return this.address;
  }

  /**
   * API semantic version negotiated with the device, empty until the first request.
   * @type {ApiSemver}
   */
  get apiSemver(): ApiSemver {
    return this.semver;
  }

  /**
   * Raw transport: requests sent through it bypass the core pipeline, so they get no auth headers, no version negotiation, no timeout, and errors are returned instead of thrown.
   * @type {ApiClient}
   */
  get apiClient(): ApiClient {
    if (!this.transport) {
      this.transport = createTransport(this.baseUrl);
    }
    return this.transport;
  }

  /**
   * Sets Bearer token for all subsequent requests.
   * @param {string} token - Bearer token to use in "Authorization" header.
   */
  setToken(token: string) {
    this.token = token;
  }

  /**
   * Sets HTTP Access Password for all subsequent requests.
   * @param {string} key - API key to use in "X-API-Token" header.
   */
  setHTTPAccessPassword(key: string) {
    this.apiKey = key;
  }

  /**
   * Sends a typed request to any endpoint through the core pipeline.
   *
   * @param {HttpMethod} method - HTTP method.
   * @param {string} path - Endpoint path from the API schema, e.g. `/status`.
   * @param {object} [init] - Transport init (`params`, `body`, `headers`, `parseAs`) plus `timeout` and `signal`.
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
   * Sends a typed GET request through the core pipeline.
   *
   * @param {string} path - Endpoint path from the API schema, e.g. `/status`.
   * @param {object} [init] - Transport init (`params`, `headers`, `parseAs`) plus `timeout` and `signal`.
   * @returns {Promise} Response data; a non-2xx response is thrown as `FetchError`.
   */
  GET<P extends PathsWithMethod<'GET'>, I extends RequestInitFor<'GET', P>>(path: P, ...init: InitParam<I>): Promise<ResponseData<'GET', P, I>> {
    return this.send('GET', path, init[0] as ClientInit | undefined) as Promise<ResponseData<'GET', P, I>>;
  }

  /**
   * Sends a typed POST request through the core pipeline.
   *
   * @param {string} path - Endpoint path from the API schema, e.g. `/display/draw`.
   * @param {object} [init] - Transport init (`params`, `body`, `headers`, `parseAs`) plus `timeout` and `signal`.
   * @returns {Promise} Response data; a non-2xx response is thrown as `FetchError`.
   */
  POST<P extends PathsWithMethod<'POST'>, I extends RequestInitFor<'POST', P>>(path: P, ...init: InitParam<I>): Promise<ResponseData<'POST', P, I>> {
    return this.send('POST', path, init[0] as ClientInit | undefined) as Promise<ResponseData<'POST', P, I>>;
  }

  /**
   * Sends a typed PUT request through the core pipeline.
   *
   * @param {string} path - Endpoint path from the API schema, e.g. `/busy/snapshot`.
   * @param {object} [init] - Transport init (`params`, `body`, `headers`, `parseAs`) plus `timeout` and `signal`.
   * @returns {Promise} Response data; a non-2xx response is thrown as `FetchError`.
   */
  PUT<P extends PathsWithMethod<'PUT'>, I extends RequestInitFor<'PUT', P>>(path: P, ...init: InitParam<I>): Promise<ResponseData<'PUT', P, I>> {
    return this.send('PUT', path, init[0] as ClientInit | undefined) as Promise<ResponseData<'PUT', P, I>>;
  }

  /**
   * Sends a typed DELETE request through the core pipeline.
   *
   * @param {string} path - Endpoint path from the API schema, e.g. `/display/draw`.
   * @param {object} [init] - Transport init (`params`, `body`, `headers`, `parseAs`) plus `timeout` and `signal`.
   * @returns {Promise} Response data; a non-2xx response is thrown as `FetchError`.
   */
  DELETE<P extends PathsWithMethod<'DELETE'>, I extends RequestInitFor<'DELETE', P>>(path: P, ...init: InitParam<I>): Promise<ResponseData<'DELETE', P, I>> {
    return this.send('DELETE', path, init[0] as ClientInit | undefined) as Promise<ResponseData<'DELETE', P, I>>;
  }

  private send(method: HttpMethod, path: string, init: ClientInit | undefined): Promise<unknown> {
    const timeout = init?.timeout ?? this.timeout;

    // The timeout covers version negotiation too. A sync arrow calling a method: JerryScript loses `this` inside async arrows.
    return withSignal((signal) => this.pipeline(method, path, init, signal), timeout, init?.signal);
  }

  // The transport reads only its own fields of `init`, so `timeout` and `signal` are left in it.
  private async pipeline(method: HttpMethod, path: string, init: ClientInit | undefined, signal: AbortSignal | undefined): Promise<unknown> {
    const isVersion = path === VERSION_PATH;

    if (!isVersion && !this.semver) {
      await this.ensureVersion();
    }

    let result = await this.dispatch(method, path, init, signal);

    // The device rejects an outdated X-API-Sem-Ver with 405: renegotiate and retry once. The transport serializes the body again, so requests with a body are retried too.
    if (result.response.status === 405 && !isVersion) {
      this.semver = '';
      await this.ensureVersion();
      result = await this.dispatch(method, path, init, signal);
    }

    if (!result.response.ok) {
      throw toFetchError(result.response, result.error);
    }

    if (isVersion) {
      this.semver = (result.data as { api_semver?: ApiSemver } | undefined)?.api_semver ?? '';
    }

    return result.data;
  }

  private dispatch(method: HttpMethod, path: string, init: ClientInit | undefined, signal: AbortSignal | undefined): Promise<TransportResult> {
    return sendRequest(this.baseUrl, method, path, init, this.coreHeaders(path), signal);
  }

  // Lowercase names: the transport sets them over the same headers from `init` as they are.
  private coreHeaders(path: string): Record<string, string> {
    const headers: Record<string, string> = {};

    if (this.token) {
      headers['authorization'] = `Bearer ${this.token}`;
    }

    if (path !== VERSION_PATH) {
      if (this.semver) {
        headers['x-api-sem-ver'] = this.semver;
      }
      if (this.apiKey) {
        headers['x-api-token'] = this.apiKey;
      }
    }

    return headers;
  }

  private async ensureVersion(): Promise<void> {
    if (this.semver) {
      return;
    }

    if (!this.versionRequest) {
      this.versionRequest = this.GET(VERSION_PATH)
        .then(({ api_semver }) => {
          if (!api_semver) {
            throw new Error('Empty API version');
          }
        })
        .finally(() => {
          this.versionRequest = null;
        });
    }

    await this.versionRequest;
  }
}
