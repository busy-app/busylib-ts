// Public types: everything here is exported from the package. Internal helpers live in types.internal.ts.
import type { components, paths } from 'Global/API';
import type { Operation, ParsedData, RequiredKeys, SuccessContent, TransportInit, TransportInitParam, TransportResponse } from './types.internal';

export type BusyBarConfig = {
  addr?: string;
  token?: string;
  timeout?: number;
  HTTPAccessPassword?: string;
};

export type BusyBarAppConfig = {
  addr?: string;
};

export interface RequestOptions {
  timeout?: number;
  signal?: AbortSignal;
}

export type ApiSemver = components['schemas']['VersionInfo']['api_semver'];

/**
 * Error thrown for a non-2xx response, with the HTTP status and the response body attached.
 */
export interface FetchError<T = unknown> extends Error {
  status: number;
  statusText: string;
  body: T;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

/**
 * Paths of the API schema that have the given HTTP method.
 */
export type PathsWithMethod<M extends HttpMethod> = { [P in keyof paths]: paths[P] extends Record<Lowercase<M>, Record<string, any>> ? P : never }[keyof paths];

/**
 * Request init accepted by the transport for the given method and path: `params`, `body`, `headers`, `parseAs`, `signal`; `undefined` when nothing in it is required.
 */
export type RequestInitFor<M extends HttpMethod, P extends PathsWithMethod<M>> =
  RequiredKeys<TransportInit<Operation<M, P>>> extends never ? TransportInit<Operation<M, P>> | undefined : TransportInit<Operation<M, P>>;

/**
 * The init parameter is optional only when the endpoint has no required `params` or `body`; `O` is the request options the client takes next to it.
 */
export type InitParam<I, O = RequestOptions> = RequiredKeys<I> extends never ? [init?: I & O] : [init: I & O];

/**
 * Successful response data for the given method and path, typed by the schema and `parseAs`.
 */
export type ResponseData<M extends HttpMethod, P extends PathsWithMethod<M>, I> = ParsedData<SuccessContent<Operation<M, P>>, I>;

/**
 * What the request functions need from a client: typed requests by path that return the response data and throw `FetchError`. Implemented by `BusyBarClient` and `BusyBarAppClient`.
 */
export interface RequestClient {
  request<M extends HttpMethod, P extends PathsWithMethod<M>, I extends RequestInitFor<M, P>>(
    method: M,
    path: P,
    ...init: InitParam<I>
  ): Promise<ResponseData<M, P, I>>;
  GET<P extends PathsWithMethod<'GET'>, I extends RequestInitFor<'GET', P>>(path: P, ...init: InitParam<I>): Promise<ResponseData<'GET', P, I>>;
  POST<P extends PathsWithMethod<'POST'>, I extends RequestInitFor<'POST', P>>(path: P, ...init: InitParam<I>): Promise<ResponseData<'POST', P, I>>;
  PUT<P extends PathsWithMethod<'PUT'>, I extends RequestInitFor<'PUT', P>>(path: P, ...init: InitParam<I>): Promise<ResponseData<'PUT', P, I>>;
  DELETE<P extends PathsWithMethod<'DELETE'>, I extends RequestInitFor<'DELETE', P>>(path: P, ...init: InitParam<I>): Promise<ResponseData<'DELETE', P, I>>;
  /**
   * Sets the HTTP access password for the next requests; only a client that sends it has this method.
   */
  setHTTPAccessPassword?(key: string): void;
}

/**
 * Raw transport without the core pipeline: no auth headers, no version negotiation, no timeouts, errors are returned instead of thrown.
 */
export interface ApiClient {
  request<M extends HttpMethod, P extends PathsWithMethod<M>, I extends RequestInitFor<M, P>>(
    method: M,
    path: P,
    ...init: TransportInitParam<I>
  ): Promise<TransportResponse<M, P, I>>;
  GET<P extends PathsWithMethod<'GET'>, I extends RequestInitFor<'GET', P>>(path: P, ...init: TransportInitParam<I>): Promise<TransportResponse<'GET', P, I>>;
  POST<P extends PathsWithMethod<'POST'>, I extends RequestInitFor<'POST', P>>(
    path: P,
    ...init: TransportInitParam<I>
  ): Promise<TransportResponse<'POST', P, I>>;
  PUT<P extends PathsWithMethod<'PUT'>, I extends RequestInitFor<'PUT', P>>(path: P, ...init: TransportInitParam<I>): Promise<TransportResponse<'PUT', P, I>>;
  DELETE<P extends PathsWithMethod<'DELETE'>, I extends RequestInitFor<'DELETE', P>>(
    path: P,
    ...init: TransportInitParam<I>
  ): Promise<TransportResponse<'DELETE', P, I>>;
}
