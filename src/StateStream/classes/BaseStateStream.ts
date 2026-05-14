import {
  DataCallback,
  RawDataCallback,
  ErrorCallback,
  StatusCallback,
  DeviceEventCallback,
  ProcessedState,
  ProcessedSchemaState,
  StateUpdateKey,
  RemoteState,
  StateStreamError,
  StateStreamErrorCode,
  StreamConfig
} from 'StateStream/types/types';
import { StreamStatus, StreamLifecycle, ConnectionStatus, AuthStatus, DataStatus, WorkerStatus } from 'StateStream/types/types.status';
import {
  WorkerCommand,
  WorkerEvent,
  StreamMode,
  StreamOptions,
  DEFAULT_MAX_RECONNECT_ATTEMPTS,
  DEFAULT_MAX_AUTH_ATTEMPTS,
  DEFAULT_DELAY_RECONNECT
} from 'StateStream/types/types.internal';

import StateWorker from '../worker/index.worker?worker&inline';
import StateSharedWorker from '../worker/index.worker?sharedworker&inline';

/**
 * Interface to unify SharedWorker and DedicatedWorker handling
 */
interface StreamWorker {
  port: MessagePort | Worker;
  terminate?: () => void;
}

/**
 * Base class for all StateStream connections.
 * Orchestrates worker communication and callback management.
 */
export abstract class BaseStateStream {
  protected addr: string;
  protected token?: string;
  protected isBinary: boolean;
  protected connectTimeout: number;
  protected dataTimeout: number;
  protected maxReconnectAttempts: number;
  protected maxAuthAttempts: number;
  protected reconnectDelay: number;
  protected abstract streamMode: StreamMode;

  private worker: StreamWorker | null = null;
  private connectionTimer: ReturnType<typeof setTimeout> | null = null;
  private dataTimer: ReturnType<typeof setTimeout> | null = null;

  private _status: StreamStatus;
  public get status(): StreamStatus {
    return this._status;
  }

  /** Static map to deduplicate token refresh requests across all instances in this JS context */
  private static tokenRefreshPromises = new Map<string, Promise<string>>();

  // Callbacks
  protected dataCallback?: DataCallback;
  protected rawDataCallback?: RawDataCallback;
  protected errorCallback?: ErrorCallback;
  protected statusCallback?: StatusCallback;
  protected deviceEventCallback?: DeviceEventCallback;

  constructor(options: StreamOptions, config?: StreamConfig) {
    this.addr = options.addr || '';
    this.token = options.token;
    this.isBinary = options.isBinary ?? true;
    this.connectTimeout = config?.timeout ?? 5000;
    this.dataTimeout = config?.dataTimeout ?? 15000;
    this.maxReconnectAttempts = config?.maxReconnectAttempts ?? DEFAULT_MAX_RECONNECT_ATTEMPTS;
    this.maxAuthAttempts = DEFAULT_MAX_AUTH_ATTEMPTS;
    this.reconnectDelay = config?.reconnectDelay ?? DEFAULT_DELAY_RECONNECT;

    // Initialize default status
    this._status = {
      main: { status: StreamLifecycle.IDLE },
      connection: { status: ConnectionStatus.DISCONNECTED },
      auth: { status: AuthStatus.UNAUTHENTICATED },
      data: { status: DataStatus.NONE },
      worker: { status: WorkerStatus.OFF }
    };
  }

  /**
   * Transforms http/https to ws/wss and prefixes with auto-inferred protocol if no protocol present.
   */
  protected resolveProtocol(addr: string): string {
    let normalized = addr.trim();
    if (normalized.startsWith('https://')) {
      return normalized.replace('https://', 'wss://');
    }
    if (normalized.startsWith('http://')) {
      return normalized.replace('http://', 'ws://');
    }
    if (normalized.startsWith('wss://') || normalized.startsWith('ws://')) {
      return normalized;
    }

    // No protocol provided, infer from current page
    let protocol = 'ws:';
    if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
      protocol = 'wss:';
    }

