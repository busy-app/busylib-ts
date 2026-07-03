export * from './state';
export * from './update';
export * from './types';

import type { BSB_State, BSB_Update } from 'StateStream/types/schema';
import type {
  ConvertedPower,
  ConvertedWifi,
  ConvertedMatter,
  ConvertedBle,
  ConvertedUpdateState,
  ConvertedCheckState,
  ConvertedStateUpdate,
  ConvertedState
} from './types';

import {
  convertBatteryStatus,
  convertWifiConnectionStatus,
  convertWifiSecurity,
  convertIpMethod,
  convertIpProtocol,
  convertMatterCommissioningStatus,
  convertBleServiceStatus
} from './state';
import { convertUpdateEvent, convertUpdateAction, convertUpdateStatus, convertCheckError, convertCheckEvent } from './update';

export function convertPower(power: BSB_State.Power | null | undefined): ConvertedPower | null {
  if (power == null) return null;
  return {
    ...power,
    known:
      power.known == null
        ? power.known
        : {
            ...power.known,
            batteryStatus: convertBatteryStatus(power.known.batteryStatus)
          }
  };
}

export function convertWifi(wifi: BSB_State.Wifi | null | undefined): ConvertedWifi | null {
  if (wifi == null) return null;
  const { active, inactive, ...rest } = wifi;
  return {
    ...rest,
    disconnected: inactive,
    connected:
      active == null
        ? active
        : {
            ...active,
            status: convertWifiConnectionStatus(active.status),
            security: convertWifiSecurity(active.security)
          },
    ipAddresses:
      wifi.ipAddresses?.map((ip) => ({
        ...ip,
        protocol: convertIpProtocol(ip.protocol),
        method: convertIpMethod(ip.method)
      })) ?? null
  };
}

export function convertMatter(matter: BSB_State.Matter | null | undefined): ConvertedMatter | null {
  if (matter == null) return null;
  return {
    ...matter,
    state:
      matter.state == null
        ? matter.state
        : {
            ...matter.state,
            status: convertMatterCommissioningStatus(matter.state.status)
          }
  };
}

export function convertBle(ble: BSB_State.Ble.Ble | null | undefined): ConvertedBle | null {
  if (ble == null) return null;
  return {
    ...ble,
    status: convertBleServiceStatus(ble.status)
  };
}

export function convertUpdateState(updateState: BSB_Update.UpdateState | null | undefined): ConvertedUpdateState | null {
  if (updateState == null) return null;
  return {
    event: convertUpdateEvent(updateState.event),
    action: convertUpdateAction(updateState.action),
    status: convertUpdateStatus(updateState.status)
  };
}

export function convertCheckState(checkState: BSB_Update.CheckState | null | undefined): ConvertedCheckState | null {
  if (checkState == null) return null;
  return {
    ...checkState,
    event: convertCheckEvent(checkState.event),
    unavailable:
      checkState.unavailable == null
        ? checkState.unavailable
        : {
            reason: convertCheckError(checkState.unavailable.reason)
          }
  };
}

function omitNullish<T extends object>(obj: T): { [K in keyof T]: NonNullable<T[K]> } {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v != null)) as { [K in keyof T]: NonNullable<T[K]> };
}

export function convertStateUpdate(update: BSB_State.StateUpdate): ConvertedStateUpdate {
  return omitNullish({
    ...update,
    power: convertPower(update.power),
    wifi: convertWifi(update.wifi),
    matter: convertMatter(update.matter),
    ble: convertBle(update.ble),
    updateState: convertUpdateState(update.updateState),
    updateCheck: convertCheckState(update.updateCheck)
  }) as ConvertedStateUpdate;
}

export function convertState(state: BSB_State.State): ConvertedState {
  return {
    ...state,
    updates: state.updates?.map(convertStateUpdate) ?? null
  };
}
