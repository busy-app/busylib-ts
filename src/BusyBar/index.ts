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
  StorageStatus,
  TimeoutOptions,
} from "Global/types";

import {
  DEFAULT_DEVICE_URL,
  DEFAULT_PROXY_URL,
  PROXY_HOST_RE,
} from "Global/constants";

import { initApiClient, setApiKey } from "BusyBar/api/createClient";
import createClient from "openapi-fetch";
import type { paths } from "Global/API";
import { isIPv4 } from "Global/utils/isIPv4";
import { isMdns } from "Global/utils/isMdns";

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
  status as statusStorageApi,
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
      this.getApiVersion.bind(this),
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
   * Retrieves the API semantic version.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<VersionInfo>} A promise that resolves to an object containing the `api_semver` string.
   */
  async getApiVersion(params?: TimeoutOptions): Promise<VersionInfo> {
    const response = await versionApi(params);
    this.apiSemver = response.api_semver;

    return response;
  }

  /**
   * Updates the firmware.
   *
   * @param {UpdateParams} params - Parameters for the firmware update.
   *   @param {UpdateParams['name']} params.name - Name for the update package.
   *   @param {UpdateParams['file']} params.file - File data to upload.
   *   @param {UpdateParams['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} Result of the update operation.
   */
  async updateFirmware(params: UpdateParams): Promise<SuccessResponse> {
    return await updateApi(params);
  }

  /**
   * Gets the current status of the device, including system and power information.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<Status>} Current status of the device.
   */
  async deviceStatus(params?: TimeoutOptions): Promise<Status> {
    return await statusApi(params);
  }

  /**
   * Gets the current system status.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<StatusSystem>} Current system status.
   */
  async systemStatus(params?: TimeoutOptions): Promise<StatusSystem> {
    return await systemStatusApi(params);
  }

  /**
   * Gets the current power status.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<StatusPower>} Current power status.
   */
  async powerStatus(params?: TimeoutOptions): Promise<StatusPower> {
    return await powerStatusApi(params);
  }

  /**
   * Gets current device timestamp with timezone.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<TimestampInfo>} Current device timestamp as an ISO 8601 string.
   */
  async getTime(params?: TimeoutOptions): Promise<TimestampInfo> {
    return await getTimeApi(params);
  }

  /**
   * Sets the current device timestamp.
   *
   * @param {SetTimestampParams} params - The parameters for setting the timestamp.
   *   @param {SetTimestampParams['timestamp']} params.timestamp - The new timestamp (ISO 8601 string).
   *   @param {SetTimestampParams['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} A success response if the timestamp was set.
   */
  async setTimestamp(params: SetTimestampParams): Promise<SuccessResponse> {
    return await setTimestampApi(params);
  }

  /**
   * Sets the device timezone.
   *
   * @param {SetTimezoneParams} params - The parameters for setting the timezone.
   *   @param {SetTimezoneParams['timezone']} params.timezone - The new timezone identifier (IANA TZ string).
   *   @param {SetTimezoneParams['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} A success response if the timezone was set.
   */
  async setTimezone(params: SetTimezoneParams): Promise<SuccessResponse> {
    return await setTimezoneApi(params);
  }

  /**
   * Gets the status of the MQTT account linked to the device.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<AccountInfo>} Information about the current MQTT account status.
   */
  async getMqttStatus(params?: TimeoutOptions): Promise<AccountInfo> {
    return await getMqttStatusApi(params);
  }

  /**
   * Unlinks the current account from the device.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} Result of the account unlink operation.
   */
  async unlinkAccount(params?: TimeoutOptions): Promise<SuccessResponse> {
    return await unlinkAccountApi(params);
  }

  /**
   * Links an account to the device.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<AccountLink>} Information about the account link operation.
   */
  async linkAccount(params?: TimeoutOptions): Promise<AccountLink> {
    return await linkAccountApi(params);
  }

  /**
   * Uploads an asset to the device.
   *
   * @param {UploadParams} params - Parameters for the upload.
   *   @param {UploadParams['appId']} params.appId - Application ID for organizing assets.
   *   @param {UploadParams['fileName']} params.fileName - Filename for the uploaded asset.
   *   @param {UploadParams['file']} params.file - File data to upload.
   *   @param {UploadParams['timeout']} [params.timeout] - Request timeout in milliseconds.
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
   *   @param {DeleteParams['appId']} params.appId - Application ID whose assets should be deleted.
   *   @param {DeleteParams['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} Result of the delete operation.
   */
  async deleteAssets(params: DeleteParams): Promise<SuccessResponse> {
    return await deleteAssetsApi(params);
  }

  /**
   * Draws elements on the device display.
   *
   * @param {DrawParams} params - Parameters for the draw operation.
   *   @param {DrawParams['appId']} params.appId - Application ID for organizing display elements.
   *   @param {DrawParams['elements'][]} params.elements - Array of display elements (text or image).
   *   @param {DrawParams['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} Result of the draw operation.
   */
  async drawDisplay(params: DrawParams): Promise<SuccessResponse> {
    return await drawDisplayApi(params);
  }

  /**
   * Clears the device display and stops the Canvas application if running.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} Result of the clear operation.
   */
  async clearDisplay(params?: TimeoutOptions): Promise<SuccessResponse> {
    return await clearDisplayApi(params);
  }

  /**
   * Plays an audio file from the assets directory.
   *
   * @param {AudioPlayParams} params - Parameters for the audio playback.
   *   @param {AudioPlayParams['appId']} params.appId - Application ID for organizing assets.
   *   @param {AudioPlayParams['path']} params.path - Path to the audio file within the app's assets directory.
   *   @param {AudioPlayParams['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} Result of the play operation.
   */
  async playSound(params: AudioPlayParams): Promise<SuccessResponse> {
    return await playSoundApi(params);
  }

  /**
   * Stops any currently playing audio on the device.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} Result of the stop operation.
   */
  async stopSound(params?: TimeoutOptions): Promise<SuccessResponse> {
    return await stopSoundApi(params);
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
        "Works only with BusyLib v0.5.0 and device firmware v0.3.0.",
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
        "Works only with BusyLib v0.5.0 and device firmware v0.3.0.",
    );
  }

  /**
   * Gets the current status of the Wi-Fi module.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<WifiStatusResponse>} Current Wi-Fi status.
   */
  async statusWifi(params?: TimeoutOptions): Promise<WifiStatusResponse> {
    return await statusWifiApi(params);
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
   *   @param {ConnectParams['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} Result of the connect operation.
   */
  async connectWifi(params: ConnectParams): Promise<SuccessResponse> {
    return await connectWifiApi(params);
  }

  /**
   * Disconnects the device from the current Wi-Fi network.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} Result of the disconnect operation.
   */
  async disconnectWifi(params?: TimeoutOptions): Promise<SuccessResponse> {
    return await disconnectWifiApi(params);
  }

  /**
   * Scans for available Wi-Fi networks near your device.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<WifiNetworkResponse>} List of discovered networks.
   */
  async networksWifi(params?: TimeoutOptions): Promise<WifiNetworkResponse> {
    return await networksWifiAPi(params);
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
        "Works only with BusyLib v0.5.0 and device firmware v0.3.0.",
    );
  }

  /**
   * Uploads a file to the device's internal storage.
   *
   * @param {UploadFileParams} params - Upload parameters:
   *   @param {UploadFileParams['path']} params.path - Path where the file will be saved (e.g., "/ext/test.png").
   *   @param {UploadFileParams['file']} params.file - File data to upload.
   *   @param {UploadFileParams['timeout']} [params.timeout] - Request timeout in milliseconds.
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
   *   @param {DownloadFileParams['timeout']} [params.timeout] - Request timeout in milliseconds.
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
   *   @param {ReadDirectoryParams['timeout']} [params.timeout] - Request timeout in milliseconds.
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
   *   @param {RemoveParams['timeout']} [params.timeout] - Request timeout in milliseconds.
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
   *   @param {CreateDirectoryParams['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} Result of the create operation.
   */
  async createDirectory(
    params: CreateDirectoryParams,
  ): Promise<SuccessResponse> {
    return await mkdirStorageApi(params);
  }

  /**
   * Gets the current status of the device's internal storage.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<StorageStatus>} Current storage status information.
   */
  async statusStorage(params?: TimeoutOptions): Promise<StorageStatus> {
    return await statusStorageApi(params);
  }

  /**
   * Gets the current display brightness settings for the device.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<DisplayBrightnessInfo>} Current brightness information for front and back panels.
   */
  async getDisplayBrightness(
    params?: TimeoutOptions,
  ): Promise<DisplayBrightnessInfo> {
    return await getDisplayBrightnessApi(params);
  }

  /**
   * Sets the display brightness for the device.
   *
   * @param {BrightnessParams} params - Brightness parameters:
   *   @param {BrightnessParams['front']} [params.front] - Brightness for the front panel (0-100 or "auto").
   *   @param {BrightnessParams['back']} [params.back] - Brightness for the back panel (0-100 or "auto").
   *   @param {BrightnessParams['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} Result of the brightness update operation.
   * @throws {Error} If brightness value is outside the range 0-100 or not "auto".
   */
  async setDisplayBrightness(
    params: BrightnessParams,
  ): Promise<SuccessResponse> {
    return await setDisplayBrightnessApi(params);
  }

  /**
   * Gets the current audio volume value.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<AudioVolumeInfo>} Current audio volume (0-100).
   */
  async getAudioVolume(params?: TimeoutOptions): Promise<AudioVolumeInfo> {
    return await getAudioVolumeApi(params);
  }

  /**
   * Sets the audio volume value.
   *
   * @param {AudioVolumeParams} params - Audio volume parameters:
   *   @param {AudioVolumeParams['volume']} params.volume - Audio volume (number from 0 to 100).
   *   @param {AudioVolumeParams['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} Result of the volume update operation.
   * @throws {Error} If volume is outside the range 0-100 or request fails.
   */
  async setAudioVolume(params: AudioVolumeParams): Promise<SuccessResponse> {
    return await setAudioVolumeApi(params);
  }

  /**
   * Gets the current HTTP API access configuration.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<HttpAccessInfo>} Current HTTP access info.
   */
  async getHttpAccess(params?: TimeoutOptions): Promise<HttpAccessInfo> {
    return await getHttpAccessApi(params);
  }

  /**
   * Sets the HTTP API access configuration.
   *
   * @param {HttpAccessParams} params - Access parameters:
   *   @param {HttpAccessParams['mode']} params.mode - Access mode ("disabled", "enabled", "key").
   *   @param {HttpAccessParams['key']} params.key - Access key (4-10 digits).
   *   @param {HttpAccessParams['timeout']} [params.timeout] - Request timeout in milliseconds.
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
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<NameInfo>} The current device name information.
   */
  async getName(params?: TimeoutOptions): Promise<NameInfo> {
    return await getNameApi(params);
  }

  /**
   * Sets the device name.
   *
   * @param {NameParams} params - The parameters for setting the device name.
   *   @param {NameParams['name']} params.name - The new device name.
   *   @param {NameParams['timeout']} [params.timeout] - Request timeout in milliseconds.
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
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} Result of the enable operation.
   */
  async enableBle(params?: TimeoutOptions): Promise<SuccessResponse> {
    return await enableBleApi(params);
  }

  /**
   * Disables BLE module.
   * @param {TimeoutOptions} [params] - Optional parameters.
   * @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} Result of the disable operation.
   */
  async disableBle(params?: TimeoutOptions): Promise<SuccessResponse> {
    return await disableBleApi(params);
  }

  /**
   * Removes all BLE pairings from the device.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} Result of the BLE pairing removal operation.
   */
  async pairingBle(params?: TimeoutOptions): Promise<SuccessResponse> {
    return await pairingBleApi(params);
  }

  /**
   * Gets the current BLE module status.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<BleStatusResponse>} Current BLE status information.
   */
  async statusBle(params?: TimeoutOptions): Promise<BleStatusResponse> {
    return await statusBleApi(params);
  }

  /**
   * Sends a button press.
   *
   * @param params - Button press parameters:
   *   @param {InputKeyParams['keyName']} params.keyName - Button key.
   *   @param {InputKeyParams['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @example
   *  {
   *    keyName: "ok",
   *    timeout: 1000
   *  }
   * @returns {Promise<SuccessResponse>} Result of pressing the button.
   */
  async pressButton(params: InputKeyParams): Promise<SuccessResponse> {
    return await setInputKeyApi(params);
  }
}
