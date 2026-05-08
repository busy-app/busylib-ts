import * as protobuf from 'protobufjs';
import { ProcessedFrame, ProcessedSchemaState, StateStreamErrorCode } from 'StateStream/types/types';
import { ConnectionStatus, AuthStatus } from 'StateStream/types/types.status';
import {
  WorkerCommand,
  WorkerEvent,
  StreamMode,
  DEFAULT_MAX_RECONNECT_ATTEMPTS,
  DEFAULT_MAX_AUTH_ATTEMPTS,
  DEFAULT_DELAY_RECONNECT
} from 'StateStream/types/types.internal';
import type { BSB_Frame } from 'StateStream/types/schema';
import bundle from 'StateStream/types/bundle.json';
import { processFrame } from 'StateStream/utils/frame';

// Protobuf setup
const root = protobuf.Root.fromJSON(bundle as protobuf.INamespace);
const StateType = root.lookupType('BSB_State.State');

// Advanced Reconnect Constants
const AUTH_CODE = 3000;
let maxAuthAttempts = DEFAULT_MAX_AUTH_ATTEMPTS;
let maxReconnectAttempts = DEFAULT_MAX_RECONNECT_ATTEMPTS;
let reconnectDelay = DEFAULT_DELAY_RECONNECT;

let socket: WebSocket | null = null;
let isBinaryMode = true;
let currentMode: StreamMode = 'local';
let currentToken: string | undefined = undefined;
let currentAddr: string = '';
let retryCount = 0;
let authRetryCount = 0;
let isAuthReported = false;

type ClientPort = MessagePort | DedicatedWorkerGlobalScope;
const activePorts = new Set<ClientPort>();
// Map from guid to set of ports subscribed to it
const subscriptions = new Map<string, Set<ClientPort>>();
// Queue to process ws messages sequentially
let processingQueue: Promise<void> = Promise.resolve();

/**
 * Broadcasts events to all connected tabs
 */
function broadcast(event: WorkerEvent) {
  for (const port of activePorts) {
    port.postMessage(event);
  }
}

/**
 * Sends authentication token to the server (Remote mode only)
 */
function sendAuth() {
  if (currentMode === 'remote' && currentToken && socket?.readyState === WebSocket.OPEN) {
    broadcast({ type: 'STATUS_UPDATE', auth: AuthStatus.AUTHENTICATING });
    socket.send(JSON.stringify({ token: currentToken }));
  }
}

/**
 * Sends current subscriptions to the server (Remote mode only)
 */
function sendSubscriptions() {
  if (socket?.readyState === WebSocket.OPEN && currentMode === 'remote' && subscriptions.size > 0) {
    socket.send(
      JSON.stringify({
        subscribe: Array.from(subscriptions.keys())
      })
    );
  }
}

/**
 * Stop socket
 */
function stopSocket() {
  if (socket) {
    socket.onopen = null;
    socket.onmessage = null;
    socket.onerror = null;
    socket.onclose = null;

    socket.close();
    socket = null;
  }
}

/**
 * Stop and cleanup connection completely
 */
function stopAndCleanup() {
  stopSocket();
  subscriptions.clear();
  activePorts.clear();
  retryCount = 0;
  authRetryCount = 0;
  isAuthReported = false;
}

/**
 * Connects to the device/proxy
 */
