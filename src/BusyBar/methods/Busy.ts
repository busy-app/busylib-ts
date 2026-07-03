import { getSnapshot as getSnapshotApi, setSnapshot as setSnapshotApi, getProfile as getProfileApi, setProfile as setProfileApi } from 'BusyBar/api/busy';
import type {
  BusySnapshot,
  BusyProfile,
  SuccessResponse,
  BusySnapshotSetParams,
  BusyProfileGetParams,
  BusyProfileSetParams,
  RequestOptions
} from 'BusyBar/types';
import { BusyBar } from 'BusyBar/index';

export class BusyMethods {
  /**
   * Get BUSY timer snapshot.
   *
   * Gets the current state of the BUSY timer in snapshot form.
   *
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<BusySnapshot>} Current BUSY timer snapshot.
   */
  async BusySnapshotGet(this: BusyBar, options?: RequestOptions): Promise<BusySnapshot> {
    return await getSnapshotApi(this.apiClient, options);
  }

  /**
   * Set BUSY timer snapshot.
   *
   * Run the timer starting from the given snapshot.
   *
   * @param {BusySnapshotSetParams} params - Snapshot to set.
   *   @param {BusySnapshotSetParams['snapshot']} params.snapshot - Timer snapshot data.
   *   @param {BusySnapshotSetParams['snapshot_timestamp_ms']} params.snapshot_timestamp_ms - Snapshot timestamp in milliseconds.
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves on successfully set snapshot.
   */
  async BusySnapshotSet(this: BusyBar, params: BusySnapshotSetParams, options?: RequestOptions): Promise<SuccessResponse> {
    return await setSnapshotApi(this.apiClient, params, options);
  }

  /**
   * Get BUSY timer profile.
   *
   * Gets the BUSY timer profile under specified slot.
   *
   * @param {BusyProfileGetParams} params - Profile lookup parameters.
   *   @param {BusyProfileGetParams['slot']} params.slot - Profile slot.
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<BusyProfile>} BUSY timer profile for the given slot.
   */
  async BusyProfileGet(this: BusyBar, params: BusyProfileGetParams, options?: RequestOptions): Promise<BusyProfile> {
    return await getProfileApi(this.apiClient, params, options);
  }

  /**
   * Set BUSY timer profile.
   *
   * Sets the BUSY timer profile under specified slot.
   *
   * @param {BusyProfileSetParams} params - Profile to set.
   *   @param {BusyProfileSetParams['slot']} params.slot - Profile slot.
   * @param {RequestOptions} [options] - Optional request options.
   *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves on successfully set profile.
   */
  async BusyProfileSet(this: BusyBar, params: BusyProfileSetParams, options?: RequestOptions): Promise<SuccessResponse> {
    return await setProfileApi(this.apiClient, params, options);
  }
}
