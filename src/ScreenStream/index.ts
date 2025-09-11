import { DeviceScreen } from "ScreenStream/types";
import { AUTH_CODE, RECONNECT_CODES } from "Global/webSocketConfig";
import {
  rleDecompress,
  backConvertB4ToB8,
} from "ScreenStream/utils/bufferUtils";
import type {
  DataListener,
  StopListener,
  ErrorListener,
  ErrorPayload,
  ApiKey,
  ApiSemver,
} from "Global/types";

interface BaseConfig {
  deviceScreen: DeviceScreen;
  apiKey?: ApiKey;
  apiSemver?: ApiSemver;
}

export interface LocalConfig extends BaseConfig {
  mode: "local";
  barUrl: string;
}

export interface SiteConfig extends BaseConfig {
  mode: "cloud";
  domain: string;
  token: string;
  idDevice: string;
}

export type DeviceConfig = LocalConfig | SiteConfig;

export class ScreenStream {
  connected: boolean = false;

  // @ts-ignore
  private apiKey?: ApiKey;
  // @ts-ignore
  private apiSemver?: ApiSemver;

  private dataListeners: DataListener[] = [];
  private stopListeners: StopListener[] = [];
  private errorListeners: ErrorListener[] = [];

  private socket: WebSocket | null = null;

  constructor(private config: DeviceConfig) {
    const isBrowser = () =>
      typeof window !== "undefined" && typeof window.document !== "undefined";

    if (!isBrowser) {
      throw new Error("not browser");
    }

    if (config.apiKey) {
      this.apiKey = config.apiKey;
    }

    if (config.apiSemver) {
      this.apiSemver = config.apiSemver;
    }
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

    let wsUrl: URL | undefined = undefined;
    if (this.config.mode === "cloud") {
      wsUrl = new URL(`${this.config.domain}/bars/${this.config.idDevice}/ws`);
    } else if (this.config.mode === "local") {
      wsUrl = new URL(`${this.config.barUrl}/api/screen/ws`);

      if (this.apiKey) {
        wsUrl.searchParams.append("x-api-key", this.apiKey);
      }

      if (this.apiSemver) {
        wsUrl.searchParams.append("x-api-sem-ver", this.apiSemver);
      }
    }

    if (!wsUrl) {
      throw new Error("The WebSocket URL is not specified");
    }

    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => {
      if (!this.socket) {
        return;
      }

      if (this.config.mode === "cloud") {
        this.socket.send(
          JSON.stringify({
            token: this.config.token,
            display: this.config.deviceScreen,
          })
        );
      } else if (this.config.mode === "local") {
        this.socket.send(JSON.stringify({ display: this.config.deviceScreen }));
      }
      this.connected = true;
    };

    this.socket.binaryType = "arraybuffer";
    this.socket.onmessage = (event) => {
      try {
        if (typeof event.data === "string") {
          // console.log("WebSocket message", event);
          return;
        }

        // Process the binary data
        const rawData = new Uint8Array(event.data);

        if (this.config.mode === "cloud") {
          this.emitData(rawData);
        } else if (this.config.mode === "local") {
          let processedData: Uint8Array;

          // Front display uses blkSize=3, Back display uses blkSize=2
          const blkSize =
            this.config.deviceScreen === DeviceScreen.FRONT ? 3 : 2;

          try {
            // First decompress the RLE data
            const decompressedData = rleDecompress(rawData, blkSize);

            // If this is the back display, convert from 4-bit to 8-bit
            if (this.config.deviceScreen === DeviceScreen.BACK) {
              processedData = backConvertB4ToB8(decompressedData);
            } else {
              processedData = decompressedData;
            }

            this.emitData(processedData);
          } catch (error) {
            // console.error("Error processing frame", error);
            this.emitData(rawData); // Fallback to using raw data
          }
        }
      } catch (event) {
        // console.error("Error parsing frame", event);
        this.connected = false;
        this.emitStop();
      }
    };

    this.socket.onerror = (event) => {
      // console.error("WebSocket error", event);
      this.connected = false;
      this.emitError({
        code: 1006, // Standard «abnormal closure» code per RFC-6455
        message: "WebSocket error occurred",
        raw: event,
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
          raw: event,
        });

        return;
      }

      this.emitStop();
    };
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
