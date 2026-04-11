import { LocalStreamOptions, StreamConfig } from 'StateStream/types/types';
import { BaseStateStream } from 'StateStream/classes/BaseStateStream';
import { StreamMode } from 'StateStream/types/types.internal';

/**
 * Connection for local BUSY Bar devices via direct IP.
 * Uses ws:// and binary protobuf protocol.
 */
export class LocalStateStream extends BaseStateStream {
  protected streamMode: StreamMode = 'local';

  constructor(options: LocalStreamOptions = {}, config?: StreamConfig) {
    let addr = options.addr;

    // Auto-detect host if in browser and addr is missing
    if (!addr) {
      if (typeof window !== 'undefined') {
        addr = window.location.origin;
      } else {
        addr = '10.0.4.20';
      }
    }

    super(
      {
        isBinary: true, // Default for local is binary
        ...options,
        addr: addr
      },
      config
    );
  }

  /**
   * Normalizes the address to use ws:// protocol and adds default path if missing.
   */
  protected normalizeUrl(addr: string): string {
    const fixed = this.resolveProtocol(addr);
    const url = new URL(fixed);

    // If no path is provided, use the default local status path
    if (url.pathname === '/' || !url.pathname) {
      url.pathname = '/api/status/ws';
    }

    return url.toString();
  }
}
