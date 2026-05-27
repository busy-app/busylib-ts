import type { AudioPlayBody, AudioVolumeQuery, RequestOptions } from 'BusyBar/types/models';

export type AudioPlayParams = RequestOptions & AudioPlayBody;

export interface AudioVolumeParams extends RequestOptions, AudioVolumeQuery {}
