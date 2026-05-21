import { Display } from 'BusyBar/types';

export function convertL4toRGBA(data: Uint8Array, width: number, height: number): Uint8ClampedArray {
  const rgba = new Uint8ClampedArray(width * height * 4);
  let pixelIdx = 0;

  for (let i = 0; i < data.length; i++) {
    const byte = data[i]!;

    const p1 = (byte & 0x0f) * 17;
    const p2 = ((byte >> 4) & 0x0f) * 17;

    const pixels = [p1, p2];

    for (const gray of pixels) {
      if (pixelIdx < width * height) {
        const offset = pixelIdx * 4;
        rgba[offset] = gray;
        rgba[offset + 1] = gray;
        rgba[offset + 2] = gray;
        rgba[offset + 3] = 255;
        pixelIdx++;
      }
    }
  }

  return rgba;
}

export function convertL8toRGBA(data: Uint8Array, width: number, height: number): Uint8ClampedArray {
  const rgba = new Uint8ClampedArray(width * height * 4);
  const len = Math.min(data.length, width * height);

  for (let i = 0; i < len; i++) {
    const gray = data[i]!;
    const offset = i * 4;
    rgba[offset] = gray;
    rgba[offset + 1] = gray;
    rgba[offset + 2] = gray;
    rgba[offset + 3] = 255;
  }

  return rgba;
}

export function convertRGB888toRGBA(data: Uint8Array, width: number, height: number): Uint8ClampedArray {
  return new Uint8ClampedArray(bgrToRgba(data, width, height).buffer);
}

const displayDimensions: Record<Display, { width: number; height: number }> = {
  [Display.FRONT]: { width: 72, height: 16 },
  [Display.BACK]: { width: 160, height: 80 }
};

export function getDisplayDimensions(display: Display): { width: number; height: number } {
  return displayDimensions[display];
}

export async function blobToUint8Array(blob: Blob): Promise<Uint8Array> {
  const text = await blob.text();

  try {
    const binaryString = atob(text.trim());
    const result = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      result[i] = binaryString.charCodeAt(i);
    }
    return result;
  } catch {
    return new Uint8Array(await blob.arrayBuffer());
  }
}

export function bgrToRgba(data: Uint8Array, width: number, height: number): Uint8Array {
  const rgba = new Uint8Array(width * height * 4);
  const pixelsCount = width * height;

  for (let i = 0; i < pixelsCount; i++) {
    const src = i * 3;
    const dst = i * 4;

    if (src + 2 < data.length) {
      rgba[dst] = data[src + 2]!;     // R
      rgba[dst + 1] = data[src + 1]!; // G
      rgba[dst + 2] = data[src]!;     // B
      rgba[dst + 3] = 255;            // A
    }
  }

  return rgba;
}
