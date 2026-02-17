import { withTimeout, type BusyBarClient } from "BusyBar/api/createClient";
import type { TimeoutOptions } from "Global/types";
import type { components, paths } from "Global/API";

export interface DrawParams extends TimeoutOptions {
  appId: components["schemas"]["DisplayElements"]["app_id"];
  elements: components["schemas"]["DisplayElements"]["elements"];
  /** @default 6 */
  priority?: components["schemas"]["DisplayElements"]["priority"];
}

async function draw(client: BusyBarClient, params: DrawParams) {
  const { appId, elements, priority = 6 } = params;

  const { data, error } = await withTimeout(
    (signal) =>
      client.POST("/display/draw", {
        body: {
          app_id: appId,
          priority: priority,
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
  value?: Brightness;
}

async function setDisplayBrightness(
  client: BusyBarClient,
  params: BrightnessParams,
) {
  const { value } = params;

  const normalize = (val?: Brightness): string | undefined => {
    if (typeof val === "number") {
      if (val < 0 || val > 100) {
        throw new Error("Brightness value must be between 0 and 100 or 'auto'");
      }
      return String(val);
    }
    if (val === "auto") {
      return "auto";
    }
    return undefined;
  };

  const valueQuery = normalize(value);

  const { data, error } = await withTimeout(
    (signal) =>
      client.POST("/display/brightness", {
        params: {
          query: {
            value: valueQuery,
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
