import { withTimeout, type BusyBarClient } from "BusyBar/api/createClient";
import type { TimeoutOptions } from "Global/types";
import type { components, paths } from "Global/API";

export interface DrawParams extends TimeoutOptions {
  appId: components["schemas"]["DisplayElements"]["app_id"];
  elements: components["schemas"]["DisplayElements"]["elements"];
}

async function draw(client: BusyBarClient, params: DrawParams) {
  const { appId, elements } = params;

  const { data, error } = await withTimeout(
    (signal) =>
      client.POST("/display/draw", {
        body: {
          app_id: appId,
          elements: elements,
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

async function clear(client: BusyBarClient, params?: TimeoutOptions) {
  const { data, error } = await withTimeout(
    (signal) => client.DELETE("/display/draw", { signal }),
    params?.timeout,
  );

  if (error) {
    throw error;
  }

  return data;
}

export interface GetScreenFrameParams extends TimeoutOptions {
  display: paths["/screen"]["get"]["parameters"]["query"]["display"];
}

async function getScreenFrame(
  client: BusyBarClient,
  params: GetScreenFrameParams,
) {
  const { display } = params;

  const { data, error } = await withTimeout(
    (signal) =>
      client.GET("/screen", {
        params: {
          query: {
            display,
          },
        },
        parseAs: "blob",
        signal,
      }),
    params.timeout,
  );

  if (error) {
    throw error;
  }

  return data;
}

async function getDisplayBrightness(
  client: BusyBarClient,
  params?: TimeoutOptions,
) {
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

async function setDisplayBrightness(
  client: BusyBarClient,
  params: BrightnessParams,
) {
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

export {
  draw,
  clear,
  getScreenFrame,
  getDisplayBrightness,
  setDisplayBrightness,
};
