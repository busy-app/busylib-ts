import type { components, operations } from 'Global/API';

export type TimestampInfo = components['schemas']['TimestampInfo'];
export type TimezoneInfo = components['schemas']['TimezoneInfo'];
export type TimezoneList = components['schemas']['TimezoneListResponse'];
export type TimezoneItem = NonNullable<TimezoneList['list']>[number];
type SetTimezoneQuery = operations['setTimeTimezone']['parameters']['query'];

export interface TimeTimestampParams extends TimestampInfo {}

export interface TimeTimezoneParams extends SetTimezoneQuery {}
