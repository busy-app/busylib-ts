import { components } from "Global/API";

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
