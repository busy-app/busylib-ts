import { components } from 'Global/API';
import type { BusyBarClient } from 'BusyBar-old/api/createClient';

export type { BusyBarClient };

export type ApiKey = string;
export type ApiSemver = components['schemas']['VersionInfo']['api_semver'];
