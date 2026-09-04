import { operations, components, paths } from 'Global/API';

export interface RequestOptions {
  timeout?: number;
  signal?: AbortSignal;
}

export type SuccessResponse = components['schemas']['SuccessResponse'];
export type Error = components['schemas']['Error'];

export type BusyFile = Buffer | Blob | File | ArrayBuffer;

// Account
export type AccountInfo = components['schemas']['AccountInfo'];
export type AccountLink = components['schemas']['AccountLink'];
export type AccountStatus = components['schemas']['AccountStatus'];
export type AccountBackend = components['schemas']['AccountBackend'];

// Assets
export type AssetsUploadQuery = operations['uploadAssetWithAppId']['parameters']['query'];
export type AssetsDeleteQuery = operations['deleteAppAssets']['parameters']['query'];

// Audio
export type AudioVolumeInfo = components['schemas']['AudioVolumeInfo'];
export type AudioPlayBody = components['schemas']['PlayAudio'];
export type AudioVolumeQuery = operations['setAudioVolume']['parameters']['query'];

// BLE
export type BleStatusResponse = components['schemas']['BleStatusResponse'];

export type DisplayElements = components['schemas']['DisplayElements'];
export type DisplayElement = components['schemas']['DisplayElement'];
export type TextElement = components['schemas']['TextElement'];
export type ImageElement = components['schemas']['ImageElement'];
export type DisplayBrightnessInfo = components['schemas']['DisplayBrightnessInfo'];
export type AnimationElement = components['schemas']['AnimationElement'];
export type CountdownElement = components['schemas']['CountdownElement'];
export type RectangleElement = components['schemas']['RectangleElement'];
export type XpmBitmapElement = components['schemas']['XpmBitmapElement'];
export type ScreenResponse = components['schemas']['ScreenResponse'];
export type ClearDisplayQuery = NonNullable<operations['clearDisplay']['parameters']['query']>;
export type LogDumpQuery = NonNullable<operations['dumpLog']['parameters']['query']>;
export type LogDumpResponse = operations['dumpLog']['responses'][200]['content']['application/json'];
export type ScreenQuery = paths['/screen']['get']['parameters']['query'];

// Input
export type InputKeyQuery = operations['setInputKey']['parameters']['query'];

// Busy
export type BusySnapshot = components['schemas']['BusySnapshot'];
export type BusyProfile = components['schemas']['BusyProfile'];
export type BusyProfileSlot = components['schemas']['BusyProfileSlot'];
export type BusyBarSettings = components['schemas']['BusyBarSettings'];

export type BusySnapshotNotStarted = components['schemas']['BusySnapshotNotStarted'];
export type BusySnapshotInfinite = components['schemas']['BusySnapshotInfinite'];
export type BusySnapshotSimple = components['schemas']['BusySnapshotSimple'];
export type BusySnapshotInterval = components['schemas']['BusySnapshotInterval'];
export type BusySnapshotState = BusySnapshot['snapshot'];

export type BusyTimerInfiniteSettings = components['schemas']['BusyTimerInfiniteSettings'];
export type BusyTimerSimpleSettings = components['schemas']['BusyTimerSimpleSettings'];
export type BusyTimerIntervalSettings = components['schemas']['BusyTimerIntervalSettings'];
export type BusyTimerSettings = BusyProfile['timer_settings'];

// SmartHome
export type SmartHomePairingPayload = components['schemas']['SmartHomePairingPayload'];
export type SmartHomePairingInfo = components['schemas']['SmartHomePairingInfo'];
export type SmartHomeSwitchState = components['schemas']['SmartHomeSwitchState'];

// Settings
export type HttpAccessInfo = components['schemas']['HttpAccessInfo'];
export type HttpAccessQuery = operations['setHttpAccess']['parameters']['query'];
export type NameInfo = components['schemas']['NameInfo'];
export type AccessToken = components['schemas']['AccessToken'];
export type AccessTokensInfo = components['schemas']['AccessTokensInfo'];
export type AccessTokenCreateBody = components['schemas']['AccessTokensCreateRequest'];
export type AccessTokenRevokePath = operations['revokeAccessToken']['parameters']['path'];

// Storage
export type StorageList = components['schemas']['StorageList'];
export type StorageListElement = components['schemas']['StorageListElement'];
export type StorageFileElement = components['schemas']['StorageFileElement'];
export type StorageDirElement = components['schemas']['StorageDirElement'];
export type StorageReadResponse = ArrayBuffer | Blob;
export type StorageStatus = components['schemas']['StorageStatus'];
export type StorageWriteQuery = operations['writeStorageFile']['parameters']['query'];
export type StorageReadQuery = operations['readStorageFile']['parameters']['query'];
export type StorageListQuery = operations['listStorageFiles']['parameters']['query'];
export type StorageRemoveQuery = operations['removeStorageFile']['parameters']['query'];
export type StorageCreateDirQuery = operations['createStorageDir']['parameters']['query'];
export type StorageRenameQuery = operations['RenameStorageFile']['parameters']['query'];

// System
export type VersionInfo = components['schemas']['VersionInfo'];
export type Status = components['schemas']['Status'];
export type StatusSystem = components['schemas']['StatusSystem'];
export type StatusPower = components['schemas']['StatusPower'];
export type StatusDevice = components['schemas']['StatusDevice'];
export type StatusFirmware = components['schemas']['StatusFirmware'];
export type TimestampInfo = components['schemas']['TimestampInfo'];
export type NetworkInterfaceInfo = components['schemas']['NetworkInterfaceInfo'];

// Time
export type TimezoneInfo = components['schemas']['TimezoneInfo'];
export type TimezoneList = components['schemas']['TimezoneListResponse'];
export type TimezoneItem = NonNullable<TimezoneList['list']>[number];
export type SetTimezoneQuery = operations['setTimeTimezone']['parameters']['query'];

// Update
export type UpdateStatus = components['schemas']['UpdateStatus'];
export type UpdateChangelog = operations['getUpdateChangelog']['responses']['200']['content']['application/json'];
export type AutoUpdateSettings = components['schemas']['AutoupdateSettings'];
export type UpdateChangelogQuery = operations['getUpdateChangelog']['parameters']['query'];
export type UpdateInstallQuery = operations['installFirmwareUpdate']['parameters']['query'];

// Wifi
export type WifiSecurityMethod = components['schemas']['WifiSecurityMethod'];
export type WifiIpMethod = components['schemas']['WifiIpMethod'];
export type WifiIpType = components['schemas']['WifiIpType'];
export type WifiNetwork = components['schemas']['Network'];
export type WifiStatusResponse = components['schemas']['StatusResponse'];
export type WifiConnectRequestConfig = components['schemas']['ConnectRequestConfig'];
export type WifiNetworkResponse = components['schemas']['NetworkResponse'];
