// Type-level tests of the core request methods, checked by `typecheck` and never run.
import { expectTypeOf } from 'vitest';
import type { components } from 'Global/API';
import {
  displayClear,
  displayDraw,
  displayScreenFrameGet,
  storageRead,
  type BusyBarAppClient,
  type BusyBarClient,
  type RequestClient,
  type RequestOptions
} from 'BusyBar/index';

type Schema = components['schemas'];

export function responseTypes(client: BusyBarClient) {
  // The data type is the success response schema.
  expectTypeOf(client.GET('/version')).resolves.toEqualTypeOf<Schema['VersionInfo']>();
  expectTypeOf(client.GET('/status')).resolves.toEqualTypeOf<Schema['Status']>();
  expectTypeOf(client.POST('/display/draw', { body: { application_name: 'app', elements: [] } })).resolves.toEqualTypeOf<Schema['SuccessResponse']>();

  // `parseAs` changes the data type.
  expectTypeOf(client.GET('/screen', { params: { query: { display: 0 } }, parseAs: 'blob' })).resolves.toEqualTypeOf<Blob>();
  expectTypeOf(client.GET('/storage/read', { params: { query: { path: '/ext/a' } }, parseAs: 'arrayBuffer' })).resolves.toEqualTypeOf<ArrayBuffer>();

  // `request` is the same as the method shortcuts.
  expectTypeOf(client.request('GET', '/version')).resolves.toEqualTypeOf<Schema['VersionInfo']>();
  expectTypeOf(client.request('POST', '/display/draw', { body: { application_name: 'app', elements: [] } })).resolves.toEqualTypeOf<
    Schema['SuccessResponse']
  >();
}

export function initTypes(client: BusyBarClient, signal: AbortSignal) {
  // `timeout` and `signal` are accepted next to the transport init.
  client.GET('/status', { timeout: 1000, signal });
  client.POST('/display/draw', { body: { application_name: 'app', elements: [] }, timeout: 0 });

  // @ts-expect-error unknown path
  client.GET('/unknown');

  // @ts-expect-error `/display/draw` has no GET
  client.GET('/display/draw');

  // @ts-expect-error `/display/draw` POST requires a body
  client.POST('/display/draw');

  // @ts-expect-error `/screen` requires the `display` query
  client.GET('/screen');

  // @ts-expect-error `display` must be a number
  client.GET('/screen', { params: { query: { display: '0' } } });

  // @ts-expect-error `timeout` must be a number
  client.GET('/status', { timeout: '1000' });

  // @ts-expect-error method and path must match
  client.request('POST', '/version');
}

export function appClientTypes(appClient: BusyBarAppClient, client: BusyBarClient, signal: AbortSignal) {
  // The functions take either client.
  displayDraw(appClient, { application_name: 'app', elements: [] });
  displayDraw(client, { application_name: 'app', elements: [] });
  expectTypeOf(displayClear(appClient)).resolves.toEqualTypeOf<Schema['SuccessResponse']>();

  // Requests by path are typed the same way.
  expectTypeOf(appClient.GET('/version')).resolves.toEqualTypeOf<Schema['VersionInfo']>();
  expectTypeOf(appClient.GET('/screen', { params: { query: { display: 0 } }, parseAs: 'blob' })).resolves.toEqualTypeOf<Blob>();

  // @ts-expect-error the firmware cannot cancel a request: no `timeout`
  appClient.GET('/status', { timeout: 1000 });

  // @ts-expect-error no `signal`
  appClient.GET('/status', { signal });

  // @ts-expect-error `/display/draw` POST requires a body
  appClient.POST('/display/draw');

  // @ts-expect-error an app sends no token
  appClient.setToken('token');
}

export function appClientOptionTypes(
  appClient: BusyBarAppClient,
  client: BusyBarClient,
  anyClient: RequestClient,
  options: RequestOptions,
  signal: AbortSignal
) {
  const draw = { application_name: 'app', elements: [] };

  // @ts-expect-error a function takes no `timeout` with the app client
  displayDraw(appClient, draw, { timeout: 1000 });

  // @ts-expect-error nor `signal`
  displayDraw(appClient, draw, { signal });

  // @ts-expect-error nor options from a variable
  displayDraw(appClient, draw, options);

  // @ts-expect-error nor next to the function's own options
  displayScreenFrameGet(appClient, { display: 0 }, { dataType: 'binary', timeout: 1000 });

  // The function's own options stay, with their effect on the result.
  storageRead(appClient, { path: '/ext/a' }, { as_array_buffer: true });
  expectTypeOf(displayScreenFrameGet(appClient, { display: 0 }, { dataType: 'binary' })).resolves.toEqualTypeOf<Uint8Array | undefined>();

  // Any other client takes `timeout` and `signal`.
  displayDraw(client, draw, { timeout: 1000, signal });
  displayDraw(anyClient, draw, options);
  storageRead(client, { path: '/ext/a' }, { as_array_buffer: true, timeout: 1000 });
  expectTypeOf(displayScreenFrameGet(client, { display: 0 }, { dataType: 'binary', timeout: 1000 })).resolves.toEqualTypeOf<Uint8Array | undefined>();
}
