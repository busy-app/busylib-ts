import type { BusyBarClient } from 'BusyBar/types/internal';
import type { RequestOptions, InputKeyQuery } from 'BusyBar/types';

export interface InputKeyParams extends RequestOptions, InputKeyQuery {}

async function setInputKey(client: BusyBarClient, params: InputKeyParams) {
  const { key } = params;

  const { data, error } = await client.execute(
    (signal) =>
      client.POST('/input', {
        params: {
          query: {
            key
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

export { setInputKey };
