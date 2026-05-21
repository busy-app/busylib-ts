import type { BSB_Frame } from 'StateStream/types/schema';
import { convertL4toRGBA, convertL8toRGBA, convertRGB888toRGBA } from 'Global/utils/frameData';

export { convertL4toRGBA, convertL8toRGBA, convertRGB888toRGBA };

/**
 * Decompresses Run-Length Encoded (RLE) data.
 * Pattern: opcode & 0x80 = Literal (unique bytes), opcode & 0x7F = blockCount.
 */
export function decompressRLE(source: Uint8Array, blockSize: number): Uint8Array {
  const output: number[] = [];

  for (let sourceIndex = 0; sourceIndex < source.length; ) {
    const opcode = source[sourceIndex++];
    if (opcode === undefined) break;

    const blockCount = opcode & 0x7f;

    if (!blockCount) {
      continue;
    }

    if (opcode & 0x80) {
      // LITERAL: blockCount * blockSize bytes follow
      const byteLength = blockCount * blockSize;
      const chunk = source.subarray(sourceIndex, sourceIndex + byteLength);
      for (let i = 0; i < chunk.length; i++) {
        output.push(chunk[i]!);
      }
      sourceIndex += byteLength;
      continue;
    }

    // REPEAT: read one block and repeat it
    const block = source.subarray(sourceIndex, sourceIndex + blockSize);
    sourceIndex += blockSize;

    for (let count = 0; count < blockCount; count++) {
      for (let j = 0; j < blockSize; j++) {
        output.push(block[j]!);
      }
    }
  }

  return new Uint8Array(output);
}

/**
 * Decompresses Deflate data using native DecompressionStream.
 * Falls back to returning original data if not supported or fails.
 */
export async function decompressDeflate(data: Uint8Array): Promise<Uint8Array> {
  if (typeof DecompressionStream === 'undefined') {
    throw new Error('DecompressionStream is not supported in this environment.');
  }

  try {
    const ds = new DecompressionStream('deflate');
    const writer = ds.writable.getWriter();
    writer.write(data);
    writer.close();

    const response = new Response(ds.readable);
    const buffer = await response.arrayBuffer();
    return new Uint8Array(buffer);
  } catch (err) {
    throw new Error(`Deflate decompression failed: ${err instanceof Error ? err.message : String(err)}`);
  }
}


/**
 * Processes a frame: decompressing and converting to RGBA.
 */
export async function processFrame(frame: BSB_Frame.Frame): Promise<Uint8ClampedArray | null> {
  if (!frame.data || !frame.width || !frame.height) {
    return null;
  }

  let data = frame.data;

  // 1. Decompression
  // Determine RLE block size based on format
  // RGB888 (0) -> 3 bytes, L8 (1) -> 1 byte, L4 (2) -> 1 byte
  const blockSize = frame.pixelFormat === 0 ? 3 : 1;

  // Enums from BSB_Frame.Encoding (PLAIN=0, RUN_LENGTH=1, DEFLATE=2, DEFLATE_RUN_LENGTH=3)
  switch (frame.encoding) {
    case 1: // RUN_LENGTH
      data = decompressRLE(data, blockSize);
      break;
    case 2: // DEFLATE
      data = await decompressDeflate(data);
      break;
    case 3: // DEFLATE_RUN_LENGTH
      data = await decompressDeflate(data);
      data = decompressRLE(data, blockSize);
      break;
    // PLAIN (0) or unknown - do nothing
  }

  // 2. Format Conversion
  // Enums from BSB_Frame.PixelFormat (RGB888=0, L8=1, L4=2)
  switch (frame.pixelFormat) {
    case 2: // L4
      return convertL4toRGBA(data, frame.width, frame.height);
    case 1: // L8
      return convertL8toRGBA(data, frame.width, frame.height);
    case 0: // RGB888
      return convertRGB888toRGBA(data, frame.width, frame.height);
    default:
      // Unknown format? Fallback to L8 or just empty RGBA
      return new Uint8ClampedArray(frame.width * frame.height * 4);
  }
}
