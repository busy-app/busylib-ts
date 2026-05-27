import { BSB_Update } from 'StateStream/types/schema';
import type { components } from 'Global/API';
import { convertEnum } from 'StateStream/utils/convertEnum';

type UpdateStatusSchema = NonNullable<components['schemas']['UpdateStatus']['install']>;

export type UpdateEvent = NonNullable<UpdateStatusSchema['event']>;
export type UpdateAction = NonNullable<UpdateStatusSchema['action']>;
export type UpdateStatusValue = NonNullable<UpdateStatusSchema['status']>;
export type CheckError = 'not_available' | 'failure' | 'idle';
export type CheckEvent = 'start' | 'stop' | 'none';

const UPDATE_EVENT_MAP: Record<BSB_Update.UpdateEvent, UpdateEvent> = {
  [BSB_Update.UpdateEvent.SESSION_START]: 'session_start',
  [BSB_Update.UpdateEvent.SESSION_STOP]: 'session_stop',
  [BSB_Update.UpdateEvent.ACTION_BEGIN]: 'action_begin',
  [BSB_Update.UpdateEvent.ACTION_DONE]: 'action_done',
  [BSB_Update.UpdateEvent.DETAIL_CHANGE]: 'detail_change',
  [BSB_Update.UpdateEvent.ACTION_PROGRESS]: 'action_progress',
  [BSB_Update.UpdateEvent.EVENT_NONE]: 'none'
};

const UPDATE_ACTION_MAP: Record<BSB_Update.UpdateAction, UpdateAction> = {
  [BSB_Update.UpdateAction.DOWNLOAD]: 'download',
  [BSB_Update.UpdateAction.SHA_VERIFICATION]: 'sha_verification',
  [BSB_Update.UpdateAction.UNPACK]: 'unpack',
  [BSB_Update.UpdateAction.INSTALLATION_PREPARE]: 'prepare',
  [BSB_Update.UpdateAction.INSTALLATION_APPLY]: 'apply',
  [BSB_Update.UpdateAction.ACTION_NONE]: 'none'
};

const UPDATE_STATUS_MAP: Record<BSB_Update.UpdateStatus, UpdateStatusValue> = {
  [BSB_Update.UpdateStatus.OK]: 'ok',
  [BSB_Update.UpdateStatus.BATTERY_LOW]: 'battery_low',
  [BSB_Update.UpdateStatus.BUSY]: 'busy',
  [BSB_Update.UpdateStatus.DOWNLOAD_FAILURE]: 'download_failure',
  [BSB_Update.UpdateStatus.DOWNLOAD_ABORT]: 'download_abort',
  [BSB_Update.UpdateStatus.SHA_MISMATCH]: 'sha_mismatch',
  [BSB_Update.UpdateStatus.UNPACK_CREATE_STAGING_DIRECTORY_FAILURE]: 'unpack_staging_dir_failure',
  [BSB_Update.UpdateStatus.UNPACK_ARCHIVE_OPEN_FAILURE]: 'unpack_archive_open_failure',
  [BSB_Update.UpdateStatus.UNPACK_ARCHIVE_UNPACK_FAILURE]: 'unpack_archive_unpack_failure',
  [BSB_Update.UpdateStatus.INSTALLATION_PREPARE_MANIFEST_NOT_FOUND]: 'install_manifest_not_found',
  [BSB_Update.UpdateStatus.INSTALLATION_PREPARE_MANIFEST_INVALID]: 'install_manifest_invalid',
  [BSB_Update.UpdateStatus.INSTALLATION_PREPARE_SESSION_CONFIG_SETUP_FAILURE]: 'install_session_config_failure',
  [BSB_Update.UpdateStatus.INSTALLATION_PREPARE_POINTER_SETUP_FAILURE]: 'install_pointer_setup_failure',
  [BSB_Update.UpdateStatus.UNKNOWN_FAILURE]: 'unknown_failure'
};

const CHECK_ERROR_MAP: Record<BSB_Update.CheckError, CheckError> = {
  [BSB_Update.CheckError.NOT_AVAILABLE]: 'not_available',
  [BSB_Update.CheckError.FAILURE]: 'failure',
  [BSB_Update.CheckError.IDLE]: 'idle'
};

const CHECK_EVENT_MAP: Record<BSB_Update.CheckEvent, CheckEvent> = {
  [BSB_Update.CheckEvent.START]: 'start',
  [BSB_Update.CheckEvent.STOP]: 'stop',
  [BSB_Update.CheckEvent.NONE]: 'none'
};


export function convertUpdateEvent(value: BSB_Update.UpdateEvent | null | undefined): UpdateEvent | null {
  return convertEnum(UPDATE_EVENT_MAP, value);
}

export function convertUpdateAction(value: BSB_Update.UpdateAction | null | undefined): UpdateAction | null {
  return convertEnum(UPDATE_ACTION_MAP, value);
}

export function convertUpdateStatus(value: BSB_Update.UpdateStatus | null | undefined): UpdateStatusValue | null {
  return convertEnum(UPDATE_STATUS_MAP, value);
}

export function convertCheckError(value: BSB_Update.CheckError | null | undefined): CheckError | null {
  return convertEnum(CHECK_ERROR_MAP, value);
}

export function convertCheckEvent(value: BSB_Update.CheckEvent | null | undefined): CheckEvent | null {
  return convertEnum(CHECK_EVENT_MAP, value);
}
