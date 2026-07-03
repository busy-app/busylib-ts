import type { BusyBarClient } from 'BusyBar/types/internal';
import type { RequestOptions, InputKeyParams } from 'BusyBar/types';

async function setInputKey(client: BusyBarClient, params: InputKeyParams, options?: RequestOptions) {
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
    options
  );

  if (error) {
    throw error;
  }

  return data;
}

export { setInputKey };
