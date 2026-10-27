import type { Client, ClientPathsWithMethod, FetchResponse, MaybeOptionalInit } from 'openapi-fetch';
import type { components, paths } from 'Global/API';

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

export type ApiKey = string;
export type ApiSemver = components['schemas']['VersionInfo']['api_semver'];

type Media = `${string}/${string}`;

/**
 * Raw transport without the core pipeline: no auth headers, no version negotiation, no timeouts, errors are returned instead of thrown.
 */
export type ApiClient = Client<paths, Media>;

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type PathsWithMethod<M extends HttpMethod> = ClientPathsWithMethod<ApiClient, Lowercase<M>>;

/**
 * Request init accepted by the transport for the given method and path: `params`, `body`, `headers`, `parseAs`.
 */
export type RequestInitFor<M extends HttpMethod, P extends PathsWithMethod<M>> = MaybeOptionalInit<paths[P], Lowercase<M>>;

type RequiredKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? never : K }[keyof T];

/**
 * The init parameter is optional only when the endpoint has no required `params` or `body`.
 */
export type InitParam<I> = RequiredKeys<I> extends never ? [init?: I & RequestOptions] : [init: I & RequestOptions];

// Optional methods of a path are `undefined` in the schema; the transport types need the operation object itself.
type Operation<M extends HttpMethod, P extends PathsWithMethod<M>> = Extract<paths[P][Lowercase<M>], Record<string | number, any>>;

type SuccessData<R> = R extends { data: infer D } ? D : never;

/**
 * Successful response data for the given method and path, typed by the schema and `parseAs`.
 */
export type ResponseData<M extends HttpMethod, P extends PathsWithMethod<M>, I> = SuccessData<FetchResponse<Operation<M, P>, I, Media>>;
