import createClient from 'openapi-fetch';
import type { paths } from 'Global/API';
import { bodySerializer } from './body';
import type { ApiClient } from './types';

/**
 * Creates the transport that sends requests to the given base URL; the only module that depends on openapi-fetch at runtime.
 * @param {string} baseUrl - Base URL all endpoint paths are appended to.
 * @returns {ApiClient} The transport without middleware.
 */
export function createTransport(baseUrl: string): ApiClient {
  return createClient<paths>({ baseUrl, bodySerializer });
}
