import type { HighlightRect } from '../types';

/**
 * Calculate a bounding box that encompasses all given rectangles
 */
export function calculateBoundingBox(rects: HighlightRect[]): HighlightRect {
  if (rects.length === 0) {
    throw new Error('No rectangles provided');
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  rects.forEach((r) => {
    minX = Math.min(minX, r.x);
    minY = Math.min(minY, r.y);
    maxX = Math.max(maxX, r.x + r.width);
    maxY = Math.max(maxY, r.y + r.height);
  });

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

/**
 * Convert DOMRect array (from getClientRects) to page-relative coordinates
 */
export function clientRectsToPageRelative(
  clientRects: DOMRect[],
  pageElement: Element
): HighlightRect[] {
  const pageRect = pageElement.getBoundingClientRect();

  return clientRects.map((r) => ({
    x: r.left - pageRect.left,
    y: r.top - pageRect.top,
    width: r.width,
    height: r.height,
  }));
}

/**
 * Filter out very small rectangles (likely artifacts)
 */
export function filterSmallRects(
  rects: HighlightRect[],
  minWidth: number = 2,
  minHeight: number = 2
): HighlightRect[] {
  return rects.filter((r) => r.width >= minWidth && r.height >= minHeight);
}

/**
 * Merge adjacent rectangles on the same line to reduce visual clutter
 */
export function mergeAdjacentRects(
  rects: HighlightRect[],
  yTolerance: number = 5,
  xGapTolerance: number = 10
): HighlightRect[] {
  if (rects.length === 0) return [];

  // Sort by y position, then x position
  const sorted = [...rects].sort((a, b) => {
    const yDiff = a.y - b.y;
    if (Math.abs(yDiff) > yTolerance) return yDiff;
    return a.x - b.x;
  });

  const merged: HighlightRect[] = [];
  let current = { ...sorted[0] };

  for (let i = 1; i < sorted.length; i++) {
    const next = sorted[i];
    const sameLine = Math.abs(next.y - current.y) <= yTolerance;
    const adjacent = next.x <= current.x + current.width + xGapTolerance;

    if (sameLine && adjacent) {
      // Merge with current
      const newRight = Math.max(current.x + current.width, next.x + next.width);
      current.width = newRight - current.x;
      current.height = Math.max(current.height, next.height);
    } else {
      // Push current and start new
      merged.push(current);
      current = { ...next };
    }
  }

  merged.push(current);
  return merged;
}

/**
 * Scale highlight rectangles based on zoom level
 */
export function scaleRects(
  rects: HighlightRect[],
  scale: number
): HighlightRect[] {
  return rects.map((r) => ({
    x: r.x * scale,
    y: r.y * scale,
    width: r.width * scale,
    height: r.height * scale,
  }));
}

/**
 * Normalize rectangles to scale 1.0 for storage
 */
export function normalizeRects(
  rects: HighlightRect[],
  currentScale: number
): HighlightRect[] {
  if (currentScale === 1) return rects;
  return rects.map((r) => ({
    x: r.x / currentScale,
    y: r.y / currentScale,
    width: r.width / currentScale,
    height: r.height / currentScale,
  }));
}
