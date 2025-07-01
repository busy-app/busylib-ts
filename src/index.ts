import isIPv4, { IPv4 } from "./utils/isIPv4";

import { initApiClient } from "api/createClient";

import {
  upload as uploadAssetsApi,
  deleteAssets as deleteAssetsApi,
} from "api/assets";
import type { UploadParams, DeleteParams } from "api/assets";

import { draw as drawDisplayApi, clear as clearDisplayApi } from "api/display";
import type { DrawParams } from "api/display";

import { play as playSoundApi, stop as stopSoundApi } from "api/audio";
import type { AudioParams } from "api/audio";

/**
 * Main library class for interacting with the Busy Bar API.
 *
 * @class
 */
export class BusyBar {
  /**
   * Device IPv4 address.
   * @type {IPv4}
   * @readonly
   */
  public readonly ip: IPv4;

  /**
   * Creates an instance of BUSY Bar.
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

  /**
   * Uploads an asset to the device.
   *
   * @param {UploadParams} params - Parameters for the upload.
   * @param {UploadParams['appId']} params.appId - Application ID for organizing assets.
   * @param {UploadParams['fileName']} params.fileName - Filename for the uploaded asset.
   * @param {UploadParams['file']} params.file - File data to upload.
   * @returns {Promise<{ result: string }>} Result of the upload operation.
   */
  async uploadAsset(params: UploadParams): Promise<{ result: string }> {
    // check file
    // convert file

    return await uploadAssetsApi(params);
  }

  /**
   * Deletes all assets for a specific application from the device.
   *
   * @param {DeleteParams} params - Parameters for the delete.
   * @param {DeleteParams['appId']} params.appId - Application ID whose assets should be deleted.
   * @returns {Promise<{ result: string }>} Result of the delete operation.
   */
  async deleteAssets(params: DeleteParams): Promise<{ result: string }> {
    return await deleteAssetsApi(params);
  }

  /**
   * Draws elements on the device display.
   *
   * @param {DrawParams} params - Parameters for the draw operation.
   * @param {DrawParams['appId']} params.appId - Application ID for organizing display elements.
   * @param {DrawParams['elements'][]} params.elements - Array of display elements (text or image).
   * @returns {Promise<{ result: string }>} Result of the draw operation.
   */
  async drawDisplay(params: DrawParams): Promise<{ result: string }> {
    return await drawDisplayApi(params);
  }

  /**
   * Clears the device display and stops the Canvas application if running.
   *
   * @returns {Promise<{ result: string }>} Result of the clear operation.
   */
  async clearDisplay(): Promise<{ result: string }> {
    return await clearDisplayApi();
  }

  /**
   * Plays an audio file from the assets directory.
   *
   * @param {AudioParams} params - Parameters for the audio playback.
   * @param {AudioParams['appId']} params.appId - Application ID for organizing assets.
   * @param {AudioParams['path']} params.path - Path to the audio file within the app's assets directory.
   * @returns {Promise<{ result: string }>} Result of the play operation.
   */
  async playSound(params: AudioParams): Promise<{ result: string }> {
    return await playSoundApi(params);
  }

  /**
   * Stops any currently playing audio on the device.
   *
   * @returns {Promise<{ result: string }>} Result of the stop operation.
   */
  async stopSound(): Promise<{ result: string }> {
    return await stopSoundApi();
  }
}
