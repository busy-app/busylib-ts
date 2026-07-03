import type { BusySnapshot, BusyProfile, BusyProfileSlot, RequestOptions } from 'BusyBar/types/models';

export interface BusySnapshotSetParams extends RequestOptions, BusySnapshot {}

export interface BusyProfileGetParams extends RequestOptions {
  slot: BusyProfileSlot;
}

export interface BusyProfileSetParams extends RequestOptions, BusyProfile {
  slot: BusyProfileSlot;
}
