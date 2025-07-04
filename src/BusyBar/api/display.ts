import { client } from "BusyBar/api/createClient";
import { paths, components } from "BusyBar/types/APIv0";

type MakeOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type OptionalFields = "timeout" | "x" | "y" | "display";

type CustomTextElement = MakeOptional<
  components["schemas"]["TextElement"],
  OptionalFields
>;
type CustomImageElement = MakeOptional<
  components["schemas"]["ImageElement"],
  OptionalFields
>;
type CustomElement = CustomTextElement | CustomImageElement;

export interface DrawParams {
  appId: paths["/v0/display/draw"]["post"]["requestBody"]["content"]["application/json"]["app_id"];
  elements: CustomElement[];
}

const DEFAULT_VALUES: Pick<
  components["schemas"]["DisplayElement"],
  OptionalFields
> = { timeout: 5, x: 0, y: 0, display: "front" };

function withDefaults(
  element: CustomElement
): Required<Pick<CustomElement, Exclude<OptionalFields, "timeout">>> &
  CustomElement {
  return { ...DEFAULT_VALUES, ...element };
}

async function draw(params: DrawParams) {
  const { appId, elements } = params;

  if (!client) {
    throw new Error("API client is not initialized");
  }

  const normalizedElements = elements.map(withDefaults);

  const { data, error } = await client.POST("/v0/display/draw", {
    body: {
      app_id: appId,
      elements: normalizedElements,
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

async function clear() {
  if (!client) {
    throw new Error("API client is not initialized");
  }

  const { data, error } = await client.DELETE("/v0/display/draw");

  if (error) {
    throw error;
  }

  return data;
}

export { draw, clear };
