import type { DisplayElements, ClearDisplayQuery, ScreenQuery, RequestOptions } from 'BusyBar/types/models';

export interface DisplayDrawParams extends RequestOptions, DisplayElements {}

export interface DisplayClearParams extends RequestOptions, Partial<ClearDisplayQuery> {}

export interface ScreenFrameGetParams extends RequestOptions, ScreenQuery {}

export type ScreenFrameGetOptions =
  | { dataType: 'binary'; format?: 'raw' | 'rgba' }
  | { dataType?: 'blob'; format?: never };

export type ScreenFrameGetResult<T extends ScreenFrameGetOptions | undefined> = T extends {
  dataType: 'binary';
}
  ? Uint8Array | undefined
  : Blob | undefined;

export interface DisplayBrightnessParams extends RequestOptions {
  value: number | 'auto';
}
