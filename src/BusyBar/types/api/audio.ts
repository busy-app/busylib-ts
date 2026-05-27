import type { AudioPlayQuery, AudioVolumeQuery, RequestOptions } from 'BusyBar/types/models';

export interface AudioPlayParams extends RequestOptions, AudioPlayQuery {}

export interface AudioVolumeParams extends RequestOptions, AudioVolumeQuery {}
