import type * as Assets from 'BusyBar/api/assets';
import type * as Display from 'BusyBar/api/display';
import type * as Audio from 'BusyBar/api/audio';
import type * as Wifi from 'BusyBar/api/wifi';
import type * as StorageAPI from 'BusyBar/api/storage';
import type * as Update from 'BusyBar/api/update';
import type * as Time from 'BusyBar/api/time';
import type * as Settings from 'BusyBar/api/settings';
import type * as Input from 'BusyBar/api/input';
import type * as Account from 'BusyBar/api/account';

export type AssetsUploadParams = Assets.UploadParams;
export type AssetsDeleteParams = Assets.DeleteParams;

export type DisplayDrawParams = Display.DrawParams;
export type DisplayClearParams = Display.ClearParams;
export type DisplayBrightnessParams = Display.BrightnessParams;
export type ScreenFrameGetParams = Display.GetScreenFrameParams;

export type AudioPlayParams = Audio.AudioPlayParams;
export type AudioVolumeParams = Audio.AudioVolumeParams;

export type WifiConnectParams = Wifi.ConnectParams;

export type StorageUploadFileParams = StorageAPI.UploadFileParams;
export type StorageDownloadFileParams = StorageAPI.DownloadFileParams;
export type StorageReadDirectoryParams = StorageAPI.ReadDirectoryParams;
export type StorageRemoveParams = StorageAPI.RemoveParams;
export type StorageCreateDirectoryParams = StorageAPI.CreateDirectoryParams;
export type StorageRenameParams = StorageAPI.RenameParams;

export type UpdateFromFileParams = Update.UpdateParams;
export type UpdateInstallParams = Update.InstallParams;
export type UpdateChangelogParams = Update.ChangelogParams;
export type UpdateAutoUpdateParams = Update.AutoUpdateParams;

export type TimeTimestampParams = Time.SetTimestampParams;
export type TimeTimezoneParams = Time.SetTimezoneParams;

export type HttpAccessParams = Settings.HttpAccessParams;
export type NameParams = Settings.NameParams;

export type InputKeyParams = Input.InputKeyParams;

export type AccountProfileSetParams = Account.SetAccountProfileParams;
