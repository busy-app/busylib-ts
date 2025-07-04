type IPv4 = string;

function isIPv4(str: string): str is IPv4 {
  const parts = str.split(".");
  if (parts.length !== 4) {
    return false;
  }

  for (const part of parts) {
    if (
      part.length === 0 ||
      (part.length > 1 && part[0] === "0") ||
      !/^\d+$/.test(part)
    ) {
      return false;
    }

    const num = Number(part);
    if (num < 0 || num > 255) {
      return false;
    }
  }

  return true;
}

export default isIPv4;
export type { IPv4 };
