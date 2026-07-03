/** Frame payload, shared across all displays. */
export interface RenderParams {
  canvas: HTMLCanvasElement;
  data: Uint8Array | Uint8ClampedArray;
  width: number;
  height: number;
}

/** Render options for the front LED screen (rounded-pixel grid look). */
export interface LedRenderOptions {
  /** 0–1, size of each cell within its grid slot. */
  pixelSize?: number;
  /** 0–1, corner radius of each pixel. */
  radius?: number;
  /** 0-1, pixels darker than this are rendered transparent. */
  darkThreshold?: number;
}

/** Render options for the back OLED screen. */
export type OledRenderOptions = Record<string, never>;
