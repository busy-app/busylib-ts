import isIPv4, { IPv4 } from "./utils/isIPv4";
import type { components } from "BusyBar/types/API";

import { initApiClient } from "BusyBar/api/createClient";

import {
  upload as uploadAssetsApi,
  deleteAssets as deleteAssetsApi,
} from "BusyBar/api/assets";
import type { UploadParams, DeleteParams } from "BusyBar/api/assets";

import {
  draw as drawDisplayApi,
  clear as clearDisplayApi,
} from "BusyBar/api/display";
import type { DrawParams } from "BusyBar/api/display";

import { play as playSoundApi, stop as stopSoundApi } from "BusyBar/api/audio";
import type { AudioParams } from "BusyBar/api/audio";

import {
  enable as enableWifiApi,
  disable as disableWifiApi,
  status as statusWifiApi,
  connect as connectWifiApi,
  disconnect as disconnectWifiApi,
  networks as networksWifiAPi,
  forget as forgetWifiApi,
} from "BusyBar/api/wifi";
import type { ConnectParams } from "BusyBar/api/wifi";

import {
  write as writeStorageApi,
  read as readStorageApi,
  list as listStorageApi,
  remove as removeStorageApi,
  mkdir as mkdirStorageApi,
} from "BusyBar/api/storage";
import type {
  UploadFileParams,
  DownloadFileParams,
  ReadDirectoryParams,
  RemoveParams,
  CreateDirectoryParams,
} from "BusyBar/api/storage";

