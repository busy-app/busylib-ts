import { client } from "BusyBar/api/createClient";
import { KeyName } from "Global/types";

export interface InputKeyParams {
  keyName: KeyName;
}
async function setInputKey(params: InputKeyParams) {
  if (!client) {
    throw new Error("API client is not initialized");
  }

  const { keyName } = params;

  const { data, error } = await client.POST("/input", {
    params: {
      query: {
        key: keyName,
      },
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

export { setInputKey };
