export function convertEnum<T extends number, R>(map: Record<T, R>, value: T | null | undefined): R | null {
  if (value == null) return null;
  return map[value] ?? null;
}
