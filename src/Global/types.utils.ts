/**
 * Helper to force TypeScript to expand complex types in tooltips.
 * It maps over each property and "flattens" the type.
 */
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
