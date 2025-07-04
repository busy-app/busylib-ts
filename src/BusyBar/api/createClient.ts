import createClient, { Client } from "openapi-fetch";
import type { paths } from "BusyBar/types/APIv0";

const bodySerializer = (body: unknown, headers?: HeadersInit) => {
  // FormData
  if (typeof FormData !== "undefined" && body instanceof FormData) {
    return body;
  }

  // Buffer (Node.js)
  if (
    typeof Buffer !== "undefined" &&
    typeof Buffer.isBuffer === "function" &&
    Buffer.isBuffer(body)
  ) {
    return body as Buffer;
  }

  // File (inherits from Blob)
  if (typeof File !== "undefined" && body instanceof File) {
    return body;
  }

  // Blob
  if (typeof Blob !== "undefined" && body instanceof Blob) {
    return body;
  }

  // ArrayBuffer
  if (typeof ArrayBuffer !== "undefined" && body instanceof ArrayBuffer) {
    return body;
  }

  // ArrayBufferView (example, Uint8Array)
  if (
    typeof ArrayBuffer !== "undefined" &&
    ArrayBuffer.isView &&
    ArrayBuffer.isView(body)
  ) {
    return body as ArrayBufferView;
  }

  let contentType: string | undefined;
  if (headers) {
    if (headers instanceof Headers) {
      contentType =
        headers.get("Content-Type") ?? headers.get("content-type") ?? undefined;
    } else if (typeof headers === "object") {
      contentType =
        (headers as Record<string, string>)["Content-Type"] ??
        (headers as Record<string, string>)["content-type"];
    }

    // URLSearchParams
    if (contentType === "application/x-www-form-urlencoded") {
      if (
        body &&
        typeof body === "object" &&
        !(body instanceof URLSearchParams)
      ) {
        return new URLSearchParams(body as Record<string, string>).toString();
      }
      return String(body);
    }
  }

  // Any
  return JSON.stringify(body);
};

let client: Client<paths, `${string}/${string}`> | null = null;
function initApiClient(url: string) {
  client = createClient<paths>({
    baseUrl: url,
    bodySerializer,
  });
}

export { initApiClient, client };
