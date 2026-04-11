import { RemoteStreamOptions, StateStreamError, StateStreamErrorCode, StreamConfig } from 'StateStream/types/types';
import { BaseStateStream } from 'StateStream/classes/BaseStateStream';
import { StreamMode } from 'StateStream/types/types.internal';

/**
 * Connection for remote BUSY Bar devices via Remote.
 * Uses wss:// and provides subscription management.
 */
export class RemoteStateStream extends BaseStateStream {
  protected streamMode: StreamMode = 'remote';
  private tokenProvider?: () => Promise<string>;

  constructor(options: RemoteStreamOptions, config?: StreamConfig) {
    super(
      {
        isBinary: false, // Default for remote is JSON
        ...options
      },
      config
    );
    this.tokenProvider = options.tokenProvider;
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
