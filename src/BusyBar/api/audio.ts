import type { BusyBarClient } from 'BusyBar/types/internal';
import type { RequestOptions, AudioPlayParams, AudioVolumeParams } from 'BusyBar/types';

async function play(client: BusyBarClient, params: AudioPlayParams) {
  const { application_name, path } = params;

  const { data, error } = await client.execute(
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
    params
  );

  if (error) {
    throw error;
  }

  return data;
}

async function stop(client: BusyBarClient, params?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.DELETE('/audio/play', {
        signal
      }),
    params
  );

  if (error) {
    throw error;
  }

  return data;
}

async function getAudioVolume(client: BusyBarClient, params?: RequestOptions) {
  const { data, error } = await client.execute(
    (signal) =>
      client.GET('/audio/volume', {
        signal
      }),
    params
  );

  if (error) {
    throw error;
  }

  return data;
}

async function setAudioVolume(client: BusyBarClient, params: AudioVolumeParams) {
  const { volume, silent } = params;

  if (typeof volume !== 'number' || volume < 0 || volume > 100) {
    throw new Error('Volume must be a number between 0 and 100');
  }

  const { data, error } = await client.execute(
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
    params
  );

  if (error) {
    throw error;
  }

  return data;
}

export { play, stop, getAudioVolume, setAudioVolume };
