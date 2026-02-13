import {
  play as playApi,
  stop as stopApi,
  AudioPlayParams,
  getAudioVolume as getAudioVolumeApi,
  setAudioVolume as setAudioVolumeApi,
  AudioVolumeParams,
} from "BusyBar/api/audio";
import type {
  TimeoutOptions,
  SuccessResponse,
  AudioVolumeInfo,
} from "Global/types";
import { BusyBar } from "BusyBar/index";

export class AudioMethods {
  /**
   * Play audio file. Plays a file from internal storage.
   *
   * @param {AudioPlayParams} params - Parameters for audio playback.
   *   @param {string} params.appId - Application ID.
   *   @param {string} params.path - Path to the audio file.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} A promise that resolves on successful play command.
   */
  async AudioPlay(
    this: BusyBar,
    params: AudioPlayParams,
  ): Promise<SuccessResponse> {
    return await playApi(this.apiClient, params);
  }

  /**
   * @deprecated Use `AudioPlay` instead. will be removed in the next release.
   */
  async Audio(
    this: BusyBar,
    params: AudioPlayParams,
  ): Promise<SuccessResponse> {
    return this.AudioPlay(params);
  }

  /**
   * Stop audio playback. Stops any currently playing audio.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} A promise that resolves on successful stop command.
   */
  async AudioStop(
    this: BusyBar,
    params?: TimeoutOptions,
  ): Promise<SuccessResponse> {
    return await stopApi(this.apiClient, params);
  }

  /**
   * Get audio volume.
   *
   * @param {TimeoutOptions} [params] - Optional parameters.
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<AudioVolumeInfo>} A promise that resolves to the audio volume information.
   */
  async AudioVolumeGet(
    this: BusyBar,
    params?: TimeoutOptions,
  ): Promise<AudioVolumeInfo> {
    return await getAudioVolumeApi(this.apiClient, params);
  }

  /**
   * @deprecated Use `AudioVolumeGet` instead. will be removed in the next release.
   */
  async AudioVolume(
    this: BusyBar,
    params?: TimeoutOptions,
  ): Promise<AudioVolumeInfo> {
    return this.AudioVolumeGet(params);
  }

  /**
   * Set audio volume.
   *
   * @param {AudioVolumeParams} params - Volume parameters:
   *   @param {number} params.volume - Volume level (0-100).
   *   @param {TimeoutOptions['timeout']} [params.timeout] - Request timeout in milliseconds.
   * @returns {Promise<SuccessResponse>} A promise that resolves on success.
   */
  async AudioVolumeSet(
    this: BusyBar,
    params: AudioVolumeParams,
  ): Promise<SuccessResponse> {
    return await setAudioVolumeApi(this.apiClient, params);
  }
}
