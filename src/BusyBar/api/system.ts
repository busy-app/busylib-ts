import { client } from "BusyBar/api/createClient";

async function version() {
  if (!client) {
    throw new Error("API client is not initialized");
  }

  const { data, error } = await client.GET("/version");

  if (error) {
    throw error;
  }

  return data;
}

export { version };
