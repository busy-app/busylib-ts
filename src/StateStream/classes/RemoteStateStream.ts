import {
  RemoteStreamOptions,
  StateStreamError,
  StateStreamErrorCode,
  RemoteStreamConfig,
  DeviceEventCallback,
  DataCallback,
  RawDataCallback,
  ErrorCallback,
  StatusCallback
} from 'StateStream/types/types';
import { BaseStateStream } from 'StateStream/classes/BaseStateStream';
import { StreamMode, DEFAULT_MAX_AUTH_ATTEMPTS } from 'StateStream/types/types.internal';

/**
 * Connection for remote BUSY Bar devices via Remote.
 * Uses wss:// and provides subscription management.
 */
export class RemoteStateStream extends BaseStateStream {
  protected streamMode: StreamMode = 'remote';
  private tokenProvider?: () => Promise<string>;
  protected maxAuthAttempts: number;

  constructor(options: RemoteStreamOptions, config?: RemoteStreamConfig) {
    super(
      {
        isBinary: false, // Default for remote is JSON
        ...options
      },
      config
    );
    this.tokenProvider = options.tokenProvider;
    this.maxAuthAttempts = config?.maxAuthAttempts ?? DEFAULT_MAX_AUTH_ATTEMPTS;
  }

  public start({
    deviceEventCallback,
    ...rest
  }: {
    dataCallback?: DataCallback;
    rawDataCallback?: RawDataCallback;
    errorCallback?: ErrorCallback;
    statusCallback?: StatusCallback;
    deviceEventCallback?: DeviceEventCallback;
  } = {}): Promise<void> {
    this.deviceEventCallback = deviceEventCallback;
    return super.start(rest);
  }

  /**
   * Subscribes to updates for a specific device GUID.
   */
  public subscribe(guid: string): void {
    this.sendCommand({ type: 'SUBSCRIBE', guid });
  }

  /**
   * Unsubscribes from updates for a specific device GUID.
   */
  public unsubscribe(guid: string): void {
    this.sendCommand({ type: 'UNSUBSCRIBE', guid });
  }

  /**
   * Standardizes the address to use wss:// or ws:// protocol.
   */
  protected normalizeUrl(addr: string): string {
    return this.resolveProtocol(addr);
  }

  /**
   * Handles token expiration by invoking the tokenProvider.
   * Returns the promise for deduplication.
   */
  protected onTokenExpired(): Promise<string> | void {
    if (this.tokenProvider) {
      return this.tokenProvider()
        .then((newToken) => {
          this.sendToken(newToken);
          return newToken;
        })
        .catch((err) => {
          const errorMsg = `Failed to refresh token: ${err.message}`;
          if (this.errorCallback) {
            this.errorCallback(new StateStreamError(StateStreamErrorCode.AUTH_REFRESH_FAILED, errorMsg));
          }
          throw err;
        });
    }
  }
}
