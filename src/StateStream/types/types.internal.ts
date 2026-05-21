import { BSB_State } from 'StateStream/types/schema';
import { Prettify } from 'Global/types.utils';
import { StateStreamErrorCode, DeviceEvent } from './types';

export type RawSchemaState = Prettify<
  Omit<BSB_State.State, 'updates'> & {
    updates?: BSB_State.StateUpdate[] | null;
  }
>;

export type RawRemoteState = Prettify<{
  bar_id: string;
  state: RawSchemaState;
}>;

import { ConnectionStatus, AuthStatus, WorkerStatus } from 'StateStream/types/types.status';

export const DEVICE_EVENT_TYPES = ['device.linked', 'device.name-updated', 'device.unlinked'] as const;

/**
 * Generic container for status and error, reused across components
 */
export type StreamMode = 'local' | 'remote';

export const DEFAULT_MAX_RECONNECT_ATTEMPTS = 5;
export const DEFAULT_MAX_AUTH_ATTEMPTS = 5;
export const DEFAULT_DELAY_RECONNECT = 500;

/**
 * Base internal options for connections
 */
export interface StreamOptions {
  addr?: string;
  token?: string;
  isBinary?: boolean;
}

/**
 * Worker Commands (Sent from main thread to worker)
 */
export type WorkerCommand =
  | {
      type: 'START';
      addr: string;
      token?: string;
      isBinary: boolean;
      mode: StreamMode;
      maxReconnectAttempts: number;
      maxAuthAttempts: number;
      reconnectDelay: number;
      workerName?: string;
    }
  | { type: 'STOP' }
  | { type: 'UPDATE_TOKEN'; token: string }
  | { type: 'SUBSCRIBE'; guid: string }
  | { type: 'UNSUBSCRIBE'; guid: string }
  | { type: 'GET_WORKER_NAME' };

/**
 * Worker Events (Sent from worker to main thread)
 */
export type WorkerEvent =
  | { type: 'CONNECTED' }
  | { type: 'DISCONNECTED' }
  | { type: 'STOPPED'; wasClean: boolean; error?: string }
  | { type: 'TOKEN_EXPIRED' }
  | { type: 'ERROR'; code: StateStreamErrorCode; message: string; data?: any }
  | { type: 'RAW_DATA'; data: Uint8Array | string }
  | { type: 'DATA'; data: RawSchemaState | RawRemoteState }
  | { type: 'DEVICE_EVENT'; data: DeviceEvent }
  | { type: 'WORKER_NAME'; workerName: string | undefined }
  | {
      type: 'STATUS_UPDATE';
      connection?: ConnectionStatus;
      connectionAttempts?: number;
      auth?: AuthStatus;
      authAttempts?: number;
      worker?: WorkerStatus;
    };
