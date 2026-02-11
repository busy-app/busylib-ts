import { initApiClient, setApiKey } from "BusyBar/api/createClient";

import { SystemMethods } from "./methods/System";
import { UpdateMethods } from "./methods/Update";
import { TimeMethods } from "./methods/Time";
import { AccountMethods } from "./methods/Account";
import { DisplayMethods } from "./methods/Display";
import { AudioMethods } from "./methods/Audio";
import { WifiMethods } from "./methods/Wifi";
import { StorageMethods } from "./methods/Storage";
import { SettingsMethods } from "./methods/Settings";
import { BleMethods } from "./methods/Ble";
import { InputMethods } from "./methods/Input";
import { MatterMethods } from "./methods/Matter";

import {
  DEFAULT_DEVICE_URL,
  DEFAULT_PROXY_URL,
  PROXY_HOST_RE,
} from "Global/constants";
import { isIPv4 } from "Global/utils/isIPv4";
import { isMdns } from "Global/utils/isMdns";
import type { paths } from "Global/API";
import type { ApiSemver } from "Global/types";

import createClient from "openapi-fetch";

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
    MatterMethods {}

export type BusyBarConfig = {
  addr?: string;
  token?: string;
};

/**
 * Main library class for interacting with the Busy Bar API.
 *
 * @class
 */
export class BusyBar {
  /**
   * Device host address (IP or mDNS).
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
   * Detected connection type based on auth requirements.
   * - "wifi": Device requires authentication (returned 401/403).
   * - "usb": Device allows access without token (returned 200).
   * - "unknown": Detection failed or not yet completed.
   */
  public connectionType: "usb" | "wifi" | "unknown" = "unknown";

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
   * - An mDNS hostname (e.g. `busybar.local`)
   * - A domain name
   * - A full URL (`http://` or `https://`)
   *
   * If no protocol is specified, `http://` will be automatically added.
   *
   * @param {BusyBarConfig['token']} config.token -
   * Optional authentication token.
   *
   * Must be provided when `addr` points to a secured proxy endpoint
   * such as `https://proxy.busy.app`.
   */
  constructor(config?: BusyBarConfig) {
    if (!config || (!config.addr && !config.token)) {
      this.addr = DEFAULT_DEVICE_URL;
    } else if (!config.addr) {
      this.addr = DEFAULT_PROXY_URL;
    } else {
      let addr = config.addr.trim();

      if (!/^https?:\/\//i.test(addr)) {
        addr = `http://${addr}`;
      }

      if (PROXY_HOST_RE.test(addr) && !config.token) {
        throw new Error("Token is required. Please provide it.");
      }

      this.addr = addr;
    }

    this.apiSemver = "";

    initApiClient(
      `${this.addr}/api/`,
      this.SystemVersionGet.bind(this),
      config?.token,
    );

    this.detectConnectionType();
  }

  /**
   * Probes the device to determine connection type.
   * Sends a request without authentication credentials.
   */
  private async detectConnectionType() {
    const hostname = new URL(this.addr).hostname;

    // If not a local address (not IP, not mDNS) -> assume Internet (Proxy)
    if (!isIPv4(hostname) && !isMdns(hostname)) {
      this.connectionType = "wifi";
      return;
    }

    // Create temporary client WITHOUT auth middleware
    const probeClient = createClient<paths>({
      baseUrl: `${this.addr}/api/`,
    });

    try {
      // Request an endpoint that requires authorization (e.g. device name)
      // client.GET does not throw on 4xx/5xx status, but throws on network error
      const { response } = await probeClient.GET("/name");

      if (response.status === 401 || response.status === 403) {
        // If auth is requested -> it is WiFi
        this.connectionType = "wifi";
      } else if (response.ok) {
        // If data returned without key -> it is USB (trusted connection)
        this.connectionType = "usb";
      } else {
        // Treat any other status as detection failure
        throw new Error(
          `Failed to detect connection type. Status: ${response.status}`,
        );
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Sets API key for all subsequent requests.
   * @param {string} key - API key to use in "X-API-Token" header.
   */
  setApiKey(key: string) {
    setApiKey(key);
  }
}

function applyMixins(derivedCtor: any, constructors: any[]) {
  constructors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
          Object.create(null),
      );
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
  MatterMethods,
]);
