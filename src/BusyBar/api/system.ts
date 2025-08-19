import { client } from "BusyBar/api/createClient";
import type { BusyFile } from "BusyBar/types/global";

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

export interface UpdateParams {
  name?: string;
  file: BusyFile;
}

async function update(params: UpdateParams) {
  if (!client) {
    throw new Error("API client is not initialized");
  }

  const { name, file } = params;

  const { data, error } = await client.POST("/update", {
    params: {
      query: {
        name,
      },
    },
    headers: {
      "Content-Type": "application/octet-stream",
    },
    body: file as unknown as string,
  });

  if (error) {
    throw error;
  }

  return data;
}

async function status() {
  if (!client) {
    throw new Error("API client is not initialized");
  }

  const { data, error } = await client.GET("/status");

  if (error) {
    throw error;
  }

  return data;
}

async function systemStatus() {
  if (!client) {
    throw new Error("API client is not initialized");
  }

  const { data, error } = await client.GET("/status/system");

  if (error) {
    throw error;
  }

  return data;
}

async function powerStatus() {
  if (!client) {
    throw new Error("API client is not initialized");
  }

  const { data, error } = await client.GET("/status/power");

  if (error) {
    throw error;
  }

  return data;
}

export { version, update, status, systemStatus, powerStatus };
