import type { components, operations } from 'Global/API';
import type { BusyFile } from 'BusyBar/types';

export type AppId = components['schemas']['AppId'];
export type AppInfo = components['schemas']['AppInfo'];
export type AppListResult = components['schemas']['AppListResult'];
export type AppStageResult = components['schemas']['AppStageResult'];
export type AppSettingsDocument = components['schemas']['AppSettingsDocument'];
type AppsInstallQuery = operations['installApp']['parameters']['query'];
type AppsRemoveQuery = operations['removeApp']['parameters']['query'];
type AppsLaunchQuery = operations['launchApp']['parameters']['query'];
type AppsSettingsQuery = operations['getAppSettings']['parameters']['query'];

export interface AppsStageParams {
  file: BusyFile;
}

export interface AppsInstallParams extends AppsInstallQuery {}

export interface AppsRemoveParams extends AppsRemoveQuery {}

export interface AppsLaunchParams extends AppsLaunchQuery {}

export interface AppsSettingsGetParams extends AppsSettingsQuery {}

export interface AppsSettingsSetParams extends AppsSettingsQuery {
  settings: AppSettingsDocument;
}

export interface AppsSettingsResetParams extends AppsSettingsQuery {}

export type AppQueueItemId = components['schemas']['AppQueueItemId'];
export type AppQueueOperationType = components['schemas']['AppQueueOperationType'];
export type AppQueueOperation = components['schemas']['AppQueueOperation'];
export type AppQueueStatus = components['schemas']['AppQueueStatus'];
export type AppQueueEnqueueError = components['schemas']['AppQueueError'];
export type AppQueueDetail = components['schemas']['AppQueueDetail'];
export type AppQueueItem = components['schemas']['AppQueueItem'];
export type AppQueueRequestOperation = components['schemas']['AppQueueRequestOperation'];
export type AppQueueRequestItem = components['schemas']['AppQueueRequestItem'];
export type AppQueueGetResult = components['schemas']['AppQueueGetResponse'];

/**
 * Result of adding one operation to the queue: the item id when the operation was accepted, or the reason it was rejected.
 */
export type AppQueueAddResultItem =
  | (Pick<AppQueueRequestItem, 'app_id'> & { operation: AppQueueOperation; item_id: AppQueueItemId; error?: never })
  | (Pick<AppQueueRequestItem, 'app_id'> & { operation: AppQueueOperation; error: AppQueueEnqueueError; item_id?: never });

export interface AppQueueAddResult {
  result: AppQueueAddResultItem[];
}

export interface AppsQueueAddParams {
  operations: AppQueueRequestItem[];
}

export type AppsQueueCancelParams = components['schemas']['AppQueueCancelRequest'] | components['schemas']['AppQueueClearRequest'];
