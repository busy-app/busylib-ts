// Device font metrics: text width and vertical padding for any string.
//
// The maps in maps/ are generated from the firmware's .font files by tools/build-font-maps.mjs. See font-maps.d.ts for how `#font-maps` is resolved.

import { MAPS } from '#font-maps';

/** Fonts available in displayDraw. */
export type DeviceFont = 'tiny' | 'small' | 'normal' | 'condensed' | 'bold' | 'large' | 'extra_large' | 'global' | 'superscript';

/** One font as stored in maps/<font>.json. */
type RawFontMap = {
  lineHeight: number;
  ascent: number;
  descent: number;
  /** Lowest and highest code the font declares a glyph for. */
  firstCode: number;
  lastCode: number;
  /** Metrics for codes in range with no run of their own. */
  fallback: [number, number, number];
  /** Delta-coded [gapFromPrevEnd, length, advance, inkTop, inkH, …]. */
  runs: number[];
};

/** Decoded form: absolute codes, searched by bisection. */
type FontMap = {
  lineHeight: number;
  ascent: number;
  descent: number;
  firstCode: number;
  lastCode: number;
  fallback: [number, number, number];
  /** Start code of each run, ascending. */
  runStart: number[];
  /** End code of each run. */
  runEnd: number[];
  /** Metrics per run, flat: 3 numbers per entry. */
  runMetrics: number[];
};

/** Undoes the delta coding. Runs once per font, on first use. */
function decode(raw: RawFontMap): FontMap {
  const runStart: number[] = [];
  const runEnd: number[] = [];
  const runMetrics: number[] = [];
  let prevEnd = raw.firstCode;
  for (let i = 0; i < raw.runs.length; i += 5) {
    const first = prevEnd + raw.runs[i]!;
    const last = first + raw.runs[i + 1]!;
    runStart.push(first);
    runEnd.push(last);
    runMetrics.push(raw.runs[i + 2]!, raw.runs[i + 3]!, raw.runs[i + 4]!);
    prevEnd = last;
  }

  return {
    lineHeight: raw.lineHeight,
    ascent: raw.ascent,
    descent: raw.descent,
    firstCode: raw.firstCode,
    lastCode: raw.lastCode,
    fallback: raw.fallback,
    runStart,
    runEnd,
    runMetrics
  };
}

const RAW: Record<string, RawFontMap> = {};
const DECODED: Record<string, FontMap> = {};

/** Measurements already taken, by font and string. Dropped whole once full: an app's working set is far smaller than this. */
const LIMIT = 512;

const widths = new Map<string, number>();
const boxes = new Map<string, { top: number; height: number }>();
const inks = new Map<string, { top: number; height: number }>();

/** Cap metrics, by font. One entry per font, so it needs no limit. */
const caps: Record<string, { top: number; height: number }> = {};

/** The cache key. The separator cannot occur in a font name. */
function keyFor(text: string, font: DeviceFont): string {
  return `${font}\0${text}`;
}

/** Makes a font measurable. Each map in maps/ holds one. */
export function registerFontMaps(extra: { fonts: Record<string, unknown> }): void {
  for (const [name, raw] of Object.entries(extra.fonts)) {
    RAW[name] = raw as RawFontMap;
    delete DECODED[name];
  }

  // New metrics: whatever was measured under the old ones no longer holds.
  widths.clear();
  boxes.clear();
  inks.clear();
  for (const name in caps) {
    delete caps[name];
  }
}

for (const map of MAPS) registerFontMaps(map);

function mapFor(font: DeviceFont): FontMap {
  const ready = DECODED[font];
  if (ready) return ready;
  const raw = RAW[font];
  if (!raw) {
    throw new Error(`font "${font}" has no metrics loaded — pass its map to registerFontMaps()`);
  }
  const decoded = decode(raw);
  DECODED[font] = decoded;
  return decoded;
}

/** Glyph metrics: [advance, inkTop, inkH]. */
type Metrics = readonly [number, number, number];

