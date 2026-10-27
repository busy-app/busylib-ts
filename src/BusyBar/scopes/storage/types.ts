import type { components, operations } from 'Global/API';
import type { RequestOptions } from 'BusyBar/client/types';
import type { BusyFile } from 'BusyBar/types';

export type StorageList = components['schemas']['StorageList'];
export type StorageListElement = components['schemas']['StorageListElement'];
export type StorageFileElement = components['schemas']['StorageFileElement'];
export type StorageDirElement = components['schemas']['StorageDirElement'];
export type StorageReadResponse = ArrayBuffer | Blob;
export type StorageStatus = components['schemas']['StorageStatus'];
export type StorageWriteQuery = operations['writeStorageFile']['parameters']['query'];
export type StorageReadQuery = operations['readStorageFile']['parameters']['query'];
export type StorageListQuery = operations['listStorageFiles']['parameters']['query'];
export type StorageRemoveQuery = operations['removeStorageFile']['parameters']['query'];
export type StorageCreateDirQuery = operations['createStorageDir']['parameters']['query'];
export type StorageRenameQuery = operations['RenameStorageFile']['parameters']['query'];

export interface StorageUploadFileParams extends StorageWriteQuery {
  file: BusyFile;
}

export interface StorageDownloadFileParams extends StorageReadQuery {}

export interface StorageDownloadFileOptions extends RequestOptions {
  as_array_buffer?: boolean;
}

export interface StorageReadDirectoryParams extends StorageListQuery {}

export interface StorageRemoveParams extends StorageRemoveQuery {}

export interface StorageCreateDirectoryParams extends StorageCreateDirQuery {}

export interface StorageRenameParams extends StorageRenameQuery {}
