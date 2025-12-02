import type {
  ApiSemver,
  SuccessResponse,
  VersionInfo,
  Status,
  StatusSystem,
  StatusPower,
  TimestampInfo,
  WifiNetworkResponse,
  StorageList,
  StorageReadResponse,
  DisplayBrightnessInfo,
  AudioVolumeInfo,
  HttpAccessInfo,
  NameInfo,
  WifiStatusResponse,
  BleStatusResponse,
  AccountInfo,
  AccountLink,
} from "Global/types";

import { initApiClient, setApiKey } from "BusyBar/api/createClient";

import {
  getMqttStatus as getMqttStatusApi,
  unlinkDevice as unlinkAccountApi,
  linkDevice as linkAccountApi,
} from "BusyBar/api/account";

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
import type { AudioPlayParams } from "BusyBar/api/audio";

import {
  status as statusWifiApi,
  connect as connectWifiApi,
  disconnect as disconnectWifiApi,
  networks as networksWifiAPi,
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
  getTime as getTimeApi,
  setTimestamp as setTimestampApi,
  setTimezone as setTimezoneApi,
} from "BusyBar/api/system";
import type {
  UpdateParams,
  SetTimestampParams,
  SetTimezoneParams,
} from "BusyBar/api/system";

import {
  getDisplayBrightness as getDisplayBrightnessApi,
  setDisplayBrightness as setDisplayBrightnessApi,
  getAudioVolume as getAudioVolumeApi,
  setAudioVolume as setAudioVolumeApi,
  getHttpAccess as getHttpAccessApi,
  setHttpAccess as setHttpAccessApi,
  setName as setNameApi,
  getName as getNameApi,
} from "BusyBar/api/settings";
import type {
  BrightnessParams,
  AudioVolumeParams,
  HttpAccessParams,
  NameParams,
} from "BusyBar/api/settings";

import {
  enable as enableBleApi,
  disable as disableBleApi,
  pairing as pairingBleApi,
  status as statusBleApi,
} from "BusyBar/api/ble";

import { setInputKey as setInputKeyApi } from "BusyBar/api/input";
import type { InputKeyParams } from "BusyBar/api/input";

export type BusyBarConfig = {
  addr?: string;
  token?: string;
};

