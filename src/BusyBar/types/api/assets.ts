import type { AssetsUploadQuery, AssetsDeleteQuery, BusyFile, RequestOptions } from 'BusyBar/types/models';

export interface AssetsUploadParams extends RequestOptions, AssetsUploadQuery {
  data: BusyFile;
}

export interface AssetsDeleteParams extends RequestOptions, AssetsDeleteQuery {}
