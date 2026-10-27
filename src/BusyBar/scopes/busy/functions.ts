import type { BusyBarClient } from 'BusyBar/client/BusyBarClient';
import type { RequestOptions } from 'BusyBar/client/types';
import type { BusyProfile, BusyProfileGetParams, BusyProfileSetParams, BusySnapshot, BusySnapshotSetParams } from 'BusyBar/scopes/busy/types';
import type { SuccessResponse } from 'BusyBar/types';

/**
 * Get BUSY timer snapshot.
 *
 * Gets the current state of the BUSY timer in snapshot form.
 *
 * @param {BusyBarClient} client - BUSY Bar client.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<BusySnapshot>} Current BUSY timer snapshot.
 */
export async function busySnapshotGet(client: BusyBarClient, options?: RequestOptions): Promise<BusySnapshot> {
  return client.GET('/busy/snapshot', options);
}

/**
 * Set BUSY timer snapshot.
 *
 * Run the timer starting from the given snapshot.
 *
 * @param {BusyBarClient} client - BUSY Bar client.
 * @param {BusySnapshotSetParams} params - Snapshot to set.
 *   @param {BusySnapshotSetParams['snapshot']} params.snapshot - Timer snapshot data.
 *   @param {BusySnapshotSetParams['snapshot_timestamp_ms']} params.snapshot_timestamp_ms - Snapshot timestamp in milliseconds.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<SuccessResponse>} A promise that resolves on successfully set snapshot.
 */
export async function busySnapshotSet(client: BusyBarClient, params: BusySnapshotSetParams, options?: RequestOptions): Promise<SuccessResponse> {
  return client.PUT('/busy/snapshot', {
    body: params,
    ...options
  });
}

/**
 * Get BUSY timer profile.
 *
 * Gets the BUSY timer profile under specified slot.
 *
 * @param {BusyBarClient} client - BUSY Bar client.
 * @param {BusyProfileGetParams} params - Profile lookup parameters.
 *   @param {BusyProfileGetParams['slot']} params.slot - Profile slot.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<BusyProfile>} BUSY timer profile for the given slot.
 */
export async function busyProfileGet(client: BusyBarClient, params: BusyProfileGetParams, options?: RequestOptions): Promise<BusyProfile> {
  const { slot } = params;

  return client.GET('/busy/profiles/{slot}', {
    params: {
      path: { slot }
    },
    ...options
  });
}

/**
 * Set BUSY timer profile.
 *
 * Sets the BUSY timer profile under specified slot.
 *
 * @param {BusyBarClient} client - BUSY Bar client.
 * @param {BusyProfileSetParams} params - Profile to set.
 *   @param {BusyProfileSetParams['slot']} params.slot - Profile slot.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<SuccessResponse>} A promise that resolves on successfully set profile.
 */
export async function busyProfileSet(client: BusyBarClient, params: BusyProfileSetParams, options?: RequestOptions): Promise<SuccessResponse> {
  const { slot, ...body } = params;

  return client.PUT('/busy/profiles/{slot}', {
    params: {
      path: { slot }
    },
    body,
    ...options
  });
}
