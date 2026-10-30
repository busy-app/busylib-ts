import type { RequestClient } from 'BusyBar/client/types';
import type { RequestOptionsFor } from 'BusyBar/client/types.internal';
import type { AudioPlayParams, AudioVolumeInfo, AudioVolumeParams } from 'BusyBar/scopes/audio/types';
import type { SuccessResponse } from 'BusyBar/types';

/**
 * Play audio file. Plays a file from the app's assets directory.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {AudioPlayParams} params - Parameters for audio playback.
 *   @param {AudioPlayParams['application_name']} params.application_name - Application name.
 *   @param {string} [params.path] - Path to the audio file within the app's assets directory.
 *   @param {string} [params.stock_path] - Stock audio file name. Mutually exclusive with `path`.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<SuccessResponse>} A promise that resolves on successful play command.
 */
export async function audioPlay<C extends RequestClient>(client: C, params: AudioPlayParams, options?: RequestOptionsFor<C>): Promise<SuccessResponse> {
  const { application_name } = params;
  const pathOrStock = 'path' in params ? { path: params.path } : { stock_path: params.stock_path };

  return client.POST('/audio/play', {
    body: {
      application_name,
      ...pathOrStock
    },
    ...options
  });
}

/**
 * Stop audio playback. Stops any currently playing audio.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<SuccessResponse>} A promise that resolves on successful stop command.
 */
export async function audioStop<C extends RequestClient>(client: C, options?: RequestOptionsFor<C>): Promise<SuccessResponse> {
  return client.DELETE('/audio/play', options);
}

/**
 * Get audio volume.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<AudioVolumeInfo>} A promise that resolves to the audio volume information.
 */
export async function audioVolumeGet<C extends RequestClient>(client: C, options?: RequestOptionsFor<C>): Promise<AudioVolumeInfo> {
  return client.GET('/audio/volume', options);
}

/**
 * Set audio volume.
 *
 * @param {RequestClient} client - BUSY Bar client.
 * @param {AudioVolumeParams} params - Volume parameters:
 *   @param {AudioVolumeParams['volume']} params.volume - Volume level (0-100).
 * @param {RequestOptions} [options] - Optional request options.
 *   @param {RequestOptions['timeout']} [options.timeout] - Request timeout in milliseconds.
 *   @param {RequestOptions['signal']} [options.signal] - AbortSignal to cancel the request.
 * @returns {Promise<SuccessResponse>} A promise that resolves on success.
 */
export async function audioVolumeSet<C extends RequestClient>(client: C, params: AudioVolumeParams, options?: RequestOptionsFor<C>): Promise<SuccessResponse> {
  const { volume, silent } = params;

  if (typeof volume !== 'number' || volume < 0 || volume > 100) {
    throw new Error('Volume must be a number between 0 and 100');
  }

  return client.POST('/audio/volume', {
    params: {
      query: {
        volume,
        silent
      }
    },
    ...options
  });
}
