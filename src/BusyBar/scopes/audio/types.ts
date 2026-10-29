import type { components, operations } from 'Global/API';

export type AudioVolumeInfo = components['schemas']['AudioVolumeInfo'];
export type AudioPlayBody = components['schemas']['PlayAudio'];
export type AudioVolumeQuery = operations['setAudioVolume']['parameters']['query'];

export type AudioPlayParams = AudioPlayBody;

export interface AudioVolumeParams extends AudioVolumeQuery {}
