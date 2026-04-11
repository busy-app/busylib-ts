import { StateStreamError } from './types';

/**
 * Generic container for status and error, reused across components
 */
export interface StatusComponent<E> {
  status: E;
  lastError?: StateStreamError;
}

/**
 * High-level lifecycle of the StateStream class instance
 */
export enum StreamLifecycle {
  IDLE = 'IDLE',
  STARTING = 'STARTING',
  RUNNING = 'RUNNING',
  STOPPED = 'STOPPED',
  FAILED = 'FAILED'
}

/**
 * Detailed WebSocket connection state
 */
export enum ConnectionStatus {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  RECONNECTING = 'RECONNECTING'
}

/**
 * Authentication progress (Handshake/Token refresh)
 */
export enum AuthStatus {
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  AUTHENTICATING = 'AUTHENTICATING',
  AUTHENTICATED = 'AUTHENTICATED',
  FAILED = 'FAILED'
}

/**
 * Data throughput state
 */
export enum DataStatus {
  NONE = 'NONE',
  ACTIVE = 'ACTIVE',
  STALE = 'STALE'
}

/**
 * Internal Worker/Infrastructure state
 */
export enum WorkerStatus {
  OFF = 'OFF',
  INITIALIZING = 'INITIALIZING',
  READY = 'READY',
  ERROR = 'ERROR'
}

/**
 * The unified StateStream status object
 */
export interface StreamStatus {
  main: StatusComponent<StreamLifecycle>;
  connection: StatusComponent<ConnectionStatus>;
  auth: StatusComponent<AuthStatus>;
  data: StatusComponent<DataStatus> & { lastActivity?: number };
  worker: StatusComponent<WorkerStatus>;
}
