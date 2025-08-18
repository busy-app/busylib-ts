import { client } from "BusyBar/api/createClient";
import type { components } from "BusyBar/types/API";
import type { DeepCamelize, RequireKeys } from "BusyBar/types/utils";

async function enable() {
  if (!client) {
    throw new Error("API client is not initialized");
  }

  const { data, error } = await client.POST("/wifi/enable");

  if (error) {
    throw error;
  }

  return data;
}

async function disable() {
  if (!client) {
    throw new Error("API client is not initialized");
  }

  const { data, error } = await client.POST("/wifi/disable");

  if (error) {
    throw error;
  }

  return data;
}

async function status() {
  if (!client) {
    throw new Error("API client is not initialized");
  }

  const { data, error } = await client.GET("/wifi/status");

  if (error) {
    throw error;
  }

  return data;
}

type CamelizedRequest = DeepCamelize<
  components["schemas"]["ConnectRequestConfig"]
>;

type RequiredIpConfig = RequireKeys<
  NonNullable<CamelizedRequest["ipConfig"]>,
  "ipMethod" | "ipType"
>;

export type ConnectParams = RequireKeys<
  Omit<CamelizedRequest, "ipConfig"> & { ipConfig: RequiredIpConfig },
  "ssid" | "security" | "ipConfig"
>;

async function connect(params: ConnectParams) {
  if (!client) {
    throw new Error("API client is not initialized");
  }

  const { data, error } = await client.POST("/wifi/connect", {
    body: {
      ssid: params.ssid,
      password: params.password,
      security: params.security,
      ip_config: {
        ip_method: params.ipConfig.ipMethod,
        ip_type: params.ipConfig.ipType,
        address: params.ipConfig.address,
        mask: params.ipConfig.mask,
        gateway: params.ipConfig.gateway,
      },
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

async function disconnect() {
  if (!client) {
    throw new Error("API client is not initialized");
  }

  const { data, error } = await client.POST("/wifi/disconnect");

  if (error) {
    throw error;
  }

  return data;
}

export type Network = components["schemas"]["Network"];

async function networks() {
  if (!client) {
    throw new Error("API client is not initialized");
  }

  const { data, error } = await client.GET("/wifi/networks");

  if (error) {
    throw error;
  }

  return data;
}

async function forget() {
  if (!client) {
    throw new Error("API client is not initialized");
  }

  const { data, error } = await client.POST("/wifi/forget");

  if (error) {
    throw error;
  }

  return data;
}

export { enable, disable, status, connect, disconnect, networks, forget };
