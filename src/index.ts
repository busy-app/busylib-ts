export { BusyBar, type BusyBarConfig } from "BusyBar/index";
export { ScreenStream, type ScreenStreamConfig } from "ScreenStream/index";
export { Input, type InputConfig } from "Input/index";

export { DeviceScreen } from "ScreenStream/types";

export type {
  UploadParams as AssetsUploadParams,
  DeleteParams as AssetsDeleteParams,
} from "BusyBar/api/assets";

export type { DrawParams as DisplayDrawParams } from "BusyBar/api/display";

export type { AudioPlayParams } from "BusyBar/api/audio";

export type { ConnectParams as WifiConnectParams } from "BusyBar/api/wifi";

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
  AccountInfo,
  AccountLink,
  BleStatusResponse,
  DisplayBrightnessInfo,
  AudioVolumeInfo,
  NameInfo,
  StorageList,
  StorageListElement,
  StorageFileElement,
  StorageDirElement,
  StorageReadResponse,
  StorageStatus,
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
