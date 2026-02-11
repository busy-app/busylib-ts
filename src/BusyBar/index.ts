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
  getAccountState as getAccountStateApi,
  getAccountInfo as getAccountInfoApi,
  getAccountProfile as getAccountProfileApi,
  setAccountProfile as setAccountProfileApi,
  unlinkDevice as unlinkAccountApi,
  linkDevice as linkAccountApi,
} from "BusyBar/api/account";
import type { SetAccountProfileParams } from "BusyBar/api/account";

import {
  upload as uploadAssetsApi,
  deleteAssets as deleteAssetsApi,
} from "BusyBar/api/assets";
import type { UploadParams, DeleteParams } from "BusyBar/api/assets";

import {
  draw as drawDisplayApi,
  clear as clearDisplayApi,
  getScreenFrame as getScreenFrameApi,
} from "BusyBar/api/display";
import type { DrawParams, GetScreenFrameParams } from "BusyBar/api/display";

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
  status as statusApi,
  systemStatus as systemStatusApi,
  powerStatus as powerStatusApi,
} from "BusyBar/api/system";

import {
  update as updateApi,
  check as checkUpdateApi,
  status as statusUpdateApi,
  changelog as changelogUpdateApi,
  install as installUpdateApi,
  abort as abortUpdateApi,
} from "BusyBar/api/update";
import type {
  UpdateParams,
  InstallParams,
  ChangelogParams,
} from "BusyBar/api/update";

import {
  getTime as getTimeApi,
  setTimestamp as setTimestampApi,
  getTimezone as getTimezoneApi,
  setTimezone as setTimezoneApi,
  getTzList as getTzListApi,
} from "BusyBar/api/time";
import type { SetTimestampParams, SetTimezoneParams } from "BusyBar/api/time";

