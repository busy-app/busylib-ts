import type { HttpAccessQuery, NameInfo, AccessTokenCreateBody, AccessTokenRevokePath } from 'BusyBar/types/models';

export interface HttpAccessParams extends HttpAccessQuery {}

export interface NameParams extends NameInfo {}

export interface AccessTokenCreateParams extends AccessTokenCreateBody {}

export interface AccessTokenRevokeParams extends AccessTokenRevokePath {}
