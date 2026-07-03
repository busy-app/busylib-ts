import type { WifiConnectRequestConfig } from 'BusyBar/types/models';
import type { RequireKeys } from 'Global/types.utils';

type RequiredIpConfig = RequireKeys<NonNullable<WifiConnectRequestConfig['ip_config']>, 'ip_method'>;

export type WifiConnectParams = RequireKeys<Omit<WifiConnectRequestConfig, 'ip_config'> & { ip_config: RequiredIpConfig }, 'ssid' | 'security' | 'ip_config'>;
