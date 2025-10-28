import { client } from "BusyBar/api/createClient";
import type { operations } from "Global/API";

async function getDisplayBrightness() {
  if (!client) {
    throw new Error("API client is not initialized");
  }

  const { data, error } = await client.GET("/display/brightness");

  if (error) {
    throw error;
  }

  return data;
}

type Brightness = number | "auto";
export interface BrightnessParams {
  front?: Brightness;
  back?: Brightness;
}

async function setDisplayBrightness(params: BrightnessParams) {
  if (!client) {
    throw new Error("API client is not initialized");
  }

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

  const { data, error } = await client.POST("/display/brightness", {
    params: {
      query: {
        front: frontQuery,
        back: backQuery,
      },
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

async function getAudioVolume() {
  if (!client) {
    throw new Error("API client is not initialized");
  }

  const { data, error } = await client.GET("/audio/volume");

  if (error) {
    throw error;
  }

  return data;
}

export interface AudioVolumeParams {
  volume: operations["setAudioVolume"]["parameters"]["query"]["volume"];
}
async function setAudioVolume(params: AudioVolumeParams) {
  if (!client) {
    throw new Error("API client is not initialized");
  }

  const { volume } = params;

  if (typeof volume !== "number" || volume < 0 || volume > 100) {
    throw new Error("Volume must be a number between 0 and 100");
  }

  const { data, error } = await client.POST("/audio/volume", {
    params: {
      query: {
        volume,
      },
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

async function getHttpAccess() {
  if (!client) {
    throw new Error("API client is not initialized");
  }

  const { data, error } = await client.GET("/access");

  if (error) {
    throw error;
  }

  return data;
}

export interface HttpAccessParams {
  mode: operations["setHttpAccess"]["parameters"]["query"]["mode"];
  key: operations["setHttpAccess"]["parameters"]["query"]["key"];
}
async function setHttpAccess(params: HttpAccessParams) {
  if (!client) {
    throw new Error("API client is not initialized");
  }

  const { mode, key } = params;

  if (!/^\d{4,10}$/.test(String(key))) {
    throw new Error("Key must be a string of 4 to 10 digits");
  }

  const { data, error } = await client.POST("/access", {
    params: {
      query: {
        mode,
        key,
      },
    },
  });

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
};
