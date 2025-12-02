export { BusyBar } from "BusyBar/index";
export { ScreenStream } from "ScreenStream/index";
export { Input } from "Input/index";

export { DeviceScreen } from "ScreenStream/types";

export type {
  UploadParams as AssetsUploadParams,
  DeleteParams as AssetsDeleteParams,
} from "BusyBar/api/assets";

export type { DrawParams as DisplayDrawParams } from "BusyBar/api/display";

export type { AudioPlayParams } from "BusyBar/api/audio";

export type { ConnectParams as WifiConnectParams } from "BusyBar/api/wifi";

export type {
  /**
   * @deprecated Use `StorageUploadFileParams` instead.
   * This type will be removed in a future release.
   */
  UploadFileParams,
  /**
   * @deprecated Use `StorageDownloadFileParams` instead.
   * This type will be removed in a future release.
   */
  DownloadFileParams,
  /**
   * @deprecated Use `StorageReadDirectoryParams` instead.
   * This type will be removed in a future release.
   */
  ReadDirectoryParams,
  /**
   * @deprecated Use `StorageRemoveParams` instead.
   * This type will be removed in a future release.
   */
  RemoveParams,
  /**
   * @deprecated Use `StorageCreateDirectoryParams` instead.
   * This type will be removed in a future release.
   */
  CreateDirectoryParams,
} from "BusyBar/api/storage";

export type {
  UploadFileParams as StorageUploadFileParams,
  DownloadFileParams as StorageDownloadFileParams,
  ReadDirectoryParams as StorageReadDirectoryParams,
  RemoveParams as StorageRemoveParams,
  CreateDirectoryParams as StorageCreateDirectoryParams,
} from "BusyBar/api/storage";

export type {
  UpdateParams as SystemUpdateParams,
  SetTimestampParams as SystemTimestampParams,
  SetTimezoneParams as SystemTimezoneParams,
} from "BusyBar/api/system";

export type {
  BrightnessParams as DisplayBrightnessParams,
  AudioVolumeParams,
  HttpAccessParams,
  NameParams,
} from "BusyBar/api/settings";

export type { InputKeyParams } from "BusyBar/api/input";

export type {
  KeyName,
  KeyValue,
  SuccessResponse,
  Error,
  HttpAccessInfo,
  DisplayBrightnessInfo,
  AudioVolumeInfo,
  NameInfo,
  StorageList,
  StorageListElement,
  StorageFileElement,
  StorageDirElement,
  StorageReadResponse,
  VersionInfo,
  Status,
  StatusSystem,
  StatusPower,
  TimestampInfo,
  WifiSecurityMethod,
  WifiIpMethod,
  WifiIpType,
  WifiNetwork,
  WifiStatusResponse,
  WifiConnectRequestConfig,
  WifiNetworkResponse,
} from "Global/types";