    return `${protocol}//${normalized}`;
  }

  /**
   * Starts the stream connection.
   * Throws an error if already running.
   */
  public start({
    dataCallback,
    rawDataCallback,
    errorCallback,
    statusCallback
  }: {
    dataCallback?: DataCallback;
    rawDataCallback?: RawDataCallback;
    errorCallback?: ErrorCallback;
    statusCallback?: StatusCallback;
  } = {}): void {
    if (this._status.main.status === StreamLifecycle.STARTING || this._status.main.status === StreamLifecycle.RUNNING) {
      const error = new StateStreamError(StateStreamErrorCode.STREAM_ALREADY_STARTED, 'StateStream is already running. Call stop() before starting again.');

      if (statusCallback) {
        statusCallback({
          ...this._status,
          main: { ...this._status.main, lastError: error }
        });
      }

      if (errorCallback) {
        errorCallback(error);
      } else {
        throw error;
      }
      return;
    }

    this.dataCallback = dataCallback;
    this.rawDataCallback = rawDataCallback;
    this.errorCallback = errorCallback;
    this.statusCallback = statusCallback;

    // Trigger immediate status update to STARTING
    this.updateStatusComponent('main', { status: StreamLifecycle.STARTING, lastError: undefined });

    try {
      this.ensureWorker();

      // Tell worker to connect
      this.sendCommand({
        type: 'START',
        addr: this.normalizeUrl(this.addr),
        token: this.token,
        isBinary: this.isBinary,
        mode: this.streamMode,
        maxReconnectAttempts: this.maxReconnectAttempts,
        maxAuthAttempts: this.maxAuthAttempts,
        reconnectDelay: this.reconnectDelay
      });

      // Start connection timeout timer
      this.clearConnectionTimer();
      this.connectionTimer = setTimeout(() => {
        const error = new StateStreamError(StateStreamErrorCode.CONNECTION_TIMEOUT, `Connection timed out after ${this.connectTimeout}ms`);
        this.mapErrorToStatus(error);
        if (this.errorCallback) {
          this.errorCallback(error);
        }
        this.stop();
      }, this.connectTimeout);
    } catch (e) {
      const error = e instanceof StateStreamError ? e : new StateStreamError(StateStreamErrorCode.UNKNOWN_ERROR, String(e));
      if (this.errorCallback) {
        this.errorCallback(error);
      }
    }
  }

  /**
   * Stops the stream connection.
   */
  public stop(): void {
    this.clearConnectionTimer();
    this.clearDataTimer();

    if (this._status.main.status === StreamLifecycle.IDLE || this._status.main.status === StreamLifecycle.STOPPED) {
      return;
    }

    this.updateStatusComponent('main', { status: StreamLifecycle.STOPPED });
    this.updateStatusComponent('connection', { status: ConnectionStatus.DISCONNECTED });

    this.sendCommand({ type: 'STOP' });
    this.clearCallbacks();
  }

  /**
   * Cleans up all resources.
   */
  public destroy(): void {
    this.stop();
    if (this.worker) {
      if (this.worker.terminate) {
        this.worker.terminate();
      } else if ('close' in this.worker.port) {
        (this.worker.port as MessagePort).close();
      }
      this.worker = null;
    }
  }

  /**
   * Clears all registered callbacks.
   */
  private clearCallbacks(): void {
    this.dataCallback = undefined;
    this.rawDataCallback = undefined;
    this.errorCallback = undefined;
    this.statusCallback = undefined;
    this.deviceEventCallback = undefined;
  }

  /**
   * Sends a new token to the worker (for auth or token refresh).
   */
  protected sendToken(token: string): void {
    this.token = token;
    this.sendCommand({ type: 'UPDATE_TOKEN', token });
  }

  /**
   * Subclasses must provide their own URL normalization.
   */
  protected abstract normalizeUrl(addr: string): string;

  /**
   * Sends a command to the worker port.
   */
  protected sendCommand(cmd: WorkerCommand): void {
    if (this.worker) {
      this.worker.port.postMessage(cmd);
    }
  }

  private ensureWorker(): void {
    if (this.worker || typeof window === 'undefined') return;

    // Use btoa(addr) as name to share connection across tabs for the same device
    const workerName = btoa(this.addr);

    try {
      this.updateStatusComponent('worker', { status: WorkerStatus.INITIALIZING, lastError: undefined });

      if (window.SharedWorker) {
        const sw = new StateSharedWorker({
          name: workerName
        });
        this.worker = {
          port: sw.port
        };
        sw.port.onmessage = (e: MessageEvent<WorkerEvent>) => {
          this.handleWorkerMessage(e.data);
        };
        sw.port.start();
      } else {
        // Fallback to Dedicated Worker
        const dw = new StateWorker();
        this.worker = {
          port: dw,
          terminate: () => dw.terminate()
        };
        dw.onmessage = (e: MessageEvent<WorkerEvent>) => {
          this.handleWorkerMessage(e.data);
        };
      }

      this.updateStatusComponent('worker', { status: WorkerStatus.READY });
    } catch (e) {
      const error = new StateStreamError(StateStreamErrorCode.WORKER_INIT_FAILED, `Failed to initialize worker: ${String(e)}`);
      this.updateStatusComponent('worker', { status: WorkerStatus.ERROR, lastError: error });
      this.updateStatusComponent('main', { status: StreamLifecycle.FAILED, lastError: error });
      throw error;
    }
  }

  /**
   * Processes messages from the worker.
   */
  protected handleWorkerMessage(event: WorkerEvent): void {
    switch (event.type) {
      case 'DATA':
        this.resetDataTimer();
        if (this.dataCallback) {
          this.dataCallback(this.normalizeState(event.data));
        }
        break;
      case 'RAW_DATA':
        this.resetDataTimer();
        if (this.rawDataCallback) {
          this.rawDataCallback(event.data);
        }
        break;
      case 'CONNECTED':
        this.clearConnectionTimer();
        this.updateStatusComponent('connection', { status: ConnectionStatus.CONNECTED });

        // In local mode, CONNECTED is enough to be RUNNING
        if (this.streamMode === 'local') {
          this.updateStatusComponent('main', { status: StreamLifecycle.RUNNING });
        }
        break;
      case 'STATUS_UPDATE':
        if (event.connection) {
          const patch: Partial<typeof this._status.connection> = {
            status: event.connection,
            attempts: event.connection === ConnectionStatus.RECONNECTING ? event.connectionAttempts : undefined
          };
          this.updateStatusComponent('connection', patch);
        }
        if (event.auth) {
          const patch: Partial<typeof this._status.auth> = {
            status: event.auth,
            attempts: event.auth === AuthStatus.REAUTHENTICATING ? event.authAttempts : undefined
          };
          this.updateStatusComponent('auth', patch);
          // In remote mode, reaching AUTHENTICATED means we are RUNNING
          if (event.auth === AuthStatus.AUTHENTICATED) {
            this.updateStatusComponent('main', { status: StreamLifecycle.RUNNING });
          }
        }
        break;
      case 'ERROR': {
        this.clearConnectionTimer();
        const error = new StateStreamError(event.code, event.message, event.data);

        // Map error to specific component status
        this.mapErrorToStatus(error);

        if (this.errorCallback) {
          this.errorCallback(error);
        }
        break;
      }
      case 'TOKEN_EXPIRED':
        this.updateStatusComponent('auth', { status: AuthStatus.AUTHENTICATING });
        this.handleTokenExpiredInternal();
        break;
      case 'DISCONNECTED':
        this.updateStatusComponent('connection', { status: ConnectionStatus.DISCONNECTED });
        break;
      case 'DEVICE_EVENT':
        if (this.deviceEventCallback) {
          this.deviceEventCallback(event.data);
        }
        break;
    }
  }

  /**
   * Maps an error code to the corresponding status component
   */
  private mapErrorToStatus(error: StateStreamError): void {
    const code = error.code;

    // 1. Connection errors
    if (
      code === StateStreamErrorCode.CONNECTION_FAILED ||
      code === StateStreamErrorCode.CONNECTION_LOST ||
      code === StateStreamErrorCode.RECONNECT_FAILED ||
      code === StateStreamErrorCode.CONNECTION_TIMEOUT
    ) {
      this.updateStatusComponent('connection', { status: ConnectionStatus.DISCONNECTED, lastError: error });
      this.updateStatusComponent('main', { status: StreamLifecycle.FAILED, lastError: error });
    }

    // 2. Auth errors
    if (code === StateStreamErrorCode.AUTH_FAILED || code === StateStreamErrorCode.AUTH_REFRESH_FAILED) {
      this.updateStatusComponent('auth', { status: AuthStatus.FAILED, lastError: error });
      this.updateStatusComponent('main', { status: StreamLifecycle.FAILED, lastError: error });
    }

    // 3. Device/Internal errors
    if (code === StateStreamErrorCode.DEVICE_ERROR || code === StateStreamErrorCode.DECODE_ERROR) {
      this.updateStatusComponent('main', { lastError: error });
    }
  }

  /**
   * Updates a single component of the status and notifies listeners
   */
  private updateStatusComponent<K extends keyof StreamStatus>(key: K, patch: Partial<StreamStatus[K]>): void {
    const component = this._status[key];
    const merged = { ...component, ...patch };

    (Object.keys(merged) as Array<keyof typeof merged>).forEach((k) => {
      if (merged[k] === undefined) {
        delete merged[k];
      }
    });

    // Merge patch into the component
    this._status[key] = merged;

    // Trigger callback
    if (this.statusCallback) {
      this.statusCallback({ ...this._status });
    }
  }

  /**
   * Safe timer cleanup
   */
  private clearConnectionTimer(): void {
    if (this.connectionTimer) {
      clearTimeout(this.connectionTimer);
      this.connectionTimer = null;
    }
  }

  /**
   * Reset the data inactivity timer
   */
  private resetDataTimer(): void {
    this.clearDataTimer();

    // Update data status to ACTIVE if it wasn't
    if (this._status.data.status !== DataStatus.ACTIVE) {
      this.updateStatusComponent('data', {
        status: DataStatus.ACTIVE,
        lastActivity: Date.now()
      });
    } else {
      // Just update activity timestamp without triggering statusCallback spam
      this._status.data.lastActivity = Date.now();
    }

    this.dataTimer = setTimeout(() => {
      this.updateStatusComponent('data', { status: DataStatus.STALE });
    }, this.dataTimeout);
  }

  private clearDataTimer(): void {
    if (this.dataTimer) {
      clearTimeout(this.dataTimer);
      this.dataTimer = null;
    }
  }
  /**
   * Normalizes the raw state from the worker into a ProcessedState for the UI.
   * Extracts the 'state' key for each update and merges bar_id for remote mode.
   */
  private normalizeState(payload: ProcessedSchemaState | RemoteState): ProcessedState {
    let baseState: ProcessedSchemaState;
    let barId: string | undefined;

    if ('bar_id' in payload && 'state' in payload) {
      // Remote mode
      baseState = payload.state;
      barId = payload.bar_id;
    } else {
      // Local mode
      baseState = payload;
    }

    // Process updates to add the 'state' key non-destructively
    let normalizedUpdates = baseState.updates;
    if (normalizedUpdates) {
      normalizedUpdates = normalizedUpdates.map((update) => {
        // Dynamically find the first key that has a value (this will be our 'state')
        const stateKey = Object.keys(update).find((key) => update[key as keyof typeof update] != null) as StateUpdateKey | undefined;

        // Ensure we clone deep enough or reconstruct correctly without overwriting internal array ref
        return {
          ...update,
          state: stateKey
        };
      });
    }

    return {
      ...baseState,
      updates: normalizedUpdates,
      bar_id: barId
    } as ProcessedState;
  }

  /**
   * Internally deduplicates token refresh requests for the same address.
   */
  private async handleTokenExpiredInternal(): Promise<void> {
    const addr = this.addr;
    let promise = BaseStateStream.tokenRefreshPromises.get(addr);

    if (!promise && this.onTokenExpired) {
      const refresh = async () => {
        try {
          const result = this.onTokenExpired!();
          return result instanceof Promise ? await result : '';
        } finally {
          BaseStateStream.tokenRefreshPromises.delete(addr);
        }
      };
      promise = refresh();
      BaseStateStream.tokenRefreshPromises.set(addr, promise);
    }

    if (promise) {
      const newToken = await promise;
      if (newToken) {
        this.sendToken(newToken);
      }
    }
  }

  /**
   * Hook for handling token expiration.
   * Return a promise with the new token to enable deduplication.
   */
  protected onTokenExpired?(): Promise<string> | void;
}
