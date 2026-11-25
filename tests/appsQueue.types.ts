// Type-level tests of the app queue parameters, checked by `typecheck` and never run.
import { expectTypeOf } from 'vitest';
import { appsQueueAdd, type AppQueueOperationType, type AppQueueRequestOperation, type BusyBarClient } from 'BusyBar/index';

export function requestOperationTypes(client: BusyBarClient) {
  // Every operation type of the schema has its own variant: a new type in the firmware spec fails here until it is added to the union.
  expectTypeOf<AppQueueRequestOperation['type']>().toEqualTypeOf<AppQueueOperationType>();

  appsQueueAdd(client, { operations: [{ app_id: 'app', operation: { type: 'install', url: 'https://example.com/app.tgz' } }] });
  appsQueueAdd(client, { operations: [{ app_id: 'app', operation: { type: 'install', url: 'https://example.com/app.tgz', version: '1.0.0' } }] });
  appsQueueAdd(client, { operations: [{ app_id: 'app', operation: { type: 'remove' } }] });

  // @ts-expect-error installation requires the package URL
  appsQueueAdd(client, { operations: [{ app_id: 'app', operation: { type: 'install' } }] });

  // @ts-expect-error unknown operation type
  appsQueueAdd(client, { operations: [{ app_id: 'app', operation: { type: 'update', url: 'https://example.com/app.tgz' } }] });
}
