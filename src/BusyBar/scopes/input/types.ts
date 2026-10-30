import type { operations } from 'Global/API';

type InputKeyQuery = operations['setInputKey']['parameters']['query'];

export interface InputKeyParams extends InputKeyQuery {}