function connect(addr: string, token?: string, isBinary: boolean = true, mode: StreamMode = 'local') {
  stopSocket();

  broadcast({ type: 'STATUS_UPDATE', connection: ConnectionStatus.CONNECTING });

  currentAddr = addr;
  isBinaryMode = isBinary;
  currentMode = mode;
  currentToken = token;
  isAuthReported = false;

  const url = new URL(addr);

  socket = new WebSocket(url.toString());
  socket.binaryType = 'arraybuffer';

  socket.onopen = () => {
    broadcast({ type: 'CONNECTED' });

    // Local mode handshake
    if (currentMode === 'local') {
      socket?.send(JSON.stringify({ enable: true }));
    }

    // Remote mode handshake (Authentication)
    sendAuth();

    // Reset retry counts
    retryCount = 0;
    authRetryCount = 0;
    console.log('[Worker] Connection stable. All retry counters reset.');

    // Restore subscriptions on reconnect for remote mode
    if (currentMode === 'remote' && subscriptions.size > 0) {
      sendSubscriptions();
    }

    // In local mode, we consider auth unnecessary or success by default
    if (currentMode === 'local') {
      broadcast({ type: 'STATUS_UPDATE', auth: AuthStatus.AUTHENTICATED });
    }
  };

  socket.onmessage = (event) => {
    // Queue the processing to prevent race conditions during async decompression
    processingQueue = processingQueue
      .then(async () => {
        try {
          let binaryData: Uint8Array | null = null;
          let rawData: Uint8Array | string = '';
          let barId: string | undefined = undefined;

          if (isBinaryMode) {
            if (event.data instanceof ArrayBuffer) {
              binaryData = new Uint8Array(event.data);
              rawData = binaryData;
            }
          } else {
            // JSON mode: handle JSON { bar_id, state }
            const json = JSON.parse(event.data);
            barId = json.bar_id || json.barId;
            rawData = event.data;

            if (json.state) {
              if (typeof json.state === 'string') {
                binaryData = Uint8Array.from(atob(json.state), (c) => c.charCodeAt(0));
              } else {
                binaryData = new Uint8Array(json.state);
              }
            }

            if (currentMode === 'remote' && !isAuthReported) {
              isAuthReported = true;
              broadcast({ type: 'STATUS_UPDATE', auth: AuthStatus.AUTHENTICATED });
            }
          }

          if (rawData) {
            broadcast({ type: 'RAW_DATA', data: rawData });
          }

          if (binaryData) {
            const message = StateType.decode(binaryData);
            const decodedState = StateType.toObject(message, {
              longs: Number,
              bytes: Uint8Array,
              enums: Number,
              defaults: true
            }) as unknown as ProcessedSchemaState;

            // Handle Server-side errors from Protobuf
            if (decodedState.error) {
              const { cause, severity } = decodedState.error;

              if (cause != null && severity != null) {
                const causeEnum = root.lookupEnum('BSB_Error.Cause');
                const severityEnum = root.lookupEnum('BSB_Error.Severity');

                const causeName = causeEnum.valuesById[cause] || 'UNKNOWN';
                const severityName = severityEnum.valuesById[severity] || 'UNKNOWN';

                broadcast({
                  type: 'ERROR',
                  code: StateStreamErrorCode.DEVICE_ERROR,
                  message: `Server reported ${severityName}: ${causeName}`,
                  data: decodedState.error
                });

                if (severity === severityEnum.values.FATAL) {
                  stopAndCleanup();
                  return;
                }

                if (severity === severityEnum.values.ERROR) {
                  return;
                }
              } else {
                broadcast({
                  type: 'ERROR',
                  code: StateStreamErrorCode.DEVICE_ERROR,
                  message: 'Server reported an unspecified application error',
                  data: decodedState.error
                });
              }
            }

            // Process frames in updates
            if (decodedState.updates) {
              for (const update of decodedState.updates) {
                const frame = update.frame as ProcessedFrame | null | undefined;
                if (frame && frame.data) {
                  try {
                    const rgba = await processFrame(frame as unknown as BSB_Frame.Frame);
                    if (rgba) {
                      frame.data = rgba;
                    }
                  } catch (frameErr) {
                    broadcast({
                      type: 'ERROR',
                      code: StateStreamErrorCode.FRAME_PROCESS_ERROR,
                      message: frameErr instanceof Error ? frameErr.message : String(frameErr),
                      data: frame.data
                    });
                  }
                }
              }
            }

            if (currentMode === 'remote' && barId) {
              broadcast({
                type: 'DATA',
                data: { bar_id: barId, state: decodedState }
              });
            } else {
              broadcast({ type: 'DATA', data: decodedState });
            }
          }
        } catch (e) {
          broadcast({
            type: 'ERROR',
            code: StateStreamErrorCode.DECODE_ERROR,
            message: `Decode error: ${String(e)}`,
            data: event.data
          });
        }
      })
      .catch(console.error);
  };

  socket.onerror = () => {
    broadcast({ type: 'ERROR', code: StateStreamErrorCode.CONNECTION_FAILED, message: 'WebSocket connection error' });
  };

  socket.onclose = (e) => {
    console.log('[Worker] Socket closed:', e);

    if (!socket || activePorts.size === 0) {
      console.log('[Worker] Connection closed or no active ports. No retries.');
      return;
    }

    if (e.code === AUTH_CODE && currentMode === 'remote') {
      if (authRetryCount < maxAuthAttempts) {
        authRetryCount++;
        console.warn(`[Worker] Auth failed (3000). Requesting new token... (Attempt ${authRetryCount}/${maxAuthAttempts})`);
        broadcast({ type: 'TOKEN_EXPIRED' });
        broadcast({ type: 'STATUS_UPDATE', auth: AuthStatus.REAUTHENTICATING, authAttempts: authRetryCount });
      } else {
        broadcast({ type: 'STATUS_UPDATE', auth: AuthStatus.FAILED });
        broadcast({
          type: 'ERROR',
          code: StateStreamErrorCode.AUTH_FAILED,
          message: `Maximum authentication attempts (${maxAuthAttempts}) reached. Please log in again.`
        });
      }
      return;
    }

    if (e.code !== 1000) {
      if (retryCount < maxReconnectAttempts) {
        retryCount++;
        let delay = Math.min(1000 * retryCount, 5000);

        if (reconnectDelay) {
          delay = reconnectDelay;
        }

        console.log(`[Worker] Reconnecting (network code: ${e.code}) in ${delay}ms... (Attempt ${retryCount}/${maxReconnectAttempts})`);

        broadcast({ type: 'STATUS_UPDATE', connection: ConnectionStatus.RECONNECTING, connectionAttempts: retryCount });
        setTimeout(() => {
          if (activePorts.size > 0 && socket) {
            connect(currentAddr, currentToken, isBinaryMode, currentMode);
          }
        }, delay);
      } else {
        broadcast({ type: 'STATUS_UPDATE', connection: ConnectionStatus.DISCONNECTED });
        broadcast({
          type: 'ERROR',
          code: StateStreamErrorCode.RECONNECT_FAILED,
          message: `Maximum reconnection attempts (${maxReconnectAttempts}) reached. Connection lost.`
        });
      }
      return;
    }

    broadcast({ type: 'DISCONNECTED' });
    broadcast({
      type: 'ERROR',
      code: StateStreamErrorCode.CONNECTION_LOST,
      message: `Stream closed with unexpected code: ${e.code}. Stopping stream.`
    });
  };
}

