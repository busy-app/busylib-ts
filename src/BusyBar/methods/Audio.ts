import {
  play as playApi,
  stop as stopApi,
  getAudioVolume as getAudioVolumeApi,
  setAudioVolume as setAudioVolumeApi
} from 'BusyBar/api/audio';
import type { RequestOptions, SuccessResponse, AudioVolumeInfo, AudioPlayParams, AudioVolumeParams } from 'BusyBar/types';
import { BusyBar } from 'BusyBar/index';

export class AudioMethods {
  /**
   * Play audio file. Plays a file from the app's assets directory.
   *
   * @param {AudioPlayParams} params - Parameters for audio playback.
   *   @param {AudioPlayParams['application_name']} params.application_name - Application name.
   *   @param {string} [params.path] - Path to the audio file within the app's assets directory.
   *   @param {string} [params.stock_path] - Stock audio file name. Mutually exclusive with `path`.
   *   @param {AudioPlayParams['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {AudioPlayParams['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves on successful play command.
   */
  async AudioPlay(this: BusyBar, params: AudioPlayParams): Promise<SuccessResponse> {
    return await playApi(this.apiClient, params);
  }

  /**
   * Stop audio playback. Stops any currently playing audio.
   *
   * @param {RequestOptions} [params] - Optional parameters.
   *   @param {RequestOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves on successful stop command.
   */
  async AudioStop(this: BusyBar, params?: RequestOptions): Promise<SuccessResponse> {
    return await stopApi(this.apiClient, params);
  }

  /**
   * Get audio volume.
   *
   * @param {RequestOptions} [params] - Optional parameters.
   *   @param {RequestOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {RequestOptions['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<AudioVolumeInfo>} A promise that resolves to the audio volume information.
   */
  async AudioVolumeGet(this: BusyBar, params?: RequestOptions): Promise<AudioVolumeInfo> {
    return await getAudioVolumeApi(this.apiClient, params);
  }

  /**
   * Set audio volume.
   *
   * @param {AudioVolumeParams} params - Volume parameters:
   *   @param {AudioVolumeParams['volume']} params.volume - Volume level (0-100).
   *   @param {AudioVolumeParams['timeout']} [params.timeout] - Request timeout in milliseconds.
   *   @param {AudioVolumeParams['signal']} [params.signal] - AbortSignal to cancel the request.
   * @returns {Promise<SuccessResponse>} A promise that resolves on success.
   */
  async AudioVolumeSet(this: BusyBar, params: AudioVolumeParams): Promise<SuccessResponse> {
    return await setAudioVolumeApi(this.apiClient, params);
  }
}
