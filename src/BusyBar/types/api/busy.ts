import type { BusySnapshot, BusyProfile, BusyProfileSlot } from 'BusyBar/types/models';

export interface BusySnapshotSetParams extends BusySnapshot {}

export interface BusyProfileGetParams {
  slot: BusyProfileSlot;
}

export interface BusyProfileSetParams extends BusyProfile {
  slot: BusyProfileSlot;
}