import {
  status as statusMatterApi,
  pairDevice as pairDeviceMatterApi,
  eraseDevices as eraseDevicesMatterApi,
} from "BusyBar/api/matter";

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
   * Get API version information.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<VersionInfo>} A promise that resolves to an object containing the `api_semver` string.
   */
  async SystemVersionGet(params?: TimeoutOptions): Promise<VersionInfo> {
    const response = await versionApi(params);
    this.apiSemver = response.api_semver;

    return response;
  }

  /**
   * @deprecated Use `SystemVersionGet` instead. will be removed in the next release.
   */
  async SystemVersion(params?: TimeoutOptions): Promise<VersionInfo> {
    return this.SystemVersionGet(params);
  }

  /**
   * Update firmware. Uploads a firmware update package (TAR file) and initiates the update process.
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
   * Start firmware update check.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<Awaited<ReturnType<typeof checkUpdateApi>>>} Result of the check operation.
   */
  async SystemUpdateCheckGet(
    params?: TimeoutOptions,
  ): Promise<Awaited<ReturnType<typeof checkUpdateApi>>> {
    return await checkUpdateApi(params);
  }

  /**
   * Get firmware update status.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<Awaited<ReturnType<typeof statusUpdateApi>>>} Current update status.
   */
  async SystemUpdateStatusGet(
    params?: TimeoutOptions,
  ): Promise<Awaited<ReturnType<typeof statusUpdateApi>>> {
    return await statusUpdateApi(params);
  }

  /**
   * Get update changelog.
   *
   * @param {ChangelogParams} params - Parameters for the changelog request.
   *   @param {ChangelogParams['version']} params.version - The version to get changelog for.
   *   @param {ChangelogParams['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<Awaited<ReturnType<typeof changelogUpdateApi>>>} The changelog data.
   */
  async SystemUpdateChangelogGet(
    params: ChangelogParams,
  ): Promise<Awaited<ReturnType<typeof changelogUpdateApi>>> {
    return await changelogUpdateApi(params);
  }

  /**
   * Install firmware update.
   *
   * @param {InstallParams} params - Parameters for the installation.
   *   @param {InstallParams['version']} params.version - The version to install.
   *   @param {InstallParams['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} Result of the install operation.
   */
  async SystemUpdateInstall(params: InstallParams): Promise<SuccessResponse> {
    return await installUpdateApi(params);
  }

  /**
   * Abort ongoing firmware download.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} Result of the abort operation.
   */
  async SystemUpdateAbort(params?: TimeoutOptions): Promise<SuccessResponse> {
    return await abortUpdateApi(params);
  }

  /**
   * Get device status.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<Status>} Current status of the device.
   */
  async SystemStatusGet(params?: TimeoutOptions): Promise<Status> {
    return await statusApi(params);
  }

  /**
   * @deprecated Use `SystemStatusGet` instead. will be removed in the next release.
   */
  async SystemStatus(params?: TimeoutOptions): Promise<Status> {
    return this.SystemStatusGet(params);
  }

  /**
   * Get system status.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<StatusSystem>} Current system status.
   */
  async SystemInfoGet(params?: TimeoutOptions): Promise<StatusSystem> {
    return await systemStatusApi(params);
  }

  /**
   * @deprecated Use `SystemInfoGet` instead. will be removed in the next release.
   */
  async SystemInfo(params?: TimeoutOptions): Promise<StatusSystem> {
    return this.SystemInfoGet(params);
  }

  /**
   * Get power status.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<StatusPower>} Current power status.
   */
  async SystemStatusPowerGet(params?: TimeoutOptions): Promise<StatusPower> {
    return await powerStatusApi(params);
  }

  /**
   * @deprecated Use `SystemStatusPowerGet` instead. will be removed in the next release.
   */
  async SystemStatusPower(params?: TimeoutOptions): Promise<StatusPower> {
    return this.SystemStatusPowerGet(params);
  }

  /**
   * Get current timestamp with timezone. Retrieves the current timestamp from RTC with timezone in ISO 8601 format.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<TimestampInfo>} Current device timestamp as an ISO 8601 string.
   */
  async TimeGet(params?: TimeoutOptions): Promise<TimestampInfo> {
    return await getTimeApi(params);
  }

  /**
   * @deprecated Use `TimeGet` instead. will be removed in the next release.
   */
  async SystemTime(params?: TimeoutOptions): Promise<TimestampInfo> {
    return this.TimeGet(params);
  }

  /**
   * Set current timestamp. Sets the RTC timestamp in ISO 8601 format.
   *   * - Without 'Z': treated as local time
   *   * - With 'Z': treated as UTC and converted to local time using current timezone offset
   *
   * @param {SetTimestampParams} params - The parameters for setting the timestamp.
   *   @param {SetTimestampParams['timestamp']} params.timestamp - The new timestamp (ISO 8601 string).
   *   @param {SetTimestampParams['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} A success response if the timestamp was set.
   */
  async TimeTimestampSet(params: SetTimestampParams): Promise<SuccessResponse> {
    return await setTimestampApi(params);
  }

  /**
   * @deprecated Use `TimeTimestampSet` instead. will be removed in the next release.
   */
  async SystemTimeTimestamp(
    params: SetTimestampParams,
  ): Promise<SuccessResponse> {
    return this.TimeTimestampSet(params);
  }

  /**
   * Set timezone offset. Sets the timezone offset in ±HH:MM format.
   *
   * @param {SetTimezoneParams} params - The parameters for setting the timezone.
   *   @param {SetTimezoneParams['timezone']} params.timezone - The new timezone identifier (IANA TZ string).
   *   @param {SetTimezoneParams['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} A success response if the timezone was set.
   */
  async TimeTimezoneSet(params: SetTimezoneParams): Promise<SuccessResponse> {
    return await setTimezoneApi(params);
  }

  /**
   * @deprecated Use `TimeTimezoneSet` instead. will be removed in the next release.
   */
  async SystemTimeTimezone(
    params: SetTimezoneParams,
  ): Promise<SuccessResponse> {
    return this.TimeTimezoneSet(params);
  }

  /**
   * Get timezone. Get current timezone name.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} A promise that resolves to an object containing the `timezone` string.
   */
  async SystemTimeTimezoneGet(
    params?: TimeoutOptions,
  ): Promise<Awaited<ReturnType<typeof getTimezoneApi>>> {
    return await getTimezoneApi(params);
  }

  /**
   * Get list of supported time zones.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} List of timezones.
   */
  async TimeTzListGet(
    params?: TimeoutOptions,
  ): Promise<Awaited<ReturnType<typeof getTzListApi>>> {
    return await getTzListApi(params);
  }

  /**
   * Get MQTT status info.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<AccountInfo>} Information about the current MQTT account status.
   */
  async AccountInfoGet(params?: TimeoutOptions): Promise<AccountInfo> {
    return await getAccountInfoApi(params);
  }

  /**
   * @deprecated Use `AccountInfoGet` instead. will be removed in the next release.
   */
  async Account(params?: TimeoutOptions): Promise<AccountInfo> {
    return this.AccountInfoGet(params);
  }

  /**
   * Unlink device from account. Removes account linking data.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} Result of the account unlink operation.
   */
  async AccountUnlink(params?: TimeoutOptions): Promise<SuccessResponse> {
    return await unlinkAccountApi(params);
  }

  /**
   * Link device to account. Requests account link PIN. Works only if device is connected to MQTT and is not linked to account.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<AccountLink>} Information about the account link operation.
   */
  async AccountLink(params?: TimeoutOptions): Promise<AccountLink> {
    return await linkAccountApi(params);
  }

  /**
   * Upload asset file with app ID. Uploads a file to a specific app's assets directory.
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
   * Delete app assets. Deletes all assets for a specific app ID.
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
   * Get account state.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<Awaited<ReturnType<typeof getAccountStateApi>>>} Current account state.
   */
  async AccountStateGet(
    params?: TimeoutOptions,
  ): Promise<Awaited<ReturnType<typeof getAccountStateApi>>> {
    return await getAccountStateApi(params);
  }

  /**
   * Get account profile.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<Awaited<ReturnType<typeof getAccountProfileApi>>>} Current account profile information.
   */
  async AccountProfileGet(
    params?: TimeoutOptions,
  ): Promise<Awaited<ReturnType<typeof getAccountProfileApi>>> {
    return await getAccountProfileApi(params);
  }

  /**
   * Set account profile.
   *
   * @param {SetAccountProfileParams} params - Parameters for setting the profile.
   *   @param {SetAccountProfileParams['name']} [params.name] - Account name.
   *   @param {SetAccountProfileParams['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} Result of the set operation.
   */
  async AccountProfileSet(
    params: SetAccountProfileParams,
  ): Promise<SuccessResponse> {
    return await setAccountProfileApi(params);
  }

  /**
   * Draw on display. Sends drawing data to the display. Supports JSON-defined display elements.
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
   * Clear display. Clears the display and stops the Canvas application if running.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} Result of the clear operation.
   */
  async DisplayClear(params?: TimeoutOptions): Promise<SuccessResponse> {
    return await clearDisplayApi(params);
  }

  /**
   * Get single frame for requested screen.
   *
   * @param {GetScreenFrameParams} params - Parameters for the frame request.
   *   @param {GetScreenFrameParams['display']} params.display - Display ID (0 = Front, 1 = Back).
   *   @param {GetScreenFrameParams['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<Blob>} The screen frame as a Blob.
   */
  async DisplayScreenFrameGet(params: GetScreenFrameParams): Promise<Blob> {
    return (await getScreenFrameApi(params)) as Blob;
  }

  /**
   * Play audio file. Plays an audio file from the assets directory. Supported formats include .snd files.
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
   * Stop audio playback. Stops any currently playing audio.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} Result of the stop operation.
   */
  async AudioStop(params?: TimeoutOptions): Promise<SuccessResponse> {
    return await stopSoundApi(params);
  }

  /**
   * Returns current Wi-Fi status.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<WifiStatusResponse>} Current Wi-Fi status.
   */
  async WifiStatusGet(params?: TimeoutOptions): Promise<WifiStatusResponse> {
    return await statusWifiApi(params);
  }

  /**
   * @deprecated Use `WifiStatusGet` instead. will be removed in the next release.
   */
  async WifiStatus(params?: TimeoutOptions): Promise<WifiStatusResponse> {
    return this.WifiStatusGet(params);
  }

  /**
   * Attempts to connect to Wi-Fi using config.
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
   * Disconnects from Wi-Fi.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} Result of the disconnect operation.
   */
  async WifiDisconnect(params?: TimeoutOptions): Promise<SuccessResponse> {
    return await disconnectWifiApi(params);
  }

  /**
   * Scans environment for available Wi-Fi networks.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<WifiNetworkResponse>} List of discovered networks.
   */
  async WifiNetworksGet(params?: TimeoutOptions): Promise<WifiNetworkResponse> {
    return await networksWifiAPi(params);
  }

  /**
   * @deprecated Use `WifiNetworksGet` instead. will be removed in the next release.
   */
  async WifiNetworks(params?: TimeoutOptions): Promise<WifiNetworkResponse> {
    return this.WifiNetworksGet(params);
  }

  /**
   * Upload file to internal storage. Uploads a file to a specified path.
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
   * Download file from internal storage. Downloads a file from a specified path.
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
   * List files on internal storage.
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
   * Remove a file on internal storage. Removes a file with a specified path.
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
   * Create a directory on internal storage. Creates a new directory with a specified path.
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
   * Show storage usage.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<StorageStatus>} Current storage status information.
   */
  async StorageStatusGet(params?: TimeoutOptions): Promise<StorageStatus> {
    return await statusStorageApi(params);
  }

  /**
   * @deprecated Use `StorageStatusGet` instead. will be removed in the next release.
   */
  async StorageStatus(params?: TimeoutOptions): Promise<StorageStatus> {
    return this.StorageStatusGet(params);
  }

  /**
   * Get brightness value for displays.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<DisplayBrightnessInfo>} Current brightness information for front and back panels.
   */
  async DisplayBrightnessGet(
    params?: TimeoutOptions,
  ): Promise<DisplayBrightnessInfo> {
    return await getDisplayBrightnessApi(params);
  }

  /**
   * @deprecated Use `DisplayBrightnessGet` instead. will be removed in the next release.
   */
  async DisplayBrightness(
    params?: TimeoutOptions,
  ): Promise<DisplayBrightnessInfo> {
    return this.DisplayBrightnessGet(params);
  }

  /**
   * Set display brightness. Set brightness for one or both displays.
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
   * Get audio volume.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<AudioVolumeInfo>} Current audio volume (0-100).
   */
  async AudioVolumeGet(params?: TimeoutOptions): Promise<AudioVolumeInfo> {
    return await getAudioVolumeApi(params);
  }

  /**
   * @deprecated Use `AudioVolumeGet` instead. will be removed in the next release.
   */
  async AudioVolume(params?: TimeoutOptions): Promise<AudioVolumeInfo> {
    return this.AudioVolumeGet(params);
  }

  /**
   * Set audio volume.
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
   * Get HTTP API access over Wi-Fi configuration.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<HttpAccessInfo>} Current HTTP access info.
   */
  async SettingsAccessGet(params?: TimeoutOptions): Promise<HttpAccessInfo> {
    return await getHttpAccessApi(params);
  }

  /**
   * @deprecated Use `SettingsAccessGet` instead. will be removed in the next release.
   */
  async SettingsAccess(params?: TimeoutOptions): Promise<HttpAccessInfo> {
    return this.SettingsAccessGet(params);
  }

  /**
   * Set HTTP API access over Wi-Fi configuration.
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
   * Get current device name.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<NameInfo>} The current device name information.
   */
  async SettingsNameGet(params?: TimeoutOptions): Promise<NameInfo> {
    return await getNameApi(params);
  }

  /**
   * @deprecated Use `SettingsNameGet` instead. will be removed in the next release.
   */
  async SettingsName(params?: TimeoutOptions): Promise<NameInfo> {
    return this.SettingsNameGet(params);
  }

  /**
   * Set new device name.
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
   * Sets API key for all subsequent requests.
   * @param {string} key - API key to use in "X-API-Token" header.
   */
  setApiKey(key: string) {
    setApiKey(key);
  }

  /**
   * Enable BLE. Enables BLE module and starts advertising.
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} Result of the enable operation.
   */
  async BleEnable(params?: TimeoutOptions): Promise<SuccessResponse> {
    return await enableBleApi(params);
  }

  /**
   * Disable BLE. Stops advertising.
   * @param {TimeoutOptions} [params] - Optional parameters.
   * @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} Result of the disable operation.
   */
  async BleDisable(params?: TimeoutOptions): Promise<SuccessResponse> {
    return await disableBleApi(params);
  }

  /**
   * Remove pairing. Remove pairing with previous device.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} Result of the BLE pairing removal operation.
   */
  async BleUnpair(params?: TimeoutOptions): Promise<SuccessResponse> {
    return await pairingBleApi(params);
  }

  /**
   * Returns current BLE status.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<BleStatusResponse>} Current BLE status information.
   */
  async BleStatusGet(params?: TimeoutOptions): Promise<BleStatusResponse> {
    return await statusBleApi(params);
  }

  /**
   * Send input event. Send single key press event.
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
   * Get Matter status.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<Awaited<ReturnType<typeof statusMatterApi>>>} Current Matter status.
   */
  async MatterStatusGet(
    params?: TimeoutOptions,
  ): Promise<Awaited<ReturnType<typeof statusMatterApi>>> {
    return await statusMatterApi(params);
  }

  /**
   * Pair Matter device.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<Awaited<ReturnType<typeof pairDeviceMatterApi>>>} Pairing result.
   */
  async MatterDevicePair(
    params?: TimeoutOptions,
  ): Promise<Awaited<ReturnType<typeof pairDeviceMatterApi>>> {
    return await pairDeviceMatterApi(params);
  }

  /**
   * Erase all Matter devices.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} Result of the erase operation.
   */
  async MatterDevicesErase(params?: TimeoutOptions): Promise<SuccessResponse> {
    return await eraseDevicesMatterApi(params);
  }
}
