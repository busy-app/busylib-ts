import { createApiClient, type BusyBarClient } from 'BusyBar/api/createClient';

import { SystemMethods } from './methods/System';
import { UpdateMethods } from './methods/Update';
import { TimeMethods } from './methods/Time';
import { AccountMethods } from './methods/Account';
import { DisplayMethods } from './methods/Display';
import { AudioMethods } from './methods/Audio';
import { WifiMethods } from './methods/Wifi';
import { StorageMethods } from './methods/Storage';
import { SettingsMethods } from './methods/Settings';
import { BleMethods } from './methods/Ble';
import { InputMethods } from './methods/Input';
import { SmartHomeMethods } from './methods/SmartHome';
import { AssetsMethods } from './methods/Assets';
import { BusyMethods } from './methods/Busy';

import { DEFAULT_DEVICE_URL, DEFAULT_PROXY_URL, PROXY_HOST_RE } from 'Global/constants';
import type { ApiSemver, ApiKey } from 'BusyBar/types/internal';

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface BusyBar
  extends
    SystemMethods,
    UpdateMethods,
    TimeMethods,
    AccountMethods,
    DisplayMethods,
    AudioMethods,
    WifiMethods,
    StorageMethods,
    SettingsMethods,
    BleMethods,
    InputMethods,
    AssetsMethods,
    SmartHomeMethods,
    BusyMethods {}

export type BusyBarConfig = {
  addr?: string;
  token?: string;
  timeout?: number;
  HTTPAccessPassword?: string;
};

/**
 * Main library class for interacting with the Busy Bar API.
 *
 * @class
 */
export class BusyBar {
  /**
   * Device host address.
   * @type {BusyBarConfig['host']}
   * @readonly
   */
  public readonly addr: string;
  /**
   * Current API semantic version.
   * @type {ApiSemver}
   */
  apiSemver: ApiSemver;

  /**
   * API Client instance.
   */
  public readonly apiClient: BusyBarClient;

  private setApiKeyFn: (key: ApiKey) => void;
  private setTokenFn: (token: string) => void;

  /**
   * Creates an instance of BUSY Bar.
   * Initializes the API client with the provided host address.
   *
   * @param {BusyBarConfig} config - BUSY Bar connection configuration
   * @param {BusyBarConfig['addr']} config.addr -
   * The device address or proxy endpoint.
   *
   * Can be:
   * - An IP address (e.g. `192.168.0.10`)
   * - A domain name
   * - A full URL (`http://` or `https://`)
   *
   * If no protocol is specified, `http://` will be automatically added.
   *
   * @param {BusyBarConfig['token']} config.token -
   * Optional authentication token.
   *
   * Must be provided when `addr` points to a secured proxy endpoint
   * such as `https://api.busy.app`.
   *
   * @param {BusyBarConfig['timeout']} config.timeout -
   * Optional default timeout for all requests in milliseconds.
   *
   * Defaults to `3000` if not provided. This value can be overridden in individual method calls.
   */
  constructor(config?: BusyBarConfig) {
    if (!config || (!config.addr && !config.token)) {
      this.addr = DEFAULT_DEVICE_URL;
    } else if (!config.addr) {
      this.addr = DEFAULT_PROXY_URL;
    } else {
      let addr = config.addr.trim();

      const hasExplicitProtocol = /^https?:\/\//i.test(addr);
      if (!hasExplicitProtocol) {
        addr = `http://${addr}`;
      }

      // Normalize to the bare origin, dropping any trailing path/slashes
      // (e.g. `api.busy.app/busybar/`, `api.busy.app/`) so the prefix is added once.
      addr = new URL(addr).origin;

      // Default the proxy host to https when no protocol was explicitly provided.
      if (!hasExplicitProtocol && PROXY_HOST_RE.test(addr)) {
        addr = addr.replace(/^http:/i, 'https:');
      }

      if (PROXY_HOST_RE.test(addr) && !config.token) {
        throw new Error('Token is required. Please provide it.');
      }

      this.addr = addr;
    }

    this.apiSemver = '';

    // Device endpoints live under `/api/`, the proxy exposes them under `/busybar/`.
    const pathPrefix = PROXY_HOST_RE.test(this.addr) ? '/busybar/' : '/api/';

    const { client, setApiKey, setToken } = createApiClient(
      `${this.addr}${pathPrefix}`,
      this.SystemVersionGet.bind(this),
      config?.token,
      config?.timeout,
      config?.HTTPAccessPassword
    );

    this.apiClient = client;
    this.setApiKeyFn = setApiKey;
    this.setTokenFn = setToken;
  }

  /**
   * Sets HTTP Access Password for all subsequent requests.
   * @param {string} key - API key to use in "X-API-Token" header.
   */
  setHTTPAccessPassword(key: string) {
    this.setApiKeyFn(key);
  }

  /**
   * Sets Bearer token for all subsequent requests.
   * @param {string} token - Bearer token to use in "Authorization" header.
   */
  setToken(token: string) {
    this.setTokenFn(token);
  }
}

function applyMixins(derivedCtor: any, constructors: any[]) {
  constructors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      Object.defineProperty(derivedCtor.prototype, name, Object.getOwnPropertyDescriptor(baseCtor.prototype, name) || Object.create(null));
    });
  });
}

applyMixins(BusyBar, [
  SystemMethods,
  UpdateMethods,
  TimeMethods,
  AccountMethods,
  DisplayMethods,
  AudioMethods,
  WifiMethods,
  StorageMethods,
  SettingsMethods,
  BleMethods,
  InputMethods,
  SmartHomeMethods,
  AssetsMethods,
  BusyMethods
]);
