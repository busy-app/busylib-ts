import isIPv4, { IPv4 } from "./utils/isIPv4";

import { initApiClient } from "api/createClient";

/**
 * Main library class for interacting with the Busy Bar API.
 *
 * @class
 */
export class Busylib {
  /**
   * Device IPv4 address.
   * @type {IPv4}
   * @readonly
   */
  public readonly ip: IPv4;

  /**
   * Creates an instance of Busylib.
   * Initializes the API client with the provided IPv4 address.
   *
   * @param {IPv4} [ip="10.0.4.20"] - The IPv4 address of the device.
   * @throws {Error} If the provided IP is not a valid IPv4 address.
   */
  constructor(ip: IPv4 = "10.0.4.20") {
    if (!isIPv4(ip)) {
      throw new Error(`Incorrect IPv4: ${ip}`);
    }
    this.ip = ip;

    console.log(this.ip);

    initApiClient(`http://${this.ip}/api/`);
  }
}
