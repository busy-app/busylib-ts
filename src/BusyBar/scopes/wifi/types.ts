import type { components } from 'Global/API';
import type { RequireKeys } from 'Global/types.utils';

export type WifiSecurityMethod = components['schemas']['WifiSecurityMethod'];
export type WifiIpMethod = components['schemas']['WifiIpMethod'];
export type WifiIpType = components['schemas']['WifiIpType'];
export type WifiNetwork = components['schemas']['Network'];
export type WifiStatusResponse = components['schemas']['StatusResponse'];
export type WifiConnectRequestConfig = components['schemas']['ConnectRequestConfig'];
export type WifiNetworkResponse = components['schemas']['NetworkResponse'];

type RequiredIpConfig = RequireKeys<NonNullable<WifiConnectRequestConfig['ip_config']>, 'ip_method'>;

export type WifiConnectParams = RequireKeys<Omit<WifiConnectRequestConfig, 'ip_config'> & { ip_config: RequiredIpConfig }, 'ssid' | 'security' | 'ip_config'>;
