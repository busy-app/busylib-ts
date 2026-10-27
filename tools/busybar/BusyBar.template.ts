// Template of src/BusyBar/BusyBar.generated.ts: the fixed part of the class. tools/busybar/build-busybar.mjs adds the function imports at `@busybar:imports` and one method per function at `@busybar:methods`.
import { BusyBarClient } from 'BusyBar/client/BusyBarClient';
import { bindMethods } from 'BusyBar/bindMethods';
import type { ApiClient, ApiSemver, BusyBarConfig } from 'BusyBar/client/types';
// @busybar:imports

/**
 * Main library class for interacting with the BUSY Bar API: every API method on one object. To bundle only the methods an app uses, call the functions with a BusyBarClient instead.
 *
 * @class
 */
export class BusyBar {
  private readonly clientInstance: BusyBarClient;

  /**
   * Creates an instance of BUSY Bar.
   *
   * @param {BusyBarConfig} [config] - BUSY Bar connection configuration.
   * @param {BusyBarConfig['addr']} [config.addr] - Device address or proxy endpoint: an IP address (e.g. `192.168.0.10`), a domain name or a full URL; `http://` is added when no protocol is specified.
   * @param {BusyBarConfig['token']} [config.token] - Authentication token, required when `addr` points to a secured proxy endpoint such as `https://api.busy.app`.
   * @param {BusyBarConfig['timeout']} [config.timeout] - Default timeout for all requests in milliseconds, `3000` if not provided; can be overridden per request.
   * @param {BusyBarConfig['HTTPAccessPassword']} [config.HTTPAccessPassword] - HTTP access password sent in the "X-API-Token" header.
   */
  constructor(config?: BusyBarConfig) {
    this.clientInstance = new BusyBarClient(config);
    bindMethods(this, BusyBar.prototype);
  }

  /**
   * Core client: pass it to the functions, or call its typed `GET`/`POST`/`PUT`/`DELETE`/`request` for endpoints without a method.
   * @type {BusyBarClient}
   */
  get client(): BusyBarClient {
    return this.clientInstance;
  }

  /**
   * Device host address.
   * @type {string}
   */
  get addr(): string {
    return this.clientInstance.addr;
  }

  /**
   * API semantic version negotiated with the device, empty until the first request.
   * @type {ApiSemver}
   */
  get apiSemver(): ApiSemver {
    return this.clientInstance.apiSemver;
  }

  /**
   * Raw transport: requests sent through it bypass the core pipeline, so they get no auth headers, no version negotiation, no timeout, and errors are returned instead of thrown.
   * @type {ApiClient}
   */
  get apiClient(): ApiClient {
    return this.clientInstance.apiClient;
  }

  /**
   * Sets Bearer token for all subsequent requests.
   * @param {string} token - Bearer token to use in "Authorization" header.
   */
  setToken(token: string) {
    this.clientInstance.setToken(token);
  }

  /**
   * Sets HTTP Access Password for all subsequent requests.
   * @param {string} key - API key to use in "X-API-Token" header.
   */
  setHTTPAccessPassword(key: string) {
    this.clientInstance.setHTTPAccessPassword(key);
  }

  // @busybar:methods
}
