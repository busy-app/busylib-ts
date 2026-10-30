import type { components, operations } from 'Global/API';
import type { BusyFile } from 'BusyBar/types';

export type AppId = components['schemas']['AppId'];
export type AppInfo = components['schemas']['AppInfo'];
export type AppListResult = components['schemas']['AppListResult'];
export type AppStageResult = components['schemas']['AppStageResult'];
export type AppSettingsDocument = components['schemas']['AppSettingsDocument'];
type AppsInstallQuery = operations['installApp']['parameters']['query'];
type AppsRemoveQuery = operations['removeApp']['parameters']['query'];
type AppsSettingsQuery = operations['getAppSettings']['parameters']['query'];

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
