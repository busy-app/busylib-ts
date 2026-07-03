import type { LogDumpQuery, RequestOptions } from 'BusyBar/types/models';

export interface LogDumpParams extends RequestOptions, Partial<LogDumpQuery> {}
