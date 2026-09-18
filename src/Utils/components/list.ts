// A scrolling list of strings, drawn straight to elements[].
//
//     ┌──────────────────┬─┐
//     │          17 Sep  │ │   the selection sits in the middle,
//     │          18 Sep  │█│   the thumb marks where it is
//     │          19 Sep  │ │
//     └──────────────────┴─┘
//
// Returns DisplayDraw elements rather than a layout tree: the geometry follows from the width, the line step and the side the scrollbar is on, so there is nothing to lay out.

import type { DisplayDrawParams } from 'BusyBar/types';
import { capBox, type DeviceFont } from 'Utils/font';

type Element = NonNullable<DisplayDrawParams['elements']>[number];

export interface ListStyle {
  /** Colour of every entry, in #RRGGBBAA. */
  color: string;
  /** Colour of the selected entry. */
  activeColor: string;
}

export interface ScrollbarStyle {
  /** Colour of the full-height track behind the thumb, in #RRGGBBAA. */
  trackColor: string;
  /** Colour of the thumb. */
  thumbColor: string;
}

export interface ListProps {
  /** Prefix for every element id, so several lists can share a screen. */
  id: string;
  /** The entries, in full; only those in view are drawn. */
  items: readonly string[];
  /** Index into `items` of the selected entry. The list scrolls to hold it in the middle. */
  selected: number;
  /** Where the list starts, from the screen's top-left. */
  x: number;
  y: number;
  /** How much room the list has, scrollbar included. */
  width: number;
  height: number;
  /** Font for every entry. */
  font: DeviceFont;
  /** Blank pixels between one entry and the next. */
  gap?: number;
  /** Colours of the entries. */
  style: ListStyle;
  /** Which edge the scrollbar sits on. The entries take the room left over beside it, and start at its far edge. Defaults to the right. */
  scrollbar?: 'right' | 'left' | 'none';
  /** Colors of the scrollbar. Required unless it is turned off. */
  scrollbarStyle?: ScrollbarStyle;
  /** Clear pixels between the entries and the scrollbar. */
  scrollbarGap?: number;
  /** Width of the scrollbar. Defaults to a single pixel. */
  scrollbarWidth?: number;
  /** Drawn above whatever shares the screen with the list. As `z_index` on the elements. */
  z_index?: number;
  display?: 'front' | 'back';
}

/**
 * The thumb of the scrollbar: the visible share of the list, never less than a pixel.
 *
 * Its travel is spread over the whole track, so where a step is worth less than a pixel the thumb holds still until enough entries have gone by.
 */
function thumbBox(total: number, visible: number, selected: number, track: number): { top: number; height: number } {
  if (total <= visible) {
    return { top: 0, height: track };
  }

  const height = Math.max(1, Math.round((visible / total) * track));
  const travel = track - height;
  const top = travel <= 0 ? 0 : Math.round((selected / (total - 1)) * travel);
  return { top, height };
}

/**
 * Builds the list.
 *
 * @param props - What the list holds and how it is drawn.
 * @returns The elements for DisplayDraw, in drawing order.
 */
export function list(props: ListProps): Element[] {
  const {
    id,
    items,
    selected,
    x,
    y,
    width,
    height,
    font,
    gap = 0,
    style,
    scrollbar = 'right',
    scrollbarStyle,
    scrollbarGap = 0,
    scrollbarWidth = 1,
    z_index,
    display = 'front'
  } = props;

  const out: Element[] = [];

  const barW = scrollbar === 'none' ? 0 : scrollbarWidth;
  const barGap = scrollbar === 'none' ? 0 : scrollbarGap;
  const textW = width - barW - barGap;

  // The entries take the edge away from the scrollbar.
  const onLeft = scrollbar === 'left';
  const textX = onLeft ? x + barW + barGap : x;
  const barX = onLeft ? x : x + width - barW;

  // Lit pixels only, so `gap` is the space actually seen between entries.
  const { top: capTop, height: textH } = capBox(font);
  const step = textH + gap;

  // The selection sits in the middle of the room the list has.
  const middle = y + Math.floor((height - textH) / 2);

  // Out to both edges, and one further: an entry that only half fits is drawn half, the screen cutting it off.
  const above = step > 0 ? Math.ceil((middle - y) / step) : 0;
  const below = step > 0 ? Math.ceil((y + height - middle - textH) / step) : 0;

  for (let offset = -above; offset <= below; offset++) {
    const index = selected + offset;
    const text = index >= 0 && index < items.length ? items[index]! : '';

    // On the font's cap line, not each entry's own pixels, so entries do not shift by the letters they hold.
    const top = middle + offset * step - capTop;

    // Ids follow the slot, not the entry: scrolling rewrites the texts in place.
    out.push({
      type: 'text',
      id: `${id}-row-${offset + above}`,
      text,
      font,
      color: index === selected ? style.activeColor : style.color,
      x: textX,
      y: top,
      // The firmware clips the entry to this width.
      width: textW,
      display,
      ...(z_index === undefined ? {} : { z_index })
    } as Element);
  }

  const visible = above + below + 1;

  if (scrollbar === 'none') {
    return out;
  }

  if (!scrollbarStyle) {
    throw new Error('list: scrollbarStyle is required unless scrollbar is "none"');
  }

  const box = thumbBox(items.length, visible, selected, height);

  out.push({
    type: 'rectangle',
    id: `${id}-track`,
    x: barX,
    y,
    width: barW,
    height,
    fill: 'solid',
    fill_colors: [scrollbarStyle.trackColor],
    border_width: 0,
    display,
    ...(z_index === undefined ? {} : { z_index })
  } as Element);

  out.push({
    type: 'rectangle',
    id: `${id}-thumb`,
    x: barX,
    y: y + box.top,
    width: barW,
    height: box.height,
    fill: 'solid',
    fill_colors: [scrollbarStyle.thumbColor],
    border_width: 0,
    display,
    ...(z_index === undefined ? {} : { z_index: z_index + 1 })
  } as Element);

  return out;
}
