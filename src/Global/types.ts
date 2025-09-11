import { operations, components } from "Global/API";

export type KeyName = operations["setInputKey"]["parameters"]["query"]["key"];
export type KeyValue = 1 | 0;

export interface ErrorPayload {
  code: number;
  message: string;
  raw: Error | CloseEvent | Event;
}
export type DataListener = (data: Uint8Array) => void;
export type StopListener = () => void;
export type ErrorListener = (payload: ErrorPayload) => void;

export type ApiKey = string;
export type ApiSemver = components["schemas"]["VersionInfo"]["api_semver"];
