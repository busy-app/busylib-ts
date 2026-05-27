import type { AutoUpdateSettings, UpdateChangelogQuery, UpdateInstallQuery, BusyFile, RequestOptions } from 'BusyBar/types/models';

export interface UpdateFromFileParams extends RequestOptions {
  file: BusyFile;
}

export interface UpdateChangelogParams extends RequestOptions, UpdateChangelogQuery {}

export interface UpdateInstallParams extends RequestOptions, UpdateInstallQuery {}

export interface UpdateAutoUpdateParams extends RequestOptions, AutoUpdateSettings {}
