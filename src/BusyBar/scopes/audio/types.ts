import type { components, operations } from 'Global/API';

export type AudioVolumeInfo = components['schemas']['AudioVolumeInfo'];
type AudioPlayBody = components['schemas']['PlayAudio'];
type AudioVolumeQuery = operations['setAudioVolume']['parameters']['query'];

export type AudioPlayParams = AudioPlayBody;

export interface AudioVolumeParams extends AudioVolumeQuery {}
