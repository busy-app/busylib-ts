import type { components } from 'Global/API';

export type AccountInfo = components['schemas']['AccountInfo'];
export type AccountLink = components['schemas']['AccountLink'];
export type AccountStatus = components['schemas']['AccountStatus'];
export type AccountBackend = components['schemas']['AccountBackend'];

export interface AccountBackendSetParams extends AccountBackend {}
