import type { components, operations, paths } from 'Global/API';
import type { RequestOptions } from 'BusyBar/client/types';

export type DisplayElements = components['schemas']['DisplayElements'];
export type DisplayElement = components['schemas']['DisplayElement'];
export type TextElement = components['schemas']['TextElement'];
export type ImageElement = components['schemas']['ImageElement'];
export type AnimationElement = components['schemas']['AnimationElement'];
export type CountdownElement = components['schemas']['CountdownElement'];
export type RectangleElement = components['schemas']['RectangleElement'];
export type XpmBitmapElement = components['schemas']['XpmBitmapElement'];
export type DisplayBrightnessInfo = components['schemas']['DisplayBrightnessInfo'];
export type ScreenResponse = components['schemas']['ScreenResponse'];
export type ClearDisplayQuery = NonNullable<operations['clearDisplay']['parameters']['query']>;
export type DeletionParameters = components['schemas']['DeletionParameters'];
export type ScreenQuery = paths['/screen']['get']['parameters']['query'];

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
