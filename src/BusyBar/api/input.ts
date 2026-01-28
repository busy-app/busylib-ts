import { getClient, withTimeout } from "BusyBar/api/createClient";
import type { TimeoutOptions } from "Global/types";
import { KeyName } from "Global/types";

export interface InputKeyParams extends TimeoutOptions {
  keyName: KeyName;
}
async function setInputKey(params: InputKeyParams) {
  const client = getClient();

  const { keyName } = params;

  const { data, error } = await withTimeout(
    (signal) =>
      client.POST("/input", {
        params: {
          query: {
            key: keyName,
          },
        },
        signal,
      }),
    params.timeout
  );

  if (error) {
    throw error;
  }

  return data;
}

export { setInputKey };
