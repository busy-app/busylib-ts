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

/**
 * Name of the current step of the operation in progress: the known steps are listed for autocompletion, while any other string the firmware sends is accepted too.
 */
export type AppQueueStep = 'starting' | 'downloading' | 'unpacking' | 'installing' | 'removing' | (string & {});

export type AppQueueDetail = Omit<components['schemas']['AppQueueDetail'], 'step'> & { step: AppQueueStep };
export type AppQueueItem = components['schemas']['AppQueueItem'];
export type AppQueueGetResult = components['schemas']['AppQueueGetResponse'];

type AppQueueRequestOperationSchema = components['schemas']['AppQueueRequestOperation'];

/**
 * Operation to add to the queue: installation needs the URL of an application package, removal does not. The schema states this with `if`/`then`, which the generated types cannot express.
 */
export type AppQueueRequestOperation =
  | (Omit<AppQueueRequestOperationSchema, 'type' | 'url'> & Required<Pick<AppQueueRequestOperationSchema, 'url'>> & { type: 'install' })
  | (Omit<AppQueueRequestOperationSchema, 'type'> & { type: 'remove' });

export type AppQueueRequestItem = Omit<components['schemas']['AppQueueRequestItem'], 'operation'> & { operation: AppQueueRequestOperation };

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
