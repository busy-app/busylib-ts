// Type-level tests of the core request methods, checked by `typecheck` (tsconfig.test.json) and never run.
import { expectTypeOf } from 'vitest';
import type { components } from 'Global/API';
import type { BusyBarClient } from 'BusyBar/client/BusyBarClient';
import type { version, status } from 'BusyBar-old/api/system';
import type { draw, getScreenFrame } from 'BusyBar-old/api/display';
import type { read } from 'BusyBar-old/api/storage';

type OldData<F extends (...args: never[]) => Promise<unknown>> = Awaited<ReturnType<F>>;

export function responseTypes(client: BusyBarClient) {
  // Same data types as the old api functions returned.
  expectTypeOf(client.GET('/version')).resolves.toEqualTypeOf<OldData<typeof version>>();
  expectTypeOf(client.GET('/status')).resolves.toEqualTypeOf<OldData<typeof status>>();
  expectTypeOf(client.POST('/display/draw', { body: { application_name: 'app', elements: [] } })).resolves.toEqualTypeOf<OldData<typeof draw>>();

  // `parseAs` changes the data type.
  expectTypeOf(client.GET('/screen', { params: { query: { display: 0 } }, parseAs: 'blob' })).resolves.toEqualTypeOf<Blob>();
  expectTypeOf(client.GET('/storage/read', { params: { query: { path: '/ext/a' } }, parseAs: 'arrayBuffer' })).resolves.toEqualTypeOf<ArrayBuffer>();

  // `request` is the same as the method shortcuts.
  expectTypeOf(client.request('GET', '/version')).resolves.toEqualTypeOf<components['schemas']['VersionInfo']>();
  expectTypeOf(client.request('POST', '/display/draw', { body: { application_name: 'app', elements: [] } })).resolves.toEqualTypeOf<OldData<typeof draw>>();
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

export function oldTypesStillMatch() {
  // Keeps the imports used: the old types are only referenced via `typeof`.
  expectTypeOf<OldData<typeof getScreenFrame>>().not.toBeNever();
  expectTypeOf<OldData<typeof read>>().not.toBeNever();
}
