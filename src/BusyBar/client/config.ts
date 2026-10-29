import { DEFAULT_DEVICE_URL, DEFAULT_PROXY_URL, PROXY_HOST_RE } from 'Global/constants';
import type { BusyBarConfig } from './types';

/** Request timeout in milliseconds when the config does not set one. */
export const DEFAULT_TIMEOUT = 3000;

/**
 * Normalizes the configured address to a bare origin and builds the API base URL for it.
 * @param {BusyBarConfig} [config] - BUSY Bar connection configuration.
 * @returns {{ addr: string, baseUrl: string }} The device or proxy origin and the base URL all endpoint paths are appended to.
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

  // Normalize to the bare origin, dropping any trailing path/slashes (e.g. `api.busy.app/busybar/`, `api.busy.app/`) so the prefix is added once.
  addr = new URL(addr).origin;

  // Default the proxy host to https when no protocol was explicitly provided.
  if (!hasExplicitProtocol && PROXY_HOST_RE.test(addr)) {
    addr = addr.replace(/^http:/i, 'https:');
  }

  if (PROXY_HOST_RE.test(addr) && !config.token) {
    throw new Error('Token is required. Please provide it.');
  }

  return addr;
}
