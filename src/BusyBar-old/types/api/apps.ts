import type { AppsRemoveQuery, AppsInstallQuery, AppsSettingsQuery, AppSettingsDocument, BusyFile } from 'BusyBar-old/types/models';

export interface AppsStageParams {
  file: BusyFile;
}

export interface AppsInstallParams extends AppsInstallQuery {}

export interface AppsRemoveParams extends AppsRemoveQuery {}

export interface AppsSettingsGetParams extends AppsSettingsQuery {}

export interface AppsSettingsSetParams extends AppsSettingsQuery {
  settings: AppSettingsDocument;
}

export interface AppsSettingsResetParams extends AppsSettingsQuery {}
