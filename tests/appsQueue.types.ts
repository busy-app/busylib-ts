// Type-level tests of the app queue parameters, checked by `typecheck` and never run.
import { expectTypeOf } from 'vitest';
import {
  appsQueueAdd,
  type AppQueueDetail,
  type AppQueueOperationType,
  type AppQueueRequestOperation,
  type AppQueueStep,
  type BusyBarClient
} from 'BusyBar/index';
import type { AppQueueResultError, ProcessedUpdate } from 'StateStream/index';

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

export function streamTypes() {
  type RunError = NonNullable<NonNullable<NonNullable<ProcessedUpdate['appQueueEvent']>['result']>['error']>;
  type StreamStep = NonNullable<NonNullable<NonNullable<ProcessedUpdate['appQueueState']>['detail']>['step']>;

  // The result error of the state stream is exported under its own name.
  expectTypeOf<RunError>().toEqualTypeOf<AppQueueResultError>();
  expectTypeOf<'ok'>().toExtend<AppQueueResultError>();
  // @ts-expect-error enqueue errors are not run errors
  expectTypeOf<'skipped'>().toExtend<AppQueueResultError>();

  // The stream and `appsQueueGet` share the step type: known steps and any other string.
  expectTypeOf<StreamStep>().toEqualTypeOf<NonNullable<AppQueueStep>>();
  expectTypeOf<AppQueueDetail['step']>().toEqualTypeOf<AppQueueStep>();
  expectTypeOf<'unpacking'>().toExtend<AppQueueStep>();
  expectTypeOf<'verifying'>().toExtend<AppQueueStep>();
}