/** Index of the last run starting at or before `code`, or -1. */
function runAt(starts: readonly number[], code: number): number {
  let lo = 0;
  let hi = starts.length - 1;
  let found = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (starts[mid]! <= code) {
      found = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return found;
}

/**
 * Metrics of a character. Null outside the font's range; inside it, a code with no glyph of its own falls back to the map's default metrics.
 */
function metricsOf(ch: string, map: FontMap): Metrics | null {
  const code = ch.codePointAt(0);
  if (code === undefined || code < map.firstCode || code > map.lastCode) return null;

  const r = runAt(map.runStart, code);
  if (r >= 0 && code <= map.runEnd[r]!) {
    const at = r * 3;
    return [map.runMetrics[at]!, map.runMetrics[at + 1]!, map.runMetrics[at + 2]!];
  }
  return map.fallback;
}

/** String width in pixels. Advances include letter spacing; no kerning. */
export function textWidth(text: string, font: DeviceFont): number {
  const key = keyFor(text, font);
  const known = widths.get(key);
  if (known !== undefined) {
    return known;
  }

  const map = mapFor(font);
  let width = 0;
  for (const ch of text) {
    const m = metricsOf(ch, map);
    if (m) width += m[0];
  }

  if (widths.size >= LIMIT) {
    widths.clear();
  }
  widths.set(key, width);
  return width;
}

/**
 * Vertical metrics in visible pixel coordinates, taken from the string's own characters. Subtract `top` to put the pixels on a given row. Zeros for an empty string.
 */
export function textInk(text: string, font: DeviceFont): { top: number; height: number } {
  const key = keyFor(text, font);
  const known = inks.get(key);
  if (known !== undefined) {
    return known;
  }

  const map = mapFor(font);
  let top = Infinity;
  let bottom = -Infinity;

  for (const ch of text) {
    const m = metricsOf(ch, map);
    if (!m) continue;
    const h = m[2];
    // Empty glyphs (space) have no pixels to bound.
    if (h === 0) continue;
    const t = m[1];
    if (t < top) top = t;
    if (t + h > bottom) bottom = t + h;
  }

  const ink = top === Infinity ? { top: 0, height: 0 } : { top, height: bottom - top };

  if (inks.size >= LIMIT) {
    inks.clear();
  }
  inks.set(key, ink);
  return ink;
}

/** Font line height (ascent − descent). Wider than the visible pixels. */
export function lineHeight(font: DeviceFont): number {
  return mapFor(font).lineHeight;
}

/** Distance from the top of the line to where glyphs sit (`ascent`). */
export function fontBaseline(font: DeviceFont): number {
  return mapFor(font).ascent;
}

/**
 * Where a capital sits on the line, and how tall it is, in visible pixels.
 *
 * Unlike `lineHeight` and `fontBaseline`, this covers only lit rows, so lines stacked by it sit the asked-for distance apart. Descenders hang below the box.
 */
export function capBox(font: DeviceFont): { top: number; height: number } {
  const known = caps[font];
  if (known !== undefined) {
    return known;
  }

  const ink = textInk('X', font);
  const box = ink.height > 0 ? ink : { top: 0, height: mapFor(font).ascent };
  caps[font] = box;
  return box;
}

/**
 * Layout box: from the top of the visible pixels to the baseline. Unlike `textInk`, descenders hang outside it.
 */
export function textLayoutBox(text: string, font: DeviceFont): { top: number; height: number } {
  const key = keyFor(text, font);
  const known = boxes.get(key);
  if (known !== undefined) {
    return known;
  }

  const map = mapFor(font);
  const baseline = map.ascent;
  let top = Infinity;

  for (const ch of text) {
    const m = metricsOf(ch, map);
    if (!m || m[2] === 0) continue;
    const t = m[1];
    if (t < top) top = t;
  }

  const box = top === Infinity ? { top: 0, height: 0 } : { top, height: Math.max(0, baseline - top) };

  if (boxes.size >= LIMIT) {
    boxes.clear();
  }
  boxes.set(key, box);
  return box;
}