import { version as versionApi } from "BusyBar/api/system";

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
  // @ts-ignore
  private apiSemver: components["schemas"]["VersionInfo"]["api_semver"];

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
    this.apiSemver = "";

    initApiClient(`http://${this.ip}/api/`, this.getApiVersion.bind(this));
  }

  /**
   * Retrieves the API semantic version.
   *
   * @returns A promise that resolves to an object containing the `api_semver` string.
   */
  private async getApiVersion(): Promise<{ api_semver: string }> {
    const response = await versionApi();
    this.apiSemver = response.api_semver;

    return response;
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

  /**
   * Enables the device's Wi-Fi module.
   *
   * @returns {Promise<components['schemas']['SuccessResponse']>} Result of the enable operation.
   */
  async enableWifi(): Promise<components["schemas"]["SuccessResponse"]> {
    return await enableWifiApi();
  }

  /**
   * Disables the device's Wi-Fi module.
   *
   * @returns {Promise<components['schemas']['SuccessResponse']>} Result of the disable operation.
   */
  async disableWifi(): Promise<components["schemas"]["SuccessResponse"]> {
    return await disableWifiApi();
  }

  /**
   * Gets the current status of the Wi-Fi module.
   *
   * @returns {Promise<components['schemas']['StatusResponse']>} Current Wi-Fi status.
   */
  async statusWifi(): Promise<components["schemas"]["StatusResponse"]> {
    return await statusWifiApi();
  }

  /**
   * Connects the device to a Wi-Fi network with the specified parameters.
   *
   * @param {ConnectParams} params - Connection parameters:
   *   @param {ConnectParams['ssid']} params.ssid - SSID (network name) to connect to.
   *   @param {ConnectParams['password']} [params.password] - Password for the Wi-Fi network (if required).
   *   @param {ConnectParams['security']} params.security - Security type (e.g., "open", "wpa2", etc.).
   *   @param {ConnectParams['ipConfig']} params.ipConfig - IP configuration object:
   *     @param {ConnectParams['ipConfig']['ipMethod']} params.ipConfig.ipMethod - IP assignment method ("dhcp" or "static").
   *     @param {ConnectParams['ipConfig']['ipType']} params.ipConfig.ipType - IP type ("ipv4" or "ipv6").
   *     @param {ConnectParams['ipConfig']['address']} [params.ipConfig.address] - Static IP address (if using "static" method).
   *     @param {ConnectParams['ipConfig']['mask']} [params.ipConfig.mask] - Subnet mask (if using "static" method).
   *     @param {ConnectParams['ipConfig']['gateway']} [params.ipConfig.gateway] - Gateway address (if using "static" method).
   * @returns {Promise<components['schemas']['SuccessResponse']>} Result of the connect operation.
   */
  async connectWifi(
    params: ConnectParams
  ): Promise<components["schemas"]["SuccessResponse"]> {
    return await connectWifiApi(params);
  }

  /**
   * Disconnects the device from the current Wi-Fi network.
   *
   * @returns {Promise<components['schemas']['SuccessResponse']>} Result of the disconnect operation.
   */
  async disconnectWifi(): Promise<components["schemas"]["SuccessResponse"]> {
    return await disconnectWifiApi();
  }

  /**
   * Scans for available Wi-Fi networks near your device.
   *
   * @returns {Promise<components['schemas']['NetworkResponse']>} List of discovered networks.
   */
  async networksWifi(): Promise<components["schemas"]["NetworkResponse"]> {
    return await networksWifiAPi();
  }

  /**
   * Removes the saved Wi-Fi configuration (forgets the network).
   *
   * @returns {Promise<never>} Result of the forget operation.
   */
  async forgetWifi(): Promise<never> {
    return await forgetWifiApi();
  }

  /**
   * Uploads a file to the device's internal storage.
   *
   * @param {UploadFileParams} params - Upload parameters:
   *   @param {UploadFileParams['path']} params.path - Path where the file will be saved (e.g., "/ext/test.png").
   *   @param {UploadFileParams['file']} params.file - File data to upload.
   * @returns {Promise<components['schemas']['SuccessResponse']>} Result of the upload operation.
   */
  async uploadFile(
    params: UploadFileParams
  ): Promise<components["schemas"]["SuccessResponse"]> {
    return await writeStorageApi(params);
  }

  /**
   * Downloads a file from the device's internal storage.
   *
   * @param {DownloadFileParams} params - Download parameters:
   *   @param {DownloadFileParams['path']} params.path - Path to the file to download (e.g., "/ext/test.png").
   *   @param {DownloadFileParams['asArrayBuffer']} [params.asArrayBuffer] - If true, returns data as ArrayBuffer; otherwise, as Blob.
   * @returns {Promise<ArrayBuffer | Blob>} The file data.
   */
  async downloadFile(params: DownloadFileParams): Promise<ArrayBuffer | Blob> {
    return await readStorageApi(params);
  }

  /**
   * Reads the contents of a directory (files and subdirectories) at the specified path.
   *
   * @param {ReadDirectoryParams} params - List parameters:
   *   @param {ReadDirectoryParams['path']} params.path - Path to the directory to list (e.g., "/ext").
   * @returns {Promise<components["schemas"]["StorageList"]>} List of files and directories.
   */
  async readDirectory(
    params: ReadDirectoryParams
  ): Promise<components["schemas"]["StorageList"]> {
    return await listStorageApi(params);
  }

  /**
   * Removes a file or a directory from the device's internal storage.
   *
   * @param {RemoveParams} params - Remove parameters:
   *   @param {RemoveParams['path']} params.path - Path of the file to remove (e.g., "/ext/test.png").
   * @returns {Promise<components['schemas']['SuccessResponse']>} Result of the remove operation.
   */
  async removeResource(
    params: RemoveParams
  ): Promise<components["schemas"]["SuccessResponse"]> {
    return await removeStorageApi(params);
  }

  /**
   * Creates a new directory in the device's internal storage.
   *
   * @param {CreateDirectoryParams} params - Directory creation parameters:
   *   @param {CreateDirectoryParams['path']} params.path - Path to the new directory (e.g., "/ext/newdir").
   * @returns {Promise<components['schemas']['SuccessResponse']>} Result of the create operation.
   */
  async createDirectory(
    params: CreateDirectoryParams
  ): Promise<components["schemas"]["SuccessResponse"]> {
    return await mkdirStorageApi(params);
  }
}
