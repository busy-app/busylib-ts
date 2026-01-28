import { getClient, withTimeout } from "BusyBar/api/createClient";
import type { TimeoutOptions } from "Global/types";
import type { operations } from "Global/API";
import type { NameInfo } from "Global/types";

async function getDisplayBrightness(params?: TimeoutOptions) {
  const client = getClient();

  const { data, error } = await withTimeout(
    (signal) => client.GET("/display/brightness", { signal }),
    params?.timeout,
  );

  if (error) {
    throw error;
  }

  return data;
}

type Brightness = number | "auto";
export interface BrightnessParams extends TimeoutOptions {
  front?: Brightness;
  back?: Brightness;
}

async function setDisplayBrightness(params: BrightnessParams) {
  const client = getClient();

  const { front, back } = params;

  const normalize = (value?: Brightness): string | undefined => {
    if (typeof value === "number") {
      if (value < 0 || value > 100) {
        throw new Error("Brightness value must be between 0 and 100 or 'auto'");
      }
      return String(value);
    }
    if (value === "auto") {
      return "auto";
    }
    return undefined;
  };

  const frontQuery = normalize(front);
  const backQuery = normalize(back);

  const { data, error } = await withTimeout(
    (signal) =>
      client.POST("/display/brightness", {
        params: {
          query: {
            front: frontQuery,
            back: backQuery,
          },
        },
        signal,
      }),
    params.timeout,
  );

  if (error) {
    throw error;
  }

  return data;
}

async function getAudioVolume(params?: TimeoutOptions) {
  const client = getClient();

  const { data, error } = await withTimeout(
    (signal) => client.GET("/audio/volume", { signal }),
    params?.timeout,
  );

  if (error) {
    throw error;
  }

  return data;
}

export interface AudioVolumeParams extends TimeoutOptions {
  volume: operations["setAudioVolume"]["parameters"]["query"]["volume"];
}
async function setAudioVolume(params: AudioVolumeParams) {
  const client = getClient();

  const { volume } = params;

  if (typeof volume !== "number" || volume < 0 || volume > 100) {
    throw new Error("Volume must be a number between 0 and 100");
  }

  const { data, error } = await withTimeout(
    (signal) =>
      client.POST("/audio/volume", {
        params: {
          query: {
            volume,
          },
        },
        signal,
      }),
    params.timeout,
  );

  if (error) {
    throw error;
  }

  return data;
}

async function getHttpAccess(params?: TimeoutOptions) {
  const client = getClient();

  const { data, error } = await withTimeout(
    (signal) => client.GET("/access", { signal }),
    params?.timeout,
  );

  if (error) {
    throw error;
  }

  return data;
}

export interface HttpAccessParams extends TimeoutOptions {
  mode: operations["setHttpAccess"]["parameters"]["query"]["mode"];
  key: operations["setHttpAccess"]["parameters"]["query"]["key"];
}
async function setHttpAccess(params: HttpAccessParams) {
  const client = getClient();

  let { mode, key } = params;
  key = key ?? "";

  if (String(key).trim() && !/^\d{4,10}$/.test(String(key))) {
    throw new Error("Key must be a string of 4 to 10 digits");
  }

  const { data, error } = await withTimeout(
    (signal) =>
      client.POST("/access", {
        params: {
          query: {
            mode,
            key,
          },
        },
        signal,
      }),
    params.timeout,
  );

  if (error) {
    throw error;
  }

  return data;
}

async function getName(params?: TimeoutOptions) {
  const client = getClient();

  const { data, error } = await withTimeout(
    (signal) => client.GET("/name", { signal }),
    params?.timeout,
  );

  if (error) {
    throw error;
  }

  return data;
}

export interface NameParams extends TimeoutOptions {
  name: NameInfo["name"];
}

async function setName(params: NameParams) {
  const client = getClient();

  const { data, error } = await withTimeout(
    (signal) =>
      client.POST("/name", {
        body: params,
        signal,
      }),
    params.timeout,
  );

  if (error) {
    throw error;
  }

  return data;
}

export {
  getDisplayBrightness,
  setDisplayBrightness,
  getAudioVolume,
  setAudioVolume,
  getHttpAccess,
  setHttpAccess,
  getName,
  setName,
};
