// Types used only inside the library; the public ones live in types.ts.
import type { paths } from 'Global/API';
import type { HttpMethod, PathsWithMethod, ResponseData } from './types';

export type ApiKey = string;

export type RequiredKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? never : K }[keyof T];

/** The schema operation of a method and path; optional methods of a path are `undefined` in the schema, so the operation is extracted. */
export type Operation<M extends HttpMethod, P extends keyof paths> = Extract<paths[P][Lowercase<M>], Record<string, any>>;

/** `params` is required when the operation has a required path or query parameter. */
export type ParamsOption<O> = O extends { parameters: infer Params }
  ? RequiredKeys<Params> extends never
    ? { params?: Params }
    : { params: Params }
  : { params?: never };

type BodyContent<O> = O extends { requestBody?: infer B } ? (NonNullable<B> extends { content: infer C } ? C[keyof C] : never) : never;

/** `body` is required when the operation has a required request body, and not accepted when it has none. */
export type BodyOption<O> = [BodyContent<O>] extends [never]
  ? { body?: never }
  : O extends { requestBody: unknown }
    ? { body: BodyContent<O> }
    : { body?: BodyContent<O> };

/** How the response body is read. */
export type ParseAs = 'json' | 'text' | 'blob' | 'arrayBuffer' | 'stream';

/** Header values; `null` removes a header, an array sends several values. */
export type HeadersOptions = HeadersInit | Record<string, string | number | boolean | (string | number | boolean)[] | null | undefined>;

/** Transport init of an operation. */
export type TransportInit<O> = ParamsOption<O> &
  BodyOption<O> & {
    headers?: HeadersOptions;
    parseAs?: ParseAs;
    signal?: AbortSignal;
  };

type OkStatus = 200 | 201 | 202 | 203 | 204 | 206 | 207 | '2XX';

type ContentOf<R> = R extends { content: infer C } ? C[keyof C] : undefined;

/** Body of a successful response of an operation, as described by the schema. */
export type SuccessContent<O> = O extends { responses: infer R } ? ContentOf<R[keyof R & OkStatus]> : unknown;

/** Body of an error response of an operation, as described by the schema. */
export type ErrorContent<O> = O extends { responses: infer R } ? ContentOf<R[Exclude<keyof R, OkStatus>]> : unknown;

type BodyType<T> = {
  json: T;
  text: string;
  blob: Blob;
  arrayBuffer: ArrayBuffer;
  stream: ReadableStream<Uint8Array> | null;
};

/** Response data as `parseAs` reads it; the schema type when `parseAs` is not given. */
export type ParsedData<T, I> = I extends { parseAs: infer A extends ParseAs } ? BodyType<T>[A] : T;

/** The init parameter of a transport method is optional only when the endpoint has no required `params` or `body`. */
export type TransportInitParam<I> = RequiredKeys<I> extends never ? [init?: I] : [init: I];

/** Transport result: the parsed data of a successful response, or the parsed body of a failed one as `error`. */
export type TransportResponse<M extends HttpMethod, P extends PathsWithMethod<M>, I> =
  | { data: ResponseData<M, P, I>; error?: never; response: Response }
  | { data?: never; error: ErrorContent<Operation<M, P>>; response: Response };
