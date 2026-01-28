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
      this.SystemVersion.bind(this),
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
  async SystemVersion(params?: TimeoutOptions): Promise<VersionInfo> {
    const response = await versionApi(params);
    this.apiSemver = response.api_semver;

    return response;
  }

  /**
   * @deprecated Use `SystemVersion` instead. will be removed in the next release.
   */
  async getApiVersion(params?: TimeoutOptions): Promise<VersionInfo> {
    return this.SystemVersion(params);
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
  async SystemUpdate(params: UpdateParams): Promise<SuccessResponse> {
    return await updateApi(params);
  }

  /**
   * @deprecated Use `SystemUpdate` instead. will be removed in the next release.
   */
  async updateFirmware(params: UpdateParams): Promise<SuccessResponse> {
    return this.SystemUpdate(params);
  }

  /**
   * Gets the current status of the device, including system and power information.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<Status>} Current status of the device.
   */
  async SystemStatus(params?: TimeoutOptions): Promise<Status> {
    return await statusApi(params);
  }

  /**
   * @deprecated Use `SystemStatus` instead. will be removed in the next release.
   */
  async deviceStatus(params?: TimeoutOptions): Promise<Status> {
    return this.SystemStatus(params);
  }

  /**
   * Gets the current system status.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<StatusSystem>} Current system status.
   */
  async SystemInfo(params?: TimeoutOptions): Promise<StatusSystem> {
    return await systemStatusApi(params);
  }

  /**
   * @deprecated Use `SystemInfo` instead. will be removed in the next release.
   */
  async systemStatus(params?: TimeoutOptions): Promise<StatusSystem> {
    return this.SystemInfo(params);
  }

  /**
   * Gets the current power status.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<StatusPower>} Current power status.
   */
  async SystemStatusPower(params?: TimeoutOptions): Promise<StatusPower> {
    return await powerStatusApi(params);
  }

  /**
   * @deprecated Use `SystemStatusPower` instead. will be removed in the next release.
   */
  async powerStatus(params?: TimeoutOptions): Promise<StatusPower> {
    return this.SystemStatusPower(params);
  }

  /**
   * Gets current device timestamp with timezone.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<TimestampInfo>} Current device timestamp as an ISO 8601 string.
   */
  async SystemTime(params?: TimeoutOptions): Promise<TimestampInfo> {
    return await getTimeApi(params);
  }

  /**
   * @deprecated Use `SystemTime` instead. will be removed in the next release.
   */
  async getTime(params?: TimeoutOptions): Promise<TimestampInfo> {
    return this.SystemTime(params);
  }

  /**
   * Sets the current device timestamp.
   *
   * @param {SetTimestampParams} params - The parameters for setting the timestamp.
   *   @param {SetTimestampParams['timestamp']} params.timestamp - The new timestamp (ISO 8601 string).
   *   @param {SetTimestampParams['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} A success response if the timestamp was set.
   */
  async SystemTimeTimestamp(
    params: SetTimestampParams,
  ): Promise<SuccessResponse> {
    return await setTimestampApi(params);
  }

  /**
   * @deprecated Use `SystemTimeTimestamp` instead. will be removed in the next release.
   */
  async setTimestamp(params: SetTimestampParams): Promise<SuccessResponse> {
    return this.SystemTimeTimestamp(params);
  }

  /**
   * Sets the device timezone.
   *
   * @param {SetTimezoneParams} params - The parameters for setting the timezone.
   *   @param {SetTimezoneParams['timezone']} params.timezone - The new timezone identifier (IANA TZ string).
   *   @param {SetTimezoneParams['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} A success response if the timezone was set.
   */
  async SystemTimeTimezone(
    params: SetTimezoneParams,
  ): Promise<SuccessResponse> {
    return await setTimezoneApi(params);
  }

  /**
   * @deprecated Use `SystemTimeTimezone` instead. will be removed in the next release.
   */
  async setTimezone(params: SetTimezoneParams): Promise<SuccessResponse> {
    return this.SystemTimeTimezone(params);
  }

  /**
   * Gets the status of the MQTT account linked to the device.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<AccountInfo>} Information about the current MQTT account status.
   */
  async Account(params?: TimeoutOptions): Promise<AccountInfo> {
    return await getMqttStatusApi(params);
  }

  /**
   * @deprecated Use `Account` instead. will be removed in the next release.
   */
  async getMqttStatus(params?: TimeoutOptions): Promise<AccountInfo> {
    return this.Account(params);
  }

  /**
   * Unlinks the current account from the device.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} Result of the account unlink operation.
   */
  async AccountUnlink(params?: TimeoutOptions): Promise<SuccessResponse> {
    return await unlinkAccountApi(params);
  }

  /**
   * @deprecated Use `AccountUnlink` instead. will be removed in the next release.
   */
  async unlinkAccount(params?: TimeoutOptions): Promise<SuccessResponse> {
    return this.AccountUnlink(params);
  }

  /**
   * Links an account to the device.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<AccountLink>} Information about the account link operation.
   */
  async AccountLink(params?: TimeoutOptions): Promise<AccountLink> {
    return await linkAccountApi(params);
  }

  /**
   * @deprecated Use `AccountLink` instead. will be removed in the next release.
   */
  async linkAccount(params?: TimeoutOptions): Promise<AccountLink> {
    return this.AccountLink(params);
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
  async AssetsUpload(params: UploadParams): Promise<SuccessResponse> {
    // check file
    // convert file

    return await uploadAssetsApi(params);
  }

  /**
   * @deprecated Use `AssetsUpload` instead. will be removed in the next release.
   */
  async uploadAsset(params: UploadParams): Promise<SuccessResponse> {
    return this.AssetsUpload(params);
  }

  /**
   * Deletes all assets for a specific application from the device.
   *
   * @param {DeleteParams} params - Parameters for the delete.
   *   @param {DeleteParams['appId']} params.appId - Application ID whose assets should be deleted.
   *   @param {DeleteParams['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} Result of the delete operation.
   */
  async AssetsDelete(params: DeleteParams): Promise<SuccessResponse> {
    return await deleteAssetsApi(params);
  }

  /**
   * @deprecated Use `AssetsDelete` instead. will be removed in the next release.
   */
  async deleteAssets(params: DeleteParams): Promise<SuccessResponse> {
    return this.AssetsDelete(params);
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
  async DisplayDraw(params: DrawParams): Promise<SuccessResponse> {
    return await drawDisplayApi(params);
  }

  /**
   * @deprecated Use `DisplayDraw` instead. will be removed in the next release.
   */
  async drawDisplay(params: DrawParams): Promise<SuccessResponse> {
    return this.DisplayDraw(params);
  }

  /**
   * Clears the device display and stops the Canvas application if running.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} Result of the clear operation.
   */
  async DisplayClear(params?: TimeoutOptions): Promise<SuccessResponse> {
    return await clearDisplayApi(params);
  }

  /**
   * @deprecated Use `DisplayClear` instead. will be removed in the next release.
   */
  async clearDisplay(params?: TimeoutOptions): Promise<SuccessResponse> {
    return this.DisplayClear(params);
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
  async AudioPlay(params: AudioPlayParams): Promise<SuccessResponse> {
    return await playSoundApi(params);
  }

  /**
   * @deprecated Use `AudioPlay` instead. will be removed in the next release.
   */
  async playSound(params: AudioPlayParams): Promise<SuccessResponse> {
    return this.AudioPlay(params);
  }

  /**
   * Stops any currently playing audio on the device.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} Result of the stop operation.
   */
  async AudioStop(params?: TimeoutOptions): Promise<SuccessResponse> {
    return await stopSoundApi(params);
  }

  /**
   * @deprecated Use `AudioStop` instead. will be removed in the next release.
   */
  async stopSound(params?: TimeoutOptions): Promise<SuccessResponse> {
    return this.AudioStop(params);
  }

  /**
   * Gets the current status of the Wi-Fi module.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<WifiStatusResponse>} Current Wi-Fi status.
   */
  async WifiStatus(params?: TimeoutOptions): Promise<WifiStatusResponse> {
    return await statusWifiApi(params);
  }

  /**
   * @deprecated Use `WifiStatus` instead. will be removed in the next release.
   */
  async statusWifi(params?: TimeoutOptions): Promise<WifiStatusResponse> {
    return this.WifiStatus(params);
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
  async WifiConnect(params: ConnectParams): Promise<SuccessResponse> {
    return await connectWifiApi(params);
  }

  /**
   * @deprecated Use `WifiConnect` instead. will be removed in the next release.
   */
  async connectWifi(params: ConnectParams): Promise<SuccessResponse> {
    return this.WifiConnect(params);
  }

  /**
   * Disconnects the device from the current Wi-Fi network.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} Result of the disconnect operation.
   */
  async WifiDisconnect(params?: TimeoutOptions): Promise<SuccessResponse> {
    return await disconnectWifiApi(params);
  }

  /**
   * @deprecated Use `WifiDisconnect` instead. will be removed in the next release.
   */
  async disconnectWifi(params?: TimeoutOptions): Promise<SuccessResponse> {
    return this.WifiDisconnect(params);
  }

  /**
   * Scans for available Wi-Fi networks near your device.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<WifiNetworkResponse>} List of discovered networks.
   */
  async WifiNetworks(params?: TimeoutOptions): Promise<WifiNetworkResponse> {
    return await networksWifiAPi(params);
  }

  /**
   * @deprecated Use `WifiNetworks` instead. will be removed in the next release.
   */
  async networksWifi(params?: TimeoutOptions): Promise<WifiNetworkResponse> {
    return this.WifiNetworks(params);
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
  async StorageWrite(params: UploadFileParams): Promise<SuccessResponse> {
    return await writeStorageApi(params);
  }

  /**
   * @deprecated Use `StorageWrite` instead. will be removed in the next release.
   */
  async uploadFile(params: UploadFileParams): Promise<SuccessResponse> {
    return this.StorageWrite(params);
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
  async StorageRead(params: DownloadFileParams): Promise<StorageReadResponse> {
    return await readStorageApi(params);
  }

  /**
   * @deprecated Use `StorageRead` instead. will be removed in the next release.
   */
  async downloadFile(params: DownloadFileParams): Promise<StorageReadResponse> {
    return this.StorageRead(params);
  }

  /**
   * Reads the contents of a directory (files and subdirectories) at the specified path.
   *
   * @param {ReadDirectoryParams} params - List parameters:
   *   @param {ReadDirectoryParams['path']} params.path - Path to the directory to list (e.g., "/ext").
   *   @param {ReadDirectoryParams['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<StorageList>} List of files and directories.
   */
  async StorageList(params: ReadDirectoryParams): Promise<StorageList> {
    return await listStorageApi(params);
  }

  /**
   * @deprecated Use `StorageList` instead. will be removed in the next release.
   */
  async readDirectory(params: ReadDirectoryParams): Promise<StorageList> {
    return this.StorageList(params);
  }

  /**
   * Removes a file or a directory from the device's internal storage.
   *
   * @param {RemoveParams} params - Remove parameters:
   *   @param {RemoveParams['path']} params.path - Path of the file to remove (e.g., "/ext/test.png").
   *   @param {RemoveParams['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} Result of the remove operation.
   */
  async StorageRemove(params: RemoveParams): Promise<SuccessResponse> {
    return await removeStorageApi(params);
  }

  /**
   * @deprecated Use `StorageRemove` instead. will be removed in the next release.
   */
  async removeResource(params: RemoveParams): Promise<SuccessResponse> {
    return this.StorageRemove(params);
  }

  /**
   * Creates a new directory in the device's internal storage.
   *
   * @param {CreateDirectoryParams} params - Directory creation parameters:
   *   @param {CreateDirectoryParams['path']} params.path - Path to the new directory (e.g., "/ext/newdir").
   *   @param {CreateDirectoryParams['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} Result of the create operation.
   */
  async StorageMkdir(params: CreateDirectoryParams): Promise<SuccessResponse> {
    return await mkdirStorageApi(params);
  }

  /**
   * @deprecated Use `StorageMkdir` instead. will be removed in the next release.
   */
  async createDirectory(
    params: CreateDirectoryParams,
  ): Promise<SuccessResponse> {
    return this.StorageMkdir(params);
  }

  /**
   * Gets the current status of the device's internal storage.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<StorageStatus>} Current storage status information.
   */
  async StorageStatus(params?: TimeoutOptions): Promise<StorageStatus> {
    return await statusStorageApi(params);
  }

  /**
   * @deprecated Use `StorageStatus` instead. will be removed in the next release.
   */
  async statusStorage(params?: TimeoutOptions): Promise<StorageStatus> {
    return this.StorageStatus(params);
  }

  /**
   * Gets the current display brightness settings for the device.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<DisplayBrightnessInfo>} Current brightness information for front and back panels.
   */
  async DisplayBrightness(
    params?: TimeoutOptions,
  ): Promise<DisplayBrightnessInfo> {
    return await getDisplayBrightnessApi(params);
  }

  /**
   * @deprecated Use `DisplayBrightness` instead. will be removed in the next release.
   */
  async getDisplayBrightness(
    params?: TimeoutOptions,
  ): Promise<DisplayBrightnessInfo> {
    return this.DisplayBrightness(params);
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
  async DisplayBrightnessSet(
    params: BrightnessParams,
  ): Promise<SuccessResponse> {
    return await setDisplayBrightnessApi(params);
  }

  /**
   * @deprecated Use `DisplayBrightnessSet` instead. will be removed in the next release.
   */
  async setDisplayBrightness(
    params: BrightnessParams,
  ): Promise<SuccessResponse> {
    return this.DisplayBrightnessSet(params);
  }

  /**
   * Gets the current audio volume value.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<AudioVolumeInfo>} Current audio volume (0-100).
   */
  async AudioVolume(params?: TimeoutOptions): Promise<AudioVolumeInfo> {
    return await getAudioVolumeApi(params);
  }

  /**
   * @deprecated Use `AudioVolume` instead. will be removed in the next release.
   */
  async getAudioVolume(params?: TimeoutOptions): Promise<AudioVolumeInfo> {
    return this.AudioVolume(params);
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
  async AudioVolumeSet(params: AudioVolumeParams): Promise<SuccessResponse> {
    return await setAudioVolumeApi(params);
  }

  /**
   * @deprecated Use `AudioVolumeSet` instead. will be removed in the next release.
   */
  async setAudioVolume(params: AudioVolumeParams): Promise<SuccessResponse> {
    return this.AudioVolumeSet(params);
  }

  /**
   * Gets the current HTTP API access configuration.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<HttpAccessInfo>} Current HTTP access info.
   */
  async SettingsAccess(params?: TimeoutOptions): Promise<HttpAccessInfo> {
    return await getHttpAccessApi(params);
  }

  /**
   * @deprecated Use `SettingsAccess` instead. will be removed in the next release.
   */
  async getHttpAccess(params?: TimeoutOptions): Promise<HttpAccessInfo> {
    return this.SettingsAccess(params);
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
  async SettingsAccessSet(params: HttpAccessParams): Promise<SuccessResponse> {
    const result = await setHttpAccessApi(params);

    if (params.mode === "key" && params.key) {
      this.setApiKey(params.key);
    }

    return result;
  }

  /**
   * @deprecated Use `SettingsAccessSet` instead. will be removed in the next release.
   */
  async setHttpAccess(params: HttpAccessParams): Promise<SuccessResponse> {
    return this.SettingsAccessSet(params);
  }

  /**
   * Gets the current device name.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<NameInfo>} The current device name information.
   */
  async SettingsName(params?: TimeoutOptions): Promise<NameInfo> {
    return await getNameApi(params);
  }

  /**
   * @deprecated Use `SettingsName` instead. will be removed in the next release.
   */
  async getName(params?: TimeoutOptions): Promise<NameInfo> {
    return this.SettingsName(params);
  }

  /**
   * Sets the device name.
   *
   * @param {NameParams} params - The parameters for setting the device name.
   *   @param {NameParams['name']} params.name - The new device name.
   *   @param {NameParams['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} Result of setting the device name.
   */
  async SettingsNameSet(params: NameParams): Promise<SuccessResponse> {
    return await setNameApi(params);
  }

  /**
   * @deprecated Use `SettingsNameSet` instead. will be removed in the next release.
   */
  async setName(params: NameParams): Promise<SuccessResponse> {
    return this.SettingsNameSet(params);
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
  async BleEnable(params?: TimeoutOptions): Promise<SuccessResponse> {
    return await enableBleApi(params);
  }

  /**
   * @deprecated Use `BleEnable` instead. will be removed in the next release.
   */
  async enableBle(params?: TimeoutOptions): Promise<SuccessResponse> {
    return this.BleEnable(params);
  }

  /**
   * Disables BLE module.
   * @param {TimeoutOptions} [params] - Optional parameters.
   * @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} Result of the disable operation.
   */
  async BleDisable(params?: TimeoutOptions): Promise<SuccessResponse> {
    return await disableBleApi(params);
  }

  /**
   * @deprecated Use `BleDisable` instead. will be removed in the next release.
   */
  async disableBle(params?: TimeoutOptions): Promise<SuccessResponse> {
    return this.BleDisable(params);
  }

  /**
   * Removes all BLE pairings from the device.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} Result of the BLE pairing removal operation.
   */
  async BleUnpair(params?: TimeoutOptions): Promise<SuccessResponse> {
    return await pairingBleApi(params);
  }

  /**
   * @deprecated Use `BleUnpair` instead. will be removed in the next release.
   */
  async pairingBle(params?: TimeoutOptions): Promise<SuccessResponse> {
    return this.BleUnpair(params);
  }

  /**
   * Gets the current BLE module status.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<BleStatusResponse>} Current BLE status information.
   */
  async BleStatus(params?: TimeoutOptions): Promise<BleStatusResponse> {
    return await statusBleApi(params);
  }

  /**
   * @deprecated Use `BleStatus` instead. will be removed in the next release.
   */
  async statusBle(params?: TimeoutOptions): Promise<BleStatusResponse> {
    return this.BleStatus(params);
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
  async InputSend(params: InputKeyParams): Promise<SuccessResponse> {
    return await setInputKeyApi(params);
  }

  /**
   * @deprecated Use `InputSend` instead. will be removed in the next release.
   */
  async pressButton(params: InputKeyParams): Promise<SuccessResponse> {
    return this.InputSend(params);
  }
}
