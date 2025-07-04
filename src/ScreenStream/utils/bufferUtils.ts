/**
 * Safely retrieves a byte from Uint8Array or throws if out of bounds
 */
function getAt(arr: Uint8Array, idx: number): number {
  // Check that index is within valid range
  if (idx < 0 || idx >= arr.length) {
    throw new Error(`Index ${idx} is out of bounds (0…${arr.length - 1})`);
  }

  // Retrieve the value at the given index
  const value = arr[idx];

  // Ensure the retrieved value is not undefined
  if (value === undefined) {
    // This should never happen because of the bounds check
    throw new Error(`Unexpected undefined at index ${idx}`);
  }

  // Return the validated value
  return value;
}

/**
 * Decompresses run-length encoded data
 * TypeScript analog of rle_decompress from Python
 */
export function rleDecompress(data: Uint8Array, blkSize: number): Uint8Array {
  let index = 0;
  const dataLen = data.length;
  const decompressed: number[] = [];

  while (index < dataLen) {
    const ctrlByte = getAt(data, index);
    index += 1;

    if ((ctrlByte & 0x80) !== 0) {
      // Unique blocks: ctrl_byte & 0x7F = unique sequence length
      const count = ctrlByte & 0x7f;
      for (let i = 0; i < count * blkSize; i++) {
        decompressed.push(data[index + i]!);
      }
      index += count * blkSize;
    } else {
      // Repeated block: ctrl_byte = repeat count
      const count = ctrlByte;
      const block = data.slice(index, index + blkSize);

      for (let i = 0; i < count; i++) {
        for (let j = 0; j < blkSize; j++) {
          decompressed.push(block[j]!);
        }
      }

      index += blkSize;
    }
  }

  return new Uint8Array(decompressed);
}

/**
 * Converts 4-bit packed data to 8-bit data
 * TypeScript analog of back_convert_b4_to_b8 from Python
 */
export function backConvertB4ToB8(data: Uint8Array): Uint8Array {
  const b8Bytes = new Uint8Array(data.length * 2);
  let i = 0;
  let j = 0;

  while (i < data.length) {
    const byte = getAt(data, i);

    const px1 = byte & 0x0f;
    const px2 = (byte >> 4) & 0x0f;
    b8Bytes[j] = px1;
    b8Bytes[j + 1] = px2;
    i += 1;
    j += 2;
  }

  return b8Bytes;
}
