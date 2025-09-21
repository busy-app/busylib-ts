import isIPv4, { IPv4 } from "./utils/isIPv4";
import type { components } from "Global/API";
import type { ApiSemver } from "Global/types";

import { initApiClient, setApiKey } from "BusyBar/api/createClient";

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

import {
  version as versionApi,
  update as updateApi,
  status as statusApi,
  systemStatus as systemStatusApi,
  powerStatus as powerStatusApi,
} from "BusyBar/api/system";
import type { UpdateParams } from "BusyBar/api/system";

import {
  getDisplayBrightness as getDisplayBrightnessApi,
  setDisplayBrightness as setDisplayBrightnessApi,
  getAudioVolume as getAudioVolumeApi,
  setAudioVolume as setAudioVolumeApi,
  getHttpAccess as getHttpAccessApi,
  setHttpAccess as setHttpAccessApi,
} from "BusyBar/api/settings";
import type {
  BrightnessParams,
  AudioVolumeParams,
  HttpAccess,
} from "BusyBar/api/settings";

import {
  enable as enableBleApi,
  disable as disableBleApi,
} from "BusyBar/api/ble";

import { setInputKey as setInputKeyApi } from "BusyBar/api/input";
import type { InputKey } from "BusyBar/api/input";

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
  private apiSemver: ApiSemver;

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
   * Updates the firmware.
   *
   * @param {UpdateParams} params - Parameters for the firmware update.
   * @param {UpdateParams['name']} params.name - Name for the update package.
   * @param {UpdateParams['file']} params.file - File data to upload.
   * @returns Result of the update operation.
   */
  async updateFirmware(params: UpdateParams): Promise<{ result: string }> {
    return await updateApi(params);
  }

  /**
   * Gets the current status of the device, including system and power information.
   *
   * @returns Current status of the device.
   */
  async deviceStatus(): Promise<{
    system?: components["schemas"]["StatusSystem"];
    power?: components["schemas"]["StatusPower"];
  }> {
    return await statusApi();
  }

  /**
   * Gets the current system status.
   *
   * @returns Current system status.
   */
  async systemStatus(): Promise<components["schemas"]["StatusSystem"]> {
    return await systemStatusApi();
  }

  /**
   * Gets the current power status.
   *
   * @returns Current power status.
   */
  async powerStatus(): Promise<components["schemas"]["StatusPower"]> {
    return await powerStatusApi();
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

  /**
   * Gets the current display brightness settings for the device.
   *
   * @returns {Promise<components["schemas"]["DisplayBrightnessInfo"]>} Current brightness information for front and back panels.
   */
  async getDisplayBrightness(): Promise<
    components["schemas"]["DisplayBrightnessInfo"]
  > {
    return await getDisplayBrightnessApi();
  }

  /**
   * Sets the display brightness for the device.
   *
   * @param {BrightnessParams} params - Brightness parameters:
   *   @param {BrightnessParams['front']} [params.front] - Brightness for the front panel (0-100 or "auto").
   *   @param {BrightnessParams['back']} [params.back] - Brightness for the back panel (0-100 or "auto").
   * @returns {Promise<components["schemas"]["SuccessResponse"]>} Result of the brightness update operation.
   * @throws {Error} If brightness value is outside the range 0-100 or not "auto".
   */
  async setDisplayBrightness(
    params: BrightnessParams
  ): Promise<components["schemas"]["SuccessResponse"]> {
    return await setDisplayBrightnessApi(params);
  }

  /**
   * Gets the current audio volume value.
   *
   * @returns {Promise<components["schemas"]["AudioVolumeInfo"]>} Current audio volume (0-100).
   */
  async getAudioVolume(): Promise<components["schemas"]["AudioVolumeInfo"]> {
    return await getAudioVolumeApi();
  }

  /**
   * Sets the audio volume value.
   *
   * @param {AudioVolumeParams} params - Audio volume parameters:
   *   @param {AudioVolumeParams['volume']} params.volume - Audio volume (number from 0 to 100).
   * @returns {Promise<components["schemas"]["SuccessResponse"]>} Result of the volume update operation.
   * @throws {Error} If volume is outside the range 0-100 or request fails.
   */
  async setAudioVolume(
    params: AudioVolumeParams
  ): Promise<components["schemas"]["SuccessResponse"]> {
    return await setAudioVolumeApi(params);
  }

  /**
   * Gets the current HTTP API access configuration.
   *
   * @returns {Promise<components["schemas"]["HttpAccessInfo"]>} Current HTTP access info.
   */
  async getHttpAccess(): Promise<components["schemas"]["HttpAccessInfo"]> {
    return await getHttpAccessApi();
  }

  /**
   * Sets the HTTP API access configuration.
   *
   * @param {HttpAccess} params - Access parameters:
   *   @param {HttpAccess['mode']} params.mode - Access mode ("disabled", "enabled", "key").
   *   @param {HttpAccess['key']} params.key - Access key (4-10 digits).
   * @returns {Promise<components["schemas"]["SuccessResponse"]>} Result of the set operation.
   */
  async setHttpAccess(
    params: HttpAccess
  ): Promise<components["schemas"]["SuccessResponse"]> {
    const result = await setHttpAccessApi(params);

    if (params.mode === "key" && params.key) {
      this.setApiKey(params.key);
    }

    return result;
  }

  /**
   * Sets API key for all subsequent requests.
   * @param {string} key - API key to use in "X-API-Token" header.
   */
  setApiKey(key: string) {
    setApiKey(key);
  }

  /**
   * Enables BLE module.
   * @returns {Promise<components["schemas"]["SuccessResponse"]>} Result of the enable operation.
   */
  async enableBle(): Promise<components["schemas"]["SuccessResponse"]> {
    return await enableBleApi();
  }

  /**
   * Disables BLE module.
   * @returns {Promise<components["schemas"]["SuccessResponse"]>} Result of the disable operation.
   */
  async disableBle(): Promise<components["schemas"]["SuccessResponse"]> {
    return await disableBleApi();
  }

  /**
   * Sends a button press.
   *
   * @param params - Button press parameters:
   *   @param {InputKey['keyName']} params.keyName - Button key.
   *   @example
   *  {
   *    keyName: "ok"
   *  }
   * @returns {Promise<components["schemas"]["SuccessResponse"]>} Result of pressing the button.
   */
  async pressButton(
    params: InputKey
  ): Promise<components["schemas"]["SuccessResponse"]> {
    return await setInputKeyApi(params);
  }
}
