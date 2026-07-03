import type { AccountBackend } from 'BusyBar/types/models';

export interface AccountBackendSetParams extends AccountBackend {}

/** @deprecated Use {@link AccountBackendSetParams} instead */
export interface AccountProfileSetParams extends AccountBackendSetParams {}
