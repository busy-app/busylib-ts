import { DEFAULT_DEVICE_URL, DEFAULT_PROXY_URL, PROXY_HOST_RE } from 'Global/constants';
import type { BusyBarConfig } from './types';

/** Request timeout in milliseconds when the config does not set one. */
export const DEFAULT_TIMEOUT = 3000;

/**
 * Normalizes the configured address and builds the API base URL for it: the BUSY proxy is cut to its origin, any other address keeps its path.
 * @param {BusyBarConfig} [config] - BUSY Bar connection configuration.
 * @returns {{ addr: string, baseUrl: string }} The normalized address (with its path, if any) and the base URL all endpoint paths are appended to.
 */
export function resolveAddress(config?: BusyBarConfig): { addr: string; baseUrl: string } {
  const addr = normalizeAddr(config);

  // Device endpoints live under `/api/`, the proxy exposes them under `/busybar/`.
  const pathPrefix = PROXY_HOST_RE.test(addr) ? '/busybar/' : '/api/';

  return { addr, baseUrl: `${addr}${pathPrefix}` };
}

function normalizeAddr(config?: BusyBarConfig): string {
  if (!config || (!config.addr && !config.token)) {
    return DEFAULT_DEVICE_URL;
  }

  if (!config.addr) {
    return DEFAULT_PROXY_URL;
  }

  let addr = config.addr.trim();

  const hasExplicitProtocol = /^https?:\/\//i.test(addr);
  if (!hasExplicitProtocol) {
    addr = `http://${addr}`;
  }

  const url = new URL(addr);

  if (PROXY_HOST_RE.test(url.origin)) {
    // The proxy is cut to the bare origin, dropping any trailing path/slashes (e.g. `api.busy.app/busybar/`, `api.busy.app/`) so the prefix is added once.
    let origin = url.origin;

    // Default the proxy host to https when no protocol was explicitly provided.
    if (!hasExplicitProtocol) {
      origin = origin.replace(/^http:/i, 'https:');
    }

    if (!config.token) {
      throw new Error('Token is required. Please provide it.');
    }

    return origin;
  }

  // A device or another proxy (e.g. BUSY Cloud `/device`) keeps its path without trailing slashes; query and hash are dropped.
  return `${url.origin}${url.pathname.replace(/\/+$/, '')}`;
}
