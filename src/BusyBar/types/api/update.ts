import type { AutoUpdateSettings, UpdateChangelogQuery, UpdateInstallQuery, BusyFile } from 'BusyBar/types/models';

export interface UpdateFromFileParams {
  file: BusyFile;
}

export interface UpdateChangelogParams extends UpdateChangelogQuery {}

export interface UpdateInstallParams extends UpdateInstallQuery {}

export interface UpdateAutoUpdateParams extends AutoUpdateSettings {}
