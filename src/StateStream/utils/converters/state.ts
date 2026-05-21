import { BSB_State } from 'StateStream/types/schema';
import type { components } from 'Global/API';
import { convertEnum } from 'StateStream/utils/convertEnum';

export type BatteryStatus = components['schemas']['StatusPower']['state'];
export type WifiConnectionStatus = components['schemas']['StatusResponse']['state'];
export type MatterCommissioningStatus = NonNullable<
  NonNullable<components['schemas']['SmartHomePairingInfo']['latest_pairing_status']>['value']
>;
export type BleServiceStatus = components['schemas']['BleStatusResponse']['status'];

type WifiSecurityMethod = components['schemas']['WifiSecurityMethod'];
type WifiIpMethod = components['schemas']['WifiIpMethod'];
type WifiIpType = components['schemas']['WifiIpType'];

const BATTERY_STATUS_MAP: Record<BSB_State.BatteryStatus, BatteryStatus> = {
  [BSB_State.BatteryStatus.DISCHARGING]: 'discharging',
  [BSB_State.BatteryStatus.CHARGING]: 'charging',
  [BSB_State.BatteryStatus.CHARGED]: 'charged'
};

const WIFI_CONNECTION_STATUS_MAP: Record<BSB_State.WifiConnectionStatus, WifiConnectionStatus> = {
  [BSB_State.WifiConnectionStatus.CONNECTED]: 'connected',
  [BSB_State.WifiConnectionStatus.CONNECTING]: 'connecting',
  [BSB_State.WifiConnectionStatus.DISCONNECTING]: 'disconnecting',
  [BSB_State.WifiConnectionStatus.RECONNECTING]: 'reconnecting'
};

const WIFI_SECURITY_MAP: Record<BSB_State.WifiSecurity, WifiSecurityMethod> = {
  [BSB_State.WifiSecurity.UNKNOWN]: 'Unsupported',
  [BSB_State.WifiSecurity.OPEN]: 'Open',
  [BSB_State.WifiSecurity.WPA]: 'WPA',
  [BSB_State.WifiSecurity.WPA2]: 'WPA2',
  [BSB_State.WifiSecurity.WEP]: 'WEP',
  [BSB_State.WifiSecurity.WPA_WPA2]: 'WPA/WPA2',
  [BSB_State.WifiSecurity.WPA3]: 'WPA3',
  [BSB_State.WifiSecurity.WPA2_WPA3]: 'WPA2/WPA3'
};

const IP_METHOD_MAP: Record<BSB_State.IpConfigurationMethod, WifiIpMethod> = {
  [BSB_State.IpConfigurationMethod.DHCP]: 'dhcp',
  [BSB_State.IpConfigurationMethod.STATIC]: 'static'
};

const IP_PROTOCOL_MAP: Record<BSB_State.IpProtocol, WifiIpType> = {
  [BSB_State.IpProtocol.IPV4]: 'ipv4',
  [BSB_State.IpProtocol.IPV6]: 'ipv6'
};

const MATTER_STATUS_MAP: Record<BSB_State.MatterCommissioningStatus, MatterCommissioningStatus> = {
  [BSB_State.MatterCommissioningStatus.NEVER_STARTED]: 'never_started',
  [BSB_State.MatterCommissioningStatus.STARTED]: 'started',
  [BSB_State.MatterCommissioningStatus.COMPLETED_SUCCESSFULLY]: 'completed_successfully',
  [BSB_State.MatterCommissioningStatus.FAILED]: 'failed'
};

const BLE_STATUS_MAP: Record<BSB_State.Ble.ServiceStatus, BleServiceStatus> = {
  [BSB_State.Ble.ServiceStatus.RESET]: 'reset',
  [BSB_State.Ble.ServiceStatus.INITIALIZATION]: 'initialization',
  [BSB_State.Ble.ServiceStatus.READY]: 'enabled',
  [BSB_State.Ble.ServiceStatus.ADVERTISING]: 'enabled',
  [BSB_State.Ble.ServiceStatus.CONNECTABLE]: 'connectable',
  [BSB_State.Ble.ServiceStatus.CONNECTED]: 'connected',
  [BSB_State.Ble.ServiceStatus.ERROR]: 'internal error'
};


export function convertBatteryStatus(value: BSB_State.BatteryStatus | null | undefined): BatteryStatus | null {
  return convertEnum(BATTERY_STATUS_MAP, value);
}

export function convertWifiConnectionStatus(value: BSB_State.WifiConnectionStatus | null | undefined): WifiConnectionStatus | null {
  return convertEnum(WIFI_CONNECTION_STATUS_MAP, value);
}

export function convertWifiSecurity(value: BSB_State.WifiSecurity | null | undefined): WifiSecurityMethod | null {
  return convertEnum(WIFI_SECURITY_MAP, value);
}

export function convertIpMethod(value: BSB_State.IpConfigurationMethod | null | undefined): WifiIpMethod | null {
  return convertEnum(IP_METHOD_MAP, value);
}

export function convertIpProtocol(value: BSB_State.IpProtocol | null | undefined): WifiIpType | null {
  return convertEnum(IP_PROTOCOL_MAP, value);
}

export function convertMatterCommissioningStatus(value: BSB_State.MatterCommissioningStatus | null | undefined): MatterCommissioningStatus | null {
  return convertEnum(MATTER_STATUS_MAP, value);
}

export function convertBleServiceStatus(value: BSB_State.Ble.ServiceStatus | null | undefined): BleServiceStatus | null {
  return convertEnum(BLE_STATUS_MAP, value);
}
