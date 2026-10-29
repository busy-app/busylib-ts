// Placement: measured tree → flat elements[] for DisplayDraw. Coordinates are absolute from the screen's top-left, and elements keep the default align.

import type { DisplayDrawParams } from 'BusyBar/scopes/display/types';
import { measure, type Measured } from 'Utils/layout/measure';
import { isContainer, resolvePadding, type CrossAlign, type MainAlign, type Node } from 'Utils/layout/types';

type Elements = NonNullable<DisplayDrawParams['elements']>;
type Element = Elements[number];

/** BUSY Bar screen; FRONT and BACK share this size. */
export const SCREEN = { width: 72, height: 16 } as const;

export type FrameOptions = {
  /** Screen for every element in the frame. Defaults to `front`. */
  display?: 'front' | 'back';
  /** Size of the layout area. Defaults to the whole screen. */
  width?: number;
  height?: number;
};

/** Main-axis offset for a given distribution. */
function mainOffset(free: number, justify: MainAlign, count: number): { start: number; step: number } {
  // Overflowing content sticks to the start.
  if (free <= 0) return { start: 0, step: 0 };

  switch (justify) {
    case 'center':
      // An odd remainder goes to the far edge.
      return { start: Math.floor(free / 2), step: 0 };
    case 'end':
      return { start: free, step: 0 };
    case 'between':
      return count > 1 ? { start: 0, step: free / (count - 1) } : { start: 0, step: 0 };
    default:
      return { start: 0, step: 0 };
  }
}

/**
 * Cross-axis offset. `baseline` lines up the bottom edges of the visible pixels;
 * same as `end` for non-text nodes.
 */
function crossOffset(free: number, align: CrossAlign): number {
  if (free <= 0) return 0;
  switch (align) {
    case 'center':
      return Math.floor(free / 2);
    case 'end':
    case 'baseline':
      return free;
    default:
      return 0;
  }
}

/** Lays out the measured tree into `out`. (x, y) is the node's top-left. */
function place(m: Measured, baseX: number, baseY: number, display: 'front' | 'back', out: Element[]): void {
  const node = m.node;

  // Applied once per node, leaf or container, and only here.
  const offset = node as { dx?: number; dy?: number };
  const dx = offset.dx ?? 0;
  const dy = offset.dy ?? 0;
  const x = baseX + dx;
  const y = baseY + dy;

  if (!isContainer(node)) {
    // y is the top of the line, not of the pixels.
    out.push(toElement(node, x, y - m.inkTop, display));
    return;
  }

  const pad = resolvePadding(node.padding);
  const innerX = x + pad.left;
  const innerY = y + pad.top;
  const innerW = m.width - pad.left - pad.right;
  const innerH = m.height - pad.top - pad.bottom;

  const align: CrossAlign = node.align ?? 'start';

  if (node.type === 'stack') {
    // No main axis: justify is horizontal, align vertical. `between` falls back to start.
    const horizontal: CrossAlign = node.justify === 'between' ? 'start' : (node.justify ?? 'start');
    const vertical = align;
    for (let i = 0; i < m.children.length; i++) {
      const child = m.children[i]!;
      const cx = innerX + crossOffset(innerW - child.width, horizontal);
      const cy = innerY + crossOffset(innerH - child.height, vertical);
      place(child, cx, cy, display, out);
    }
    return;
  }

  const horizontal = node.type === 'row';
  const gap = node.gap ?? 0;
  const count = m.children.length;
  // One pass for both: the size taken along the main axis, and the largest rise above the line that text children align to.
  let used = 0;
  let rowBaseline = 0;
  for (let i = 0; i < count; i++) {
    const child = m.children[i]!;
    used += horizontal ? child.width : child.height;

    if (horizontal) {
      const rise = child.baseline ?? 0;
      if (rise > rowBaseline) {
        rowBaseline = rise;
      }
    }
  }
  used += count > 1 ? gap * (count - 1) : 0;

  const free = (horizontal ? innerW : innerH) - used;
  const { start, step } = mainOffset(free, node.justify ?? 'start', count);

  let cursor = (horizontal ? innerX : innerY) + start;

  for (let i = 0; i < count; i++) {
    const child = m.children[i]!;
    let cx: number;
    let cy: number;

    if (horizontal) {
      cx = cursor;
      // Text sits on the shared baseline unless align says otherwise.
      cy =
        child.baseline !== null && (node.align === undefined || align === 'baseline')
          ? innerY + rowBaseline - child.baseline
          : innerY + crossOffset(innerH - child.height, align);
      cursor += child.width + gap + step;
    } else {
      cy = cursor;
      cx = innerX + crossOffset(innerW - child.width, align);
      cursor += child.height + gap + step;
    }

    place(child, cx, cy, display, out);
  }
}

/**
 * Turns a leaf into a DisplayDraw element, dropping layout-only fields. A rectangle's width/height are element fields and stay.
 *
 * Copied key by key into one object: spreading and then deleting builds two and reshapes both.
 */
function toElement(node: Node, x: number, y: number, display: 'front' | 'back'): Element {
  const source = node as Record<string, unknown>;

  // Images, animations and countdowns carry a size for the layout only; the device works it out itself.
  const type = node.type;
  const sizeIsLayoutOnly = type === 'image' || type === 'animation' || type === 'countdown';

  const out: Record<string, unknown> = {};
  for (const key in source) {
    if (key === 'dx' || key === 'dy') {
      continue;
    }
    if (sizeIsLayoutOnly && (key === 'width' || key === 'height')) {
      continue;
    }
    out[key] = source[key];
  }

  out.x = Math.round(x);
  out.y = Math.round(y);
  if (out.display === undefined) out.display = display;

  return out as Element;
}

/** Lays out the tree and returns the elements for DisplayDraw. */
export function render(root: Node, options: FrameOptions = {}): Element[] {
  const display = options.display ?? 'front';
  const measured = measure(root);

  // The root stretches to the layout area unless it sets its own size.
  const framed: Measured = isContainer(root)
    ? {
        ...measured,
        width: root.width ?? options.width ?? SCREEN.width,
        height: root.height ?? options.height ?? SCREEN.height
      }
    : measured;

  const out: Element[] = [];
  place(framed, 0, 0, display, out);
  return out;
}
