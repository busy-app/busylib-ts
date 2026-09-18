// Node measurement in visible pixels. Each node carries `inkTop`, which placement subtracts from the y it emits.

import { fontBaseline, textLayoutBox, textWidth } from 'Utils/font';
import { isContainer, resolvePadding, type Node } from 'Utils/layout/types';

/** A node with its size computed. The tree is measured bottom-up. */
export type Measured = {
  node: Node;
  /** Size of the visible pixels. */
  width: number;
  height: number;
  /** Empty rows above the first visible pixel. 0 for non-text. */
  inkTop: number;
  /** Font baseline relative to the top of the visible pixels; null for non-text. */
  baseline: number | null;
  /** Measured children (empty for a leaf). */
  children: Measured[];
};

/** Size of a leaf. Text is measured; other types carry their size in props. */
function measureLeaf(node: Node): Omit<Measured, 'node' | 'children'> {
  if (node.type === 'text') {
    // Runs to the baseline, excluding descenders.
    const box = textLayoutBox(node.text, node.font);
    return {
      width: textWidth(node.text, node.font),
      height: box.height,
      inkTop: box.top,
      // From the top of the visible pixels, not of the line.
      baseline: fontBaseline(node.font) - box.top
    };
  }
  // Optional to TS, required by the concrete node types.
  const sized = node as { width?: number; height?: number };
  return { width: sized.width ?? 0, height: sized.height ?? 0, inkTop: 0, baseline: null };
}

/**
 * Measures the tree bottom-up. Containers without an explicit size fit their content; a row's height is (max above the baseline) + (max below it).
 */
export function measure(node: Node): Measured {
  if (!isContainer(node)) {
    return { node, ...measureLeaf(node), children: [] };
  }

  // One pass per container, in plain loops: allocations are dear on the device's interpreter, and map/reduce/spread each cost one.
  const source = node.children;
  const count = source.length;
  const children: Measured[] = new Array<Measured>(count);
  for (let i = 0; i < count; i++) {
    children[i] = measure(source[i]!);
  }

  const pad = resolvePadding(node.padding);
  const gap = node.type === 'stack' ? 0 : (node.gap ?? 0);
  const gaps = count > 1 ? gap * (count - 1) : 0;

  let contentW = 0;
  let contentH = 0;
  // Inherited from the first text child.
  let baseline: number | null = null;

  if (node.type === 'row') {
    // Children with a baseline line up on it; the rest take their height.
    let above = 0;
    let below = 0;
    let anyBaseline = false;

    for (let i = 0; i < count; i++) {
      const child = children[i]!;
      contentW += child.width;

      const rise = child.baseline ?? child.height;
      if (rise > above) {
        above = rise;
      }

      const drop = child.height - rise;
      if (drop > below) {
        below = drop;
      }

      if (child.baseline !== null) {
        anyBaseline = true;
      }
    }

    contentW += gaps;
    contentH = above + below;
    baseline = anyBaseline ? above : null;
  } else if (node.type === 'column') {
    for (let i = 0; i < count; i++) {
      const child = children[i]!;
      if (child.width > contentW) {
        contentW = child.width;
      }
      contentH += child.height;
    }

    contentH += gaps;
    // A column's baseline is its first row's.
    baseline = count > 0 ? children[0]!.baseline : null;
  } else {
    for (let i = 0; i < count; i++) {
      const child = children[i]!;
      if (child.width > contentW) {
        contentW = child.width;
      }
      if (child.height > contentH) {
        contentH = child.height;
      }
    }
  }

  return {
    node,
    width: node.width ?? contentW + pad.left + pad.right,
    height: node.height ?? contentH + pad.top + pad.bottom,
    // Not propagated outward: the parent sees a solid block.
    inkTop: 0,
    baseline: baseline === null ? null : baseline + pad.top,
    children
  };
}
