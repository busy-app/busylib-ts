import type { components, operations } from 'Global/API';
import type { BusyFile } from 'BusyBar/types';

export type UpdateStatus = components['schemas']['UpdateStatus'];
export type UpdateChangelog = operations['getUpdateChangelog']['responses']['200']['content']['application/json'];
export type AutoUpdateSettings = components['schemas']['AutoupdateSettings'];
type UpdateChangelogQuery = operations['getUpdateChangelog']['parameters']['query'];
type UpdateInstallQuery = operations['installFirmwareUpdate']['parameters']['query'];

export interface UpdateFromFileParams {
  file: BusyFile;
}

export interface UpdateChangelogParams extends UpdateChangelogQuery {}

export interface UpdateInstallParams extends UpdateInstallQuery {}

export interface UpdateAutoUpdateParams extends AutoUpdateSettings {}
