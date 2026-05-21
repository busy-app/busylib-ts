import { BSB_State, BSB_Frame } from 'StateStream/types/schema';
import { Prettify } from 'Global/types.utils';
import { StreamOptions, DEVICE_EVENT_TYPES } from './types.internal';
import { StreamStatus } from './types.status';
import type { ConvertedStateUpdate } from 'StateStream/utils/converters/types';

/**
 * Error codes for StateStream
 */
export enum StateStreamErrorCode {
  CONNECTION_FAILED = 'CONNECTION_FAILED',
  RECONNECT_FAILED = 'RECONNECT_FAILED',
  CONNECTION_LOST = 'CONNECTION_LOST',
  CONNECTION_TIMEOUT = 'CONNECTION_TIMEOUT',
  AUTH_FAILED = 'AUTH_FAILED',
  AUTH_REFRESH_FAILED = 'AUTH_REFRESH_FAILED',
  DEVICE_ERROR = 'DEVICE_ERROR',
  DECODE_ERROR = 'DECODE_ERROR',
  FRAME_PROCESS_ERROR = 'FRAME_PROCESS_ERROR',
  STREAM_ALREADY_STARTED = 'STREAM_ALREADY_STARTED',
  WORKER_INIT_FAILED = 'WORKER_INIT_FAILED',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

/**
 * Custom error class for StateStream with machine-readable codes
 */
export class StateStreamError extends Error {
  constructor(
    public readonly code: StateStreamErrorCode,
    message: string,
    public readonly data?: any
  ) {
    super(message);
    this.name = 'StateStreamError';
  }
}

/**
 * Callbacks for the main thread
 */
export type DataCallback = (data: ProcessedState) => void;
export type RawDataCallback = (data: Uint8Array | string) => void;
export type ErrorCallback = (error: StateStreamError) => void;
export type StatusCallback = (status: StreamStatus) => void;

/**
 * All possible keys in BSB_State.StateUpdate, automatically inferred from the schema.
 */
export type StateUpdateKey = keyof BSB_State.StateUpdate & string;

/**
 * Frame with RGBA support after worker processing
 */
export type ProcessedFrame = Prettify<
  Omit<BSB_Frame.Frame, 'data'> & {
    data?: Uint8Array | Uint8ClampedArray | null;
  }
>;

/**
 * StateUpdate with mapped enum fields and an optional 'state' key identifying the active module.
 */
export type ProcessedUpdate = Prettify<
  Omit<ConvertedStateUpdate, 'frame'> & {
    state?: StateUpdateKey;
    frame?: ProcessedFrame | null;
  }
>;

/**
 * Protobuf State with processed updates.
 */
export type ProcessedSchemaState = Prettify<
  Omit<BSB_State.State, 'updates'> & {
    updates?: ProcessedUpdate[] | null;
  }
>;

/**
 * Final state structure passed to callers.
 */
export type ProcessedState = Prettify<
  ProcessedSchemaState & {
    bar_id?: string;
  }
>;

/**
 * Wrapped structure for Remote mode
 */
export type RemoteState = Prettify<{
  bar_id: string;
  state: ProcessedSchemaState;
}>;

/**
 * Device info from remote server events
 */
export interface RemoteDevice {
  id: string;
  hardware_id: string;
  name: string | null;
}

export type DeviceEventType = (typeof DEVICE_EVENT_TYPES)[number];

export interface DeviceEvent {
  type: DeviceEventType;
  device: RemoteDevice;
}

export type DeviceEventCallback = (event: DeviceEvent) => void;

/**
 * Options for local device connections
 */
export interface LocalStreamOptions extends StreamOptions {}

/**
 * Options for remote connections
 */
export interface RemoteStreamOptions extends StreamOptions {
  addr: string;
  tokenProvider?: () => Promise<string>;
}

/**
 * Global configuration for the stream behavior
 */
export interface StreamConfig {
  /** Connection timeout in milliseconds. Default: 5000ms */
  timeout?: number;
  /** Data inactivity timeout in milliseconds. Default: 15000ms */
  dataTimeout?: number;
  maxReconnectAttempts?: number;
  reconnectDelay?: number;
  workerName?: string;
}

export interface RemoteStreamConfig extends StreamConfig {
  maxAuthAttempts?: number;
}
