import { AUTH_CODE, RECONNECT_CODES } from 'Global/webSocketConfig';
import type { KeyName, KeyValue, DataListener, StopListener, ErrorListener, ErrorPayload, ApiKey, ApiSemver } from 'Global/types';

import { DEFAULT_DEVICE_URL } from 'Global/constants';

import { isIPv4 } from 'Global/utils/isIPv4';
import { isMdns } from 'Global/utils/isMdns';
import { isBrowser } from 'Global/utils/isBrowser';

export interface InputConfig {
  addr?: string;
  apiKey?: ApiKey;
  apiSemver?: ApiSemver;
}

export class Input {
  public readonly addr: string;
  connected: boolean = false;

  // @ts-ignore
  private apiKey?: ApiKey;
  // @ts-ignore
  private apiSemver?: ApiSemver;

  private inputEvent: Partial<Record<KeyName, KeyValue>>;

  private dataListeners: DataListener[] = [];
  private stopListeners: StopListener[] = [];
  private errorListeners: ErrorListener[] = [];

  private socket: WebSocket | null = null;

  constructor(config?: InputConfig) {
    if (!isBrowser()) {
      throw new Error('not browser');
    }

    if (config?.apiKey) {
      this.apiKey = config.apiKey;
    }

    if (config?.apiSemver) {
      this.apiSemver = config.apiSemver;
    }

    if (!config || !config.addr) {
      this.addr = DEFAULT_DEVICE_URL;
    } else {
      let addr = config.addr.trim();

      if (!/^https?:\/\//i.test(addr)) {
        addr = `http://${addr}`;
      }

      try {
        const url = new URL(addr);
        const hostname = url.hostname;

        if (!isIPv4(hostname) && !isMdns(hostname)) {
          throw new Error(`Invalid address: "${config.addr}". Only IP addresses and mDNS names (ending in .local) are supported.`);
        }
      } catch (e) {
        throw e instanceof Error && e.message.startsWith('Invalid address') ? e : new Error(`Invalid URL format: "${config.addr}"`);
      }

      this.addr = addr;
    }

    this.inputEvent = {};
  }

  onData(listener: DataListener) {
    this.dataListeners.push(listener);
  }

  onStop(listener: StopListener) {
    this.stopListeners.push(listener);
  }

  onError(listener: ErrorListener) {
    this.errorListeners.push(listener);
  }

  protected emitData(data: Uint8Array) {
    for (const listener of this.dataListeners) {
      listener(data);
    }
  }

  protected emitStop() {
    for (const listener of this.stopListeners) {
      listener();
    }
  }

  protected emitError(payload: ErrorPayload) {
    for (const errorListener of this.errorListeners) {
      errorListener(payload);
    }
  }

  async openWebsocket() {
    if (this.socket) {
      await this.closeWebsocket();
    }

    const wsUrl = new URL(`${this.addr}/api/input`);

    if (this.apiKey) {
      wsUrl.searchParams.append('x-api-token', this.apiKey);
    }

    if (this.apiSemver) {
      wsUrl.searchParams.append('x-api-sem-ver', this.apiSemver);
    }

    if (!wsUrl) {
      throw new Error('The WebSocket URL is not specified');
    }

    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => {
      if (!this.socket) {
        return;
      }
      this.connected = true;
    };

    this.socket.binaryType = 'arraybuffer';
    this.socket.onmessage = (event) => {
      try {
        if (typeof event.data === 'string') {
          // console.log("WebSocket message", event);
          return;
        }

        // Process the binary data
        const rawData = new Uint8Array(event.data);
        this.emitData(rawData);
      } catch (event) {
        // console.error("Error parsing input", event);
        this.connected = false;
        this.emitStop();
      }
    };

    this.socket.onerror = (event) => {
      // console.error("WebSocket error", event);
      this.connected = false;
      this.emitError({
        code: 1006, // Standard «abnormal closure» code per RFC-6455
        message: 'WebSocket error occurred',
        raw: event
      });
      this.emitStop();
    };

    this.socket.onclose = async (event) => {
      // console.log("WebSocket disconnect", event);
      this.socket = null;
      this.connected = false;

      if (event.code === AUTH_CODE || RECONNECT_CODES.has(event.code)) {
        this.emitError({
          code: event.code,
          message: event.reason,
          raw: event
        });

        return;
      }

      this.emitStop();
    };
  }

  sendInput({ keyName, value }: { keyName: KeyName; value: KeyValue }) {
    if (!this.socket || !this.connected) {
      throw new Error('WebSocket: Not connected');
    }

    // let inputEvent: Partial<Record<KeyName, KeyValue>> = {};
    this.inputEvent[keyName] = value;

    this.socket.send(JSON.stringify(this.inputEvent));
    if (value === 0) {
      delete this.inputEvent[keyName];
    }
  }

  closeWebsocket(): Promise<void> {
    this.connected = false;

    return new Promise((resolve) => {
      if (this.socket) {
        this.socket.onclose = () => {
          // console.log("WebSocket disconnect", event);

          resolve();
        };

        this.socket.close();
        this.socket = null;
      } else {
        resolve();
      }

      this.emitStop();
    });
  }
}
