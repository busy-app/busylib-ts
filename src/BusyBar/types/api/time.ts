import type { TimestampInfo, SetTimezoneQuery, RequestOptions } from 'BusyBar/types/models';

export interface TimeTimestampParams extends RequestOptions, TimestampInfo {}

export interface TimeTimezoneParams extends RequestOptions, SetTimezoneQuery {}
