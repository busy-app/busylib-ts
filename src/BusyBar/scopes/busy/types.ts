import type { components } from 'Global/API';

export type BusySnapshot = components['schemas']['BusySnapshot'];
export type BusyProfile = components['schemas']['BusyProfile'];
export type BusyProfileSlot = components['schemas']['BusyProfileSlot'];
export type BusyBarSettings = components['schemas']['BusyBarSettings'];
export type BusySnapshotNotStarted = components['schemas']['BusySnapshotNotStarted'];
export type BusySnapshotInfinite = components['schemas']['BusySnapshotInfinite'];
export type BusySnapshotSimple = components['schemas']['BusySnapshotSimple'];
export type BusySnapshotInterval = components['schemas']['BusySnapshotInterval'];
export type BusySnapshotState = BusySnapshot['snapshot'];
export type BusyTimerInfiniteSettings = components['schemas']['BusyTimerInfiniteSettings'];
export type BusyTimerSimpleSettings = components['schemas']['BusyTimerSimpleSettings'];
export type BusyTimerIntervalSettings = components['schemas']['BusyTimerIntervalSettings'];
export type BusyTimerSettings = BusyProfile['timer_settings'];

export interface BusySnapshotSetParams extends BusySnapshot {}

export interface BusyProfileGetParams {
  slot: BusyProfileSlot;
}

export interface BusyProfileSetParams extends BusyProfile {
  slot: BusyProfileSlot;
}
