import type { components } from 'Global/API';

export type SmartHomePairingPayload = components['schemas']['SmartHomePairingPayload'];
export type SmartHomePairingInfo = components['schemas']['SmartHomePairingInfo'];
export type SmartHomeSwitchState = components['schemas']['SmartHomeSwitchState'];

export interface SmartHomeSwitchStateParams extends SmartHomeSwitchState {}
