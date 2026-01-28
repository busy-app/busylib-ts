/**
 * Checks if value is a valid mDNS hostname (ends with .local)
 * @param value String to check
 */
export function isMdns(value: string): boolean {
  return /\.local$/i.test(value);
}
