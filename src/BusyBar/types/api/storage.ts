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

export interface StorageUploadFileParams extends RequestOptions, StorageWriteQuery {
  file: BusyFile;
}

export interface StorageDownloadFileParams extends RequestOptions, StorageReadQuery {
  as_array_buffer?: boolean;
}

export interface StorageReadDirectoryParams extends RequestOptions, StorageListQuery {}

export interface StorageRemoveParams extends RequestOptions, StorageRemoveQuery {}

export interface StorageCreateDirectoryParams extends RequestOptions, StorageCreateDirQuery {}

export interface StorageRenameParams extends RequestOptions, StorageRenameQuery {}
