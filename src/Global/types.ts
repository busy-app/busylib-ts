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

export type SuccessResponse = components["schemas"]["SuccessResponse"];
export type Error = components["schemas"]["Error"];

// Assets
export type BinaryUpload = Buffer | Blob | File | ArrayBuffer;
export type FileUpload = {
  file: BinaryUpload;
};

// Audio

// BLE

// Display
export type DisplayElements = components["schemas"]["DisplayElements"];
export type DisplayElement = components["schemas"]["DisplayElement"];
export type TextElement = components["schemas"]["TextElement"];
export type ImageElement = components["schemas"]["ImageElement"];

// Input

// Settings
export type HttpAccessInfo = components["schemas"]["HttpAccessInfo"];
export type DisplayBrightnessInfo =
  components["schemas"]["DisplayBrightnessInfo"];
export type AudioVolumeInfo = components["schemas"]["AudioVolumeInfo"];

// Storage
export type StorageList = components["schemas"]["StorageList"];
export type StorageListElement = components["schemas"]["StorageListElement"];
export type StorageFileElement = components["schemas"]["StorageFileElement"];
export type StorageDirElement = components["schemas"]["StorageDirElement"];
export type StorageReadResponse = ArrayBuffer | Blob;

// System
export type VersionInfo = components["schemas"]["VersionInfo"];
export type Status = components["schemas"]["Status"];
export type StatusSystem = components["schemas"]["StatusSystem"];
export type StatusPower = components["schemas"]["StatusPower"];

// Wifi
export type WifiSecurityMethod = components["schemas"]["WifiSecurityMethod"];
export type WifiIpMethod = components["schemas"]["WifiIpMethod"];
export type WifiIpType = components["schemas"]["WifiIpType"];
export type WifiNetwork = components["schemas"]["Network"];
export type WifiStatusResponse = components["schemas"]["StatusResponse"];
export type WifiConnectRequestConfig =
  components["schemas"]["ConnectRequestConfig"];
export type WifiNetworkResponse = components["schemas"]["NetworkResponse"];
