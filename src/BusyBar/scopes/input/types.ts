import type { operations } from 'Global/API';

export type InputKeyQuery = operations['setInputKey']['parameters']['query'];

export interface InputKeyParams extends InputKeyQuery {}
