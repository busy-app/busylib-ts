import type { AccountBackend, RequestOptions } from 'BusyBar/types/models';

export interface AccountBackendSetParams extends RequestOptions, AccountBackend {}

/** @deprecated Use {@link AccountBackendSetParams} instead */
export interface AccountProfileSetParams extends AccountBackendSetParams {}
