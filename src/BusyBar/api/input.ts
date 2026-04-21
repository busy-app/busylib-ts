import type { BusyBarClient } from 'BusyBar/api/createClient';
import type { TimeoutOptions, InputKeyQuery } from 'Global/types';

export interface InputKeyParams extends TimeoutOptions, InputKeyQuery {}

async function setInputKey(client: BusyBarClient, params: InputKeyParams) {
  const { key } = params;

  const { data, error } = await client.withTimeout(
    (signal) =>
      client.POST('/input', {
        params: {
          query: {
            key
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

export { setInputKey };
