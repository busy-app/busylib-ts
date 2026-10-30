import type { components } from 'Global/API';

export type SuccessResponse = components['schemas']['SuccessResponse'];
export type ErrorResponse = components['schemas']['Error'];

export type BusyFile = Buffer | Blob | File | ArrayBuffer;
