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

/**
 * @deprecated Use `StorageUploadFileParams` instead.
 * This type will be removed in a future release.
 */
export type { UploadFileParams } from "BusyBar/api/storage";

/**
 * @deprecated Use `StorageDownloadFileParams` instead.
 * This type will be removed in a future release.
 */
export type { DownloadFileParams } from "BusyBar/api/storage";

/**
 * @deprecated Use `StorageReadDirectoryParams` instead.
 * This type will be removed in a future release.
 */
export type { ReadDirectoryParams } from "BusyBar/api/storage";

/**
 * @deprecated Use `StorageRemoveParams` instead.
 * This type will be removed in a future release.
 */
export type { RemoveParams } from "BusyBar/api/storage";

/**
 * @deprecated Use `StorageCreateDirectoryParams` instead.
 * This type will be removed in a future release.
 */
export type { CreateDirectoryParams } from "BusyBar/api/storage";

export type {
  UploadFileParams as StorageUploadFileParams,
  DownloadFileParams as StorageDownloadFileParams,
  ReadDirectoryParams as StorageReadDirectoryParams,
  RemoveParams as StorageRemoveParams,
  CreateDirectoryParams as StorageCreateDirectoryParams,
} from "BusyBar/api/storage";

export type { UpdateParams as SystemUpdateParams } from "BusyBar/api/system";

export type {
  BrightnessParams as DisplayBrightnessParams,
  AudioVolumeParams,
  HttpAccessParams,
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
  StorageList,
  StorageListElement,
  StorageFileElement,
  StorageDirElement,
  StorageReadResponse,
  VersionInfo,
  Status,
  StatusSystem,
  StatusPower,
  WifiSecurityMethod,
  WifiIpMethod,
  WifiIpType,
  WifiNetwork,
  WifiStatusResponse,
  WifiConnectRequestConfig,
  WifiNetworkResponse,
} from "Global/types";
