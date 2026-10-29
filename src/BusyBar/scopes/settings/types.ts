import type { components, operations } from 'Global/API';

export type HttpAccessInfo = components['schemas']['HttpAccessInfo'];
export type HttpAccessQuery = operations['setHttpAccess']['parameters']['query'];
export type NameInfo = components['schemas']['NameInfo'];
export type AccessToken = components['schemas']['AccessToken'];
export type AccessTokensInfo = components['schemas']['AccessTokensInfo'];
export type AccessTokenCreateBody = components['schemas']['AccessTokensCreateRequest'];
export type AccessTokenRevokePath = operations['revokeAccessToken']['parameters']['path'];

export interface HttpAccessParams extends HttpAccessQuery {}

export interface NameParams extends NameInfo {}

export interface AccessTokenCreateParams extends AccessTokenCreateBody {}

export interface AccessTokenRevokeParams extends AccessTokenRevokePath {}
