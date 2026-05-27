import type { BSB_State, BSB_Update, BSB_Input, BSB_Timer, BSB_Frame, BSB_Error } from 'StateStream/types/schema';
import type { BatteryStatus, WifiConnectionStatus, MatterCommissioningStatus, BleServiceStatus } from './state';
import type { components } from 'Global/API';
type WifiSecurityMethod = components['schemas']['WifiSecurityMethod'];
type WifiIpMethod = components['schemas']['WifiIpMethod'];
type WifiIpType = components['schemas']['WifiIpType'];
import type { UpdateEvent, UpdateAction, UpdateStatusValue, CheckError, CheckEvent } from './update';
import type Long from 'long';

export interface ConvertedPower {
  unknown?: BSB_State.UnknownPowerState | null;
  known?: (Omit<BSB_State.PowerState, 'batteryStatus'> & { batteryStatus: BatteryStatus | null }) | null;
}

export interface ConvertedWifi {
  unknown?: BSB_State.WifiStateUnknown | null;
  disconnected?: BSB_State.WifiStateDisconnected | null;
  connected?: (Omit<BSB_State.WifiStateConnected, 'status' | 'security'> & {
    status: WifiConnectionStatus | null;
    security: WifiSecurityMethod | null;
  }) | null;
  ipAddresses?: (Omit<BSB_State.IpAddress, 'protocol' | 'method'> & {
    protocol: WifiIpType | null;
    method: WifiIpMethod | null;
  })[] | null;
}

export interface ConvertedMatter {
  fabricCount?: number | null;
  state?: (Omit<BSB_State.MatterCommissioningState, 'status'> & {
    status: MatterCommissioningStatus | null;
  }) | null;
}

export interface ConvertedBle {
  status: BleServiceStatus | null;
  remoteAddress?: string | null;
}

export interface ConvertedUpdateState {
  event: UpdateEvent | null;
  action: UpdateAction | null;
  status: UpdateStatusValue | null;
}

export interface ConvertedCheckState {
  event?: CheckEvent | null;
  available?: BSB_Update.UpdateAvailable | null;
  unavailable?: { reason: CheckError | null } | null;
}

export interface ConvertedStateUpdate {
  deviceName?: BSB_State.DeviceName | null;
  power?: ConvertedPower | null;
  brightness?: BSB_State.Brightness | null;
  audioVolume?: BSB_State.AudioVolume | null;
  wifi?: ConvertedWifi | null;
  updateState?: ConvertedUpdateState | null;
  updateCheck?: ConvertedCheckState | null;
  timezone?: BSB_State.Timezone | null;
  matter?: ConvertedMatter | null;
  frame?: BSB_Frame.Frame | null;
  input?: BSB_Input.InputEvent | null;
  timer?: BSB_Timer.Timer | null;
  ble?: ConvertedBle | null;
  autoUpdateState?: BSB_Update.AutoUpdateState | null;
  timerProfiles?: BSB_Timer.Profiles | null;
}

export interface ConvertedState {
  timestamp?: number | Long | null;
  updates?: ConvertedStateUpdate[] | null;
  error?: BSB_Error.Error | null;
}