/**
 * Main command handler
 */
function handleCommand(cmd: WorkerCommand, port: ClientPort) {
  switch (cmd.type) {
    case 'START':
      maxAuthAttempts = cmd.maxAuthAttempts ?? DEFAULT_MAX_AUTH_ATTEMPTS;
      maxReconnectAttempts = cmd.maxReconnectAttempts ?? DEFAULT_MAX_RECONNECT_ATTEMPTS;
      reconnectDelay = cmd.reconnectDelay ?? DEFAULT_DELAY_RECONNECT;

      activePorts.add(port);
      if (socket && socket.readyState === WebSocket.OPEN && currentAddr === cmd.addr) {
        // Already connected to this address. Just send immediately.
        port.postMessage({ type: 'CONNECTED' });
        port.postMessage({ type: 'STATUS_UPDATE', auth: AuthStatus.AUTHENTICATED });
      } else {
        connect(cmd.addr, cmd.token, cmd.isBinary, cmd.mode);
      }
      break;

    case 'STOP':
      activePorts.delete(port);
      for (const [guid, portSet] of subscriptions.entries()) {
        portSet.delete(port);
        if (portSet.size === 0) {
          subscriptions.delete(guid);
          if (socket?.readyState === WebSocket.OPEN && currentMode === 'remote') {
            socket.send(JSON.stringify({ unsubscribe: [guid] }));
          }
        }
      }

      port.postMessage({ type: 'STATUS_UPDATE', connection: ConnectionStatus.DISCONNECTED });

      if (activePorts.size === 0) {
        stopAndCleanup();
      }
      break;

    case 'UPDATE_TOKEN':
      const oldToken = currentToken;
      currentToken = cmd.token;

      if (currentMode === 'remote') {
        const isOpen = socket && socket.readyState === WebSocket.OPEN;
        if (isOpen && oldToken === cmd.token) {
          return;
        }

        if (isOpen) {
          sendAuth();
        } else if (oldToken !== cmd.token && currentAddr && activePorts.size > 0) {
          connect(currentAddr, currentToken, isBinaryMode, currentMode);
        }
      }
      break;

    case 'SUBSCRIBE':
      let subSet = subscriptions.get(cmd.guid);
      if (!subSet) {
        subSet = new Set();
        subscriptions.set(cmd.guid, subSet);
      }
      const isNew = subSet.size === 0;
      subSet.add(port);

      if (isNew && socket?.readyState === WebSocket.OPEN && currentMode === 'remote') {
        socket.send(JSON.stringify({ subscribe: [cmd.guid] }));
      }
      break;

    case 'UNSUBSCRIBE':
      const unsubSet = subscriptions.get(cmd.guid);
      if (unsubSet) {
        unsubSet.delete(port);
        if (unsubSet.size === 0) {
          subscriptions.delete(cmd.guid);
          if (socket?.readyState === WebSocket.OPEN && currentMode === 'remote') {
            socket.send(JSON.stringify({ unsubscribe: [cmd.guid] }));
          }
        }
      }
      break;
  }
}

// Support for SharedWorker
if ('SharedWorkerGlobalScope' in self) {
  const sharedSelf = self as unknown as SharedWorkerGlobalScope;
  sharedSelf.onconnect = (e: MessageEvent) => {
    const port = e.ports[0];
    if (port) {
      port.onmessage = (ev) => handleCommand(ev.data as WorkerCommand, port);
      port.start();
    }
  };
} else {
  // Support for DedicatedWorker
  const dedicatedSelf = self as unknown as DedicatedWorkerGlobalScope;
  dedicatedSelf.onmessage = (e: MessageEvent<WorkerCommand>) => {
    handleCommand(e.data, dedicatedSelf);
  };
}
