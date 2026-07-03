import type {
  StorageWriteQuery,
  StorageReadQuery,
  StorageListQuery,
  StorageRemoveQuery,
  StorageCreateDirQuery,
  StorageRenameQuery,
  BusyFile,
  RequestOptions
} from 'BusyBar/types/models';

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