const DEFAULT_DEVICE_URL = "http://10.0.4.20";
const DEFAULT_PROXY_URL = "https://proxy.busy.app";
const PROXY_HOST_RE = /^https?:\/\/proxy(?:\.(?:dev|test|stage))?\.busy\.app$/i;

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
  public readonly addr: BusyBarConfig["addr"];
  /**
   * Current API semantic version.
   * @type {ApiSemver}
   */
  apiSemver: ApiSemver;

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
      this.getApiVersion.bind(this),
      config?.token
    );
  }

  /**
   * Retrieves the API semantic version.
   *
   * @returns {Promise<VersionInfo>} A promise that resolves to an object containing the `api_semver` string.
   */
  async getApiVersion(): Promise<VersionInfo> {
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
   * @returns {Promise<SuccessResponse>} Result of the update operation.
   */
  async updateFirmware(params: UpdateParams): Promise<SuccessResponse> {
    return await updateApi(params);
  }

  /**
   * Gets the current status of the device, including system and power information.
   *
   * @returns {Promise<Status>} Current status of the device.
   */
  async deviceStatus(): Promise<Status> {
    return await statusApi();
  }

  /**
   * Gets the current system status.
   *
   * @returns {Promise<StatusSystem>} Current system status.
   */
  async systemStatus(): Promise<StatusSystem> {
    return await systemStatusApi();
  }

  /**
   * Gets the current power status.
   *
   * @returns {Promise<StatusPower>} Current power status.
   */
  async powerStatus(): Promise<StatusPower> {
    return await powerStatusApi();
  }

  /**
   * Gets current device timestamp with timezone.
   *
   * @returns {Promise<TimestampInfo>} Current device timestamp as an ISO 8601 string.
   */
  async getTime(): Promise<TimestampInfo> {
    return await getTimeApi();
  }

  /**
   * Sets the current device timestamp.
   *
   * @param {SetTimestampParams} params - The parameters for setting the timestamp.
   * @param {SetTimestampParams['timestamp']} params.timestamp - The new timestamp (ISO 8601 string).
   * @returns {Promise<SuccessResponse>} A success response if the timestamp was set.
   */
  async setTimestamp(params: SetTimestampParams): Promise<SuccessResponse> {
    return await setTimestampApi(params);
  }

  /**
   * Sets the device timezone.
   *
   * @param {SetTimezoneParams} params - The parameters for setting the timezone.
   * @param {SetTimezoneParams['timezone']} params.timezone - The new timezone identifier (IANA TZ string).
   * @returns {Promise<SuccessResponse>} A success response if the timezone was set.
   */
  async setTimezone(params: SetTimezoneParams): Promise<SuccessResponse> {
    return await setTimezoneApi(params);
  }

  /**
   * Gets the status of the MQTT account linked to the device.
   *
   * @returns {Promise<AccountInfo>} Information about the current MQTT account status.
   */
  async getMqttStatus(): Promise<AccountInfo> {
    return await getMqttStatusApi();
  }

  /**
   * Unlinks the current account from the device.
   *
   * @returns {Promise<SuccessResponse>} Result of the account unlink operation.
   */
  async unlinkAccount(): Promise<SuccessResponse> {
    return await unlinkAccountApi();
  }

  /**
   * Links an account to the device.
   *
   * @returns {Promise<AccountLink>} Information about the account link operation.
   */
  async linkAccount(): Promise<AccountLink> {
    return await linkAccountApi();
  }

  /**
   * Uploads an asset to the device.
   *
   * @param {UploadParams} params - Parameters for the upload.
   * @param {UploadParams['appId']} params.appId - Application ID for organizing assets.
   * @param {UploadParams['fileName']} params.fileName - Filename for the uploaded asset.
   * @param {UploadParams['file']} params.file - File data to upload.
   * @returns {Promise<SuccessResponse>} Result of the upload operation.
   */
  async uploadAsset(params: UploadParams): Promise<SuccessResponse> {
    // check file
    // convert file

    return await uploadAssetsApi(params);
  }

  /**
   * Deletes all assets for a specific application from the device.
   *
   * @param {DeleteParams} params - Parameters for the delete.
   * @param {DeleteParams['appId']} params.appId - Application ID whose assets should be deleted.
   * @returns {Promise<SuccessResponse>} Result of the delete operation.
   */
  async deleteAssets(params: DeleteParams): Promise<SuccessResponse> {
    return await deleteAssetsApi(params);
  }

  /**
   * Draws elements on the device display.
   *
   * @param {DrawParams} params - Parameters for the draw operation.
   * @param {DrawParams['appId']} params.appId - Application ID for organizing display elements.
   * @param {DrawParams['elements'][]} params.elements - Array of display elements (text or image).
   * @returns {Promise<SuccessResponse>} Result of the draw operation.
   */
  async drawDisplay(params: DrawParams): Promise<SuccessResponse> {
    return await drawDisplayApi(params);
  }

  /**
   * Clears the device display and stops the Canvas application if running.
   *
   * @returns {Promise<SuccessResponse>} Result of the clear operation.
   */
  async clearDisplay(): Promise<SuccessResponse> {
    return await clearDisplayApi();
  }

  /**
   * Plays an audio file from the assets directory.
   *
   * @param {AudioPlayParams} params - Parameters for the audio playback.
   * @param {AudioPlayParams['appId']} params.appId - Application ID for organizing assets.
   * @param {AudioPlayParams['path']} params.path - Path to the audio file within the app's assets directory.
   * @returns {Promise<SuccessResponse>} Result of the play operation.
   */
  async playSound(params: AudioPlayParams): Promise<SuccessResponse> {
    return await playSoundApi(params);
  }

  /**
   * Stops any currently playing audio on the device.
   *
   * @returns {Promise<SuccessResponse>} Result of the stop operation.
   */
  async stopSound(): Promise<SuccessResponse> {
    return await stopSoundApi();
  }

  /**
   * @deprecated since 0.5.0 — will be removed in 0.7.0.
   *
   * This method is no longer supported and does nothing.
   *
   * Works only with BusyLib v0.5.0 and device firmware v0.3.0.
   *
   * Always throws an error.
   */
  async enableWifi(): Promise<SuccessResponse> {
    throw new Error(
      "[DEPRECATED] BusyBar.enableWifi: This method is deprecated since v0.5.0 and will be removed in v0.7.0. " +
        "It is no longer supported and does nothing. " +
        "Works only with BusyLib v0.5.0 and device firmware v0.3.0."
    );
  }

  /**
   * @deprecated since 0.5.0 — will be removed in 0.7.0.
   *
   * This method is no longer supported and does nothing.
   *
   * Works only with BusyLib v0.5.0 and device firmware v0.3.0.
   *
   * Always throws an error.
   */
  async disableWifi(): Promise<SuccessResponse> {
    throw new Error(
      "[DEPRECATED] BusyBar.disableWifi: This method is deprecated since v0.5.0 and will be removed in v0.7.0. " +
        "It is no longer supported and does nothing. " +
        "Works only with BusyLib v0.5.0 and device firmware v0.3.0."
    );
  }

  /**
   * Gets the current status of the Wi-Fi module.
   *
   * @returns {Promise<WifiStatusResponse>} Current Wi-Fi status.
   */
  async statusWifi(): Promise<WifiStatusResponse> {
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
   * @returns {Promise<SuccessResponse>} Result of the connect operation.
   */
  async connectWifi(params: ConnectParams): Promise<SuccessResponse> {
    return await connectWifiApi(params);
  }

  /**
   * Disconnects the device from the current Wi-Fi network.
   *
   * @returns {Promise<SuccessResponse>} Result of the disconnect operation.
   */
  async disconnectWifi(): Promise<SuccessResponse> {
    return await disconnectWifiApi();
  }

  /**
   * Scans for available Wi-Fi networks near your device.
   *
   * @returns {Promise<WifiNetworkResponse>} List of discovered networks.
   */
  async networksWifi(): Promise<WifiNetworkResponse> {
    return await networksWifiAPi();
  }

  /**
   * @deprecated since 0.5.0 — will be removed in 0.7.0.
   *
   * This method is no longer supported and does nothing.
   *
   * Works only with BusyLib v0.5.0 and device firmware v0.3.0.
   *
   * Always throws an error.
   */
  async forgetWifi(): Promise<never> {
    throw new Error(
      "[DEPRECATED] BusyBar.forgetWifi: This method is deprecated since v0.5.0 and will be removed in v0.7.0. " +
        "It is no longer supported and does nothing. " +
        "Works only with BusyLib v0.5.0 and device firmware v0.3.0."
    );
  }

  /**
   * Uploads a file to the device's internal storage.
   *
   * @param {UploadFileParams} params - Upload parameters:
   *   @param {UploadFileParams['path']} params.path - Path where the file will be saved (e.g., "/ext/test.png").
   *   @param {UploadFileParams['file']} params.file - File data to upload.
   * @returns {Promise<SuccessResponse>} Result of the upload operation.
   */
  async uploadFile(params: UploadFileParams): Promise<SuccessResponse> {
    return await writeStorageApi(params);
  }

  /**
   * Downloads a file from the device's internal storage.
   *
   * @param {DownloadFileParams} params - Download parameters:
   *   @param {DownloadFileParams['path']} params.path - Path to the file to download (e.g., "/ext/test.png").
   *   @param {DownloadFileParams['asArrayBuffer']} [params.asArrayBuffer] - If true, returns data as ArrayBuffer; otherwise, as Blob.
   * @returns {Promise<StorageReadResponse>} The file data.
   */
  async downloadFile(params: DownloadFileParams): Promise<StorageReadResponse> {
    return await readStorageApi(params);
  }

  /**
   * Reads the contents of a directory (files and subdirectories) at the specified path.
   *
   * @param {ReadDirectoryParams} params - List parameters:
   *   @param {ReadDirectoryParams['path']} params.path - Path to the directory to list (e.g., "/ext").
   * @returns {Promise<StorageList>} List of files and directories.
   */
  async readDirectory(params: ReadDirectoryParams): Promise<StorageList> {
    return await listStorageApi(params);
  }

  /**
   * Removes a file or a directory from the device's internal storage.
   *
   * @param {RemoveParams} params - Remove parameters:
   *   @param {RemoveParams['path']} params.path - Path of the file to remove (e.g., "/ext/test.png").
   * @returns {Promise<SuccessResponse>} Result of the remove operation.
   */
  async removeResource(params: RemoveParams): Promise<SuccessResponse> {
    return await removeStorageApi(params);
  }

  /**
   * Creates a new directory in the device's internal storage.
   *
   * @param {CreateDirectoryParams} params - Directory creation parameters:
   *   @param {CreateDirectoryParams['path']} params.path - Path to the new directory (e.g., "/ext/newdir").
   * @returns {Promise<SuccessResponse>} Result of the create operation.
   */
  async createDirectory(
    params: CreateDirectoryParams
  ): Promise<SuccessResponse> {
    return await mkdirStorageApi(params);
  }

  /**
   * Gets the current display brightness settings for the device.
   *
   * @returns {Promise<DisplayBrightnessInfo>} Current brightness information for front and back panels.
   */
  async getDisplayBrightness(): Promise<DisplayBrightnessInfo> {
    return await getDisplayBrightnessApi();
  }

  /**
   * Sets the display brightness for the device.
   *
   * @param {BrightnessParams} params - Brightness parameters:
   *   @param {BrightnessParams['front']} [params.front] - Brightness for the front panel (0-100 or "auto").
   *   @param {BrightnessParams['back']} [params.back] - Brightness for the back panel (0-100 or "auto").
   * @returns {Promise<SuccessResponse>} Result of the brightness update operation.
   * @throws {Error} If brightness value is outside the range 0-100 or not "auto".
   */
  async setDisplayBrightness(
    params: BrightnessParams
  ): Promise<SuccessResponse> {
    return await setDisplayBrightnessApi(params);
  }

  /**
   * Gets the current audio volume value.
   *
   * @returns {Promise<AudioVolumeInfo>} Current audio volume (0-100).
   */
  async getAudioVolume(): Promise<AudioVolumeInfo> {
    return await getAudioVolumeApi();
  }

  /**
   * Sets the audio volume value.
   *
   * @param {AudioVolumeParams} params - Audio volume parameters:
   *   @param {AudioVolumeParams['volume']} params.volume - Audio volume (number from 0 to 100).
   * @returns {Promise<SuccessResponse>} Result of the volume update operation.
   * @throws {Error} If volume is outside the range 0-100 or request fails.
   */
  async setAudioVolume(params: AudioVolumeParams): Promise<SuccessResponse> {
    return await setAudioVolumeApi(params);
  }

  /**
   * Gets the current HTTP API access configuration.
   *
   * @returns {Promise<HttpAccessInfo>} Current HTTP access info.
   */
  async getHttpAccess(): Promise<HttpAccessInfo> {
    return await getHttpAccessApi();
  }

  /**
   * Sets the HTTP API access configuration.
   *
   * @param {HttpAccessParams} params - Access parameters:
   *   @param {HttpAccessParams['mode']} params.mode - Access mode ("disabled", "enabled", "key").
   *   @param {HttpAccessParams['key']} params.key - Access key (4-10 digits).
   * @returns {Promise<SuccessResponse>} Result of the set operation.
   */
  async setHttpAccess(params: HttpAccessParams): Promise<SuccessResponse> {
    const result = await setHttpAccessApi(params);

    if (params.mode === "key" && params.key) {
      this.setApiKey(params.key);
    }

    return result;
  }

  /**
   * Gets the current device name.
   *
   * @returns {Promise<NameInfo>} The current device name information.
   */
  async getName(): Promise<NameInfo> {
    return await getNameApi();
  }

  /**
   * Sets the device name.
   *
   * @param {NameParams} params - The parameters for setting the device name.
   * @param {NameParams['name']} params.name - The new device name.
   * @returns {Promise<SuccessResponse>} Result of setting the device name.
   */
  async setName(params: NameParams): Promise<SuccessResponse> {
    return await setNameApi(params);
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
   * @returns {Promise<SuccessResponse>} Result of the enable operation.
   */
  async enableBle(): Promise<SuccessResponse> {
    return await enableBleApi();
  }

  /**
   * Disables BLE module.
   * @returns {Promise<SuccessResponse>} Result of the disable operation.
   */
  async disableBle(): Promise<SuccessResponse> {
    return await disableBleApi();
  }

  /**
   * Removes all BLE pairings from the device.
   *
   * @returns {Promise<SuccessResponse>} Result of the BLE pairing removal operation.
   */
  async pairingBle(): Promise<SuccessResponse> {
    return await pairingBleApi();
  }

  /**
   * Gets the current BLE module status.
   *
   * @returns {Promise<BleStatusResponse>} Current BLE status information.
   */
  async statusBle(): Promise<BleStatusResponse> {
    return await statusBleApi();
  }

  /**
   * Sends a button press.
   *
   * @param params - Button press parameters:
   *   @param {InputKeyParams['keyName']} params.keyName - Button key.
   *   @example
   *  {
   *    keyName: "ok"
   *  }
   * @returns {Promise<SuccessResponse>} Result of pressing the button.
   */
  async pressButton(params: InputKeyParams): Promise<SuccessResponse> {
    return await setInputKeyApi(params);
  }
}
