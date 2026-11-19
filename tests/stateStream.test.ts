// Decoding of the state stream messages the queue UI relies on: app queue progress is state-like and may be dropped,
// completion results are event-like and must be mapped exactly, including the OK and CANCELLED values.
import * as protobuf from 'protobufjs';
import { describe, expect, test } from 'vitest';
import bundle from 'StateStream/types/bundle.json';
import { convertStateUpdate } from 'StateStream/utils/converters';
import { BSB_State } from 'StateStream/types/schema';

const root = protobuf.Root.fromJSON(bundle as protobuf.INamespace);
const StateType = root.lookupType('BSB_State.State');

// The same decode the state stream worker does, so field presence is tested as the library receives it.
function decode(updates: Record<string, unknown>[]): BSB_State.State {
  return StateType.toObject(StateType.decode(StateType.encode(StateType.create({ updates })).finish()), {
    longs: Number,
    bytes: Uint8Array,
    enums: Number,
    defaults: true
  }) as BSB_State.State;
}

function stateKey(update: BSB_State.StateUpdate): string | undefined {
  return Object.keys(update).find((key) => update[key as keyof typeof update] != null);
}

describe('app queue state', () => {
  test('progress without a total size keeps the field absent', () => {
    const update = decode([{ appQueueState: { detail: { itemId: 3, step: 'unpacking' } } }]).updates![0]!;

    expect(stateKey(update)).toBe('appQueueState');
    expect(convertStateUpdate(update).appQueueState).toEqual({ detail: { itemId: 3, step: 'unpacking' } });
  });

  test('download progress is passed through', () => {
    const update = decode([{ appQueueState: { detail: { itemId: 3, step: 'downloading', progress: 55 } } }]).updates![0]!;

    expect(convertStateUpdate(update).appQueueState?.detail?.progress).toBe(55);
  });
});

describe('app queue event', () => {
  const expected: Record<number, string> = {
    [BSB_State.AppQueueError.OK]: 'ok',
    [BSB_State.AppQueueError.DOWNLOAD]: 'download',
    [BSB_State.AppQueueError.UNPACK]: 'unpack',
    [BSB_State.AppQueueError.MANIFEST]: 'manifest',
    [BSB_State.AppQueueError.API_VERSION]: 'api_version',
    [BSB_State.AppQueueError.STORAGE]: 'storage',
    [BSB_State.AppQueueError.TIMEOUT]: 'timeout',
    [BSB_State.AppQueueError.NOT_FOUND]: 'not_found',
    [BSB_State.AppQueueError.QUEUE_FULL]: 'queue_full',
    [BSB_State.AppQueueError.CANCELLED]: 'cancelled',
    [BSB_State.AppQueueError.APP_RUNNING]: 'app_running',
    [BSB_State.AppQueueError.PARAMETER]: 'parameter',
    [BSB_State.AppQueueError.INTERNAL]: 'internal'
  };

  test.each(Object.entries(expected))('error %s is mapped', (error, name) => {
    const update = decode([{ appQueueEvent: { result: { itemId: 7, error: Number(error) } } }]).updates![0]!;

    expect(stateKey(update)).toBe('appQueueEvent');
    expect(convertStateUpdate(update).appQueueEvent?.result).toEqual({ itemId: 7, error: name });
  });
});
