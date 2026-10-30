import type { operations } from 'Global/API';
import type { BusyFile } from 'BusyBar/types';

type AssetsUploadQuery = operations['uploadAssetWithAppId']['parameters']['query'];
type AssetsDeleteQuery = operations['deleteAppAssets']['parameters']['query'];

export interface AssetsUploadParams extends AssetsUploadQuery {
  data: BusyFile;
}

export interface AssetsDeleteParams extends AssetsDeleteQuery {}
