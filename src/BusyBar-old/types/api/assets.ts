import type { AssetsUploadQuery, AssetsDeleteQuery, BusyFile } from 'BusyBar-old/types/models';

export interface AssetsUploadParams extends AssetsUploadQuery {
  data: BusyFile;
}

export interface AssetsDeleteParams extends AssetsDeleteQuery {}
