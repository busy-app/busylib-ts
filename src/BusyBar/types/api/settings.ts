import type { HttpAccessQuery, NameInfo, RequestOptions } from 'BusyBar/types/models';

export interface HttpAccessParams extends RequestOptions, HttpAccessQuery {}

export interface NameParams extends RequestOptions, NameInfo {}
