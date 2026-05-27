import type { BusyBarClient } from 'BusyBar/types/internal';
import type { InputKeyParams } from 'BusyBar/types';

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
