import type { BusyBarClient } from 'BusyBar/api/createClient';
import type { TimeoutOptions, AudioPlayQuery, AudioVolumeQuery } from 'Global/types';

export interface AudioPlayParams extends TimeoutOptions, AudioPlayQuery {}

async function play(client: BusyBarClient, params: AudioPlayParams) {
  const { application_name, path } = params;

  const { data, error } = await client.withTimeout(
    (signal) =>
      client.POST('/audio/play', {
        params: {
          query: {
            application_name,
            path
          }
        },
        signal
      }),
    params.timeout
  );

  if (error) {
    throw error;
  }

  return data;
}

async function stop(client: BusyBarClient, params?: TimeoutOptions) {
  const { data, error } = await client.withTimeout((signal) => client.DELETE('/audio/play', { signal }), params?.timeout);

  if (error) {
    throw error;
  }

  return data;
}

async function getAudioVolume(client: BusyBarClient, params?: TimeoutOptions) {
  const { data, error } = await client.withTimeout((signal) => client.GET('/audio/volume', { signal }), params?.timeout);

  if (error) {
    throw error;
  }

  return data;
}

export interface AudioVolumeParams extends TimeoutOptions, AudioVolumeQuery {}

async function setAudioVolume(client: BusyBarClient, params: AudioVolumeParams) {
  const { volume, silent } = params;

  if (typeof volume !== 'number' || volume < 0 || volume > 100) {
    throw new Error('Volume must be a number between 0 and 100');
  }

  const { data, error } = await client.withTimeout(
    (signal) =>
      client.POST('/audio/volume', {
        params: {
          query: {
            volume,
            silent
          }
        },
        signal
      }),
    params.timeout
  );

  if (error) {
    throw error;
  }

  return data;
}

export { play, stop, getAudioVolume, setAudioVolume };
