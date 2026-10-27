// Public types: everything here is exported from the package. Internal helpers live in types.internal.ts.
import type { Client, ClientPathsWithMethod, FetchResponse, MaybeOptionalInit } from 'openapi-fetch';
import type { components, paths } from 'Global/API';
import type { Media, RequiredKeys, SuccessData } from './types.internal';

export type BusyBarConfig = {
  addr?: string;
  token?: string;
  timeout?: number;
  HTTPAccessPassword?: string;
};

export interface RequestOptions {
  timeout?: number;
  signal?: AbortSignal;
}

export type ApiSemver = components['schemas']['VersionInfo']['api_semver'];

/**
 * Raw transport without the core pipeline: no auth headers, no version negotiation, no timeouts, errors are returned instead of thrown.
 */
export type ApiClient = Client<paths, Media>;

/**
 * Error thrown for a non-2xx response, with the HTTP status and the response body attached.
 */
export interface FetchError<T = unknown> extends Error {
  status: number;
  statusText: string;
  body: T;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type PathsWithMethod<M extends HttpMethod> = ClientPathsWithMethod<ApiClient, Lowercase<M>>;

/**
 * Request init accepted by the transport for the given method and path: `params`, `body`, `headers`, `parseAs`.
 */
export type RequestInitFor<M extends HttpMethod, P extends PathsWithMethod<M>> = MaybeOptionalInit<paths[P], Lowercase<M>>;

/**
 * The init parameter is optional only when the endpoint has no required `params` or `body`.
 */
export type InitParam<I> = RequiredKeys<I> extends never ? [init?: I & RequestOptions] : [init: I & RequestOptions];

/**
 * Successful response data for the given method and path, typed by the schema and `parseAs`; optional methods of a path are `undefined` in the schema, so the operation is extracted first.
 */
export type ResponseData<M extends HttpMethod, P extends PathsWithMethod<M>, I> = SuccessData<
  FetchResponse<Extract<paths[P][Lowercase<M>], Record<string | number, any>>, I, Media>
>;
