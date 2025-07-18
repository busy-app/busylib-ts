export type SnakeToCamel<S extends string> =
  S extends `${infer Head}_${infer Tail}`
    ? `${Head}${Capitalize<SnakeToCamel<Tail>>}`
    : S;

export type DeepCamelize<T> = T extends (...args: any[]) => any
  ? T
  : T extends Array<infer U>
  ? Array<DeepCamelize<U>>
  : T extends object
  ? { [K in keyof T as SnakeToCamel<K & string>]: DeepCamelize<T[K]> }
  : T;

export type RequireKeys<T, K extends keyof T> = Required<Pick<T, K>> &
  Omit<T, K>;
