// Types used only inside the library; the public ones live in types.ts.

export type ApiKey = string;

export type Media = `${string}/${string}`;

export type RequiredKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? never : K }[keyof T];

export type SuccessData<R> = R extends { data: infer D } ? D : never;
