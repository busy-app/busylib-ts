import type { components, operations } from 'Global/API';

export type VersionInfo = components['schemas']['VersionInfo'];
export type Status = components['schemas']['Status'];
export type StatusSystem = components['schemas']['StatusSystem'];
export type StatusPower = components['schemas']['StatusPower'];
export type StatusDevice = components['schemas']['StatusDevice'];
export type StatusFirmware = components['schemas']['StatusFirmware'];
export type NetworkInterfaceInfo = components['schemas']['NetworkInterfaceInfo'];
export type LogDumpQuery = NonNullable<operations['dumpLog']['parameters']['query']>;
export type LogDumpResponse = operations['dumpLog']['responses'][200]['content']['application/json'];

export interface LogDumpParams extends Partial<LogDumpQuery> {}
