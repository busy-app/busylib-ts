import { 
  StateStreamErrorCode, 
  ProcessedSchemaState, 
  RemoteState 
} from './types';
import { ConnectionStatus, AuthStatus, WorkerStatus } from 'StateStream/types/types.status';

/**
 * Generic container for status and error, reused across components
 */
export type StreamMode = 'local' | 'remote';

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
  | { type: 'START'; addr: string; token?: string; isBinary: boolean; mode: StreamMode }
  | { type: 'STOP' }
  | { type: 'UPDATE_TOKEN'; token: string }
  | { type: 'SUBSCRIBE'; guid: string }
  | { type: 'UNSUBSCRIBE'; guid: string };

/**
 * Worker Events (Sent from worker to main thread)
 */
export type WorkerEvent =
  | { type: 'CONNECTED' }
  | { type: 'DISCONNECTED' }
  | { type: 'TOKEN_EXPIRED' }
  | { type: 'ERROR'; code: StateStreamErrorCode; message: string; data?: any }
  | { type: 'RAW_DATA'; data: Uint8Array | string }
  | { type: 'DATA'; data: ProcessedSchemaState | RemoteState }
  | { type: 'STATUS_UPDATE'; connection?: ConnectionStatus; auth?: AuthStatus; worker?: WorkerStatus };
