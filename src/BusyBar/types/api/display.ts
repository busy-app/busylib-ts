import type { DisplayElements, ClearDisplayQuery, DeletionParameters, ScreenQuery, RequestOptions } from 'BusyBar/types/models';

export interface DisplayDrawParams extends DisplayElements {}

export interface DisplayClearParams extends ClearDisplayQuery, DeletionParameters {}

export interface ScreenFrameGetParams extends ScreenQuery {}

export type ScreenFrameGetOptions = RequestOptions & ({ dataType: 'binary'; format?: 'raw' | 'rgba' } | { dataType?: 'blob'; format?: never });

export type ScreenFrameGetResult<T extends ScreenFrameGetOptions | undefined> = T extends {
  dataType: 'binary';
}
  ? Uint8Array | undefined
  : Blob | undefined;

export interface DisplayBrightnessParams {
  value: number | 'auto';
}
