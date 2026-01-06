import { useAppStore } from '../store/useAppStore';
import { scaleRects } from '../utils/highlightUtils';

/**
 * PersistentHighlights renders saved text highlights on the current PDF page.
 * Each highlight can span multiple rectangles for multi-line selections.
 */
export function PersistentHighlights() {
  const currentPage = useAppStore((state) => state.pdfViewerState.currentPage);
  const scale = useAppStore((state) => state.pdfViewerState.scale);
  const highlights = useAppStore((state) => state.highlights);
  const selectedPdf = useAppStore((state) => state.selectedPdf);

  // Filter highlights for current page AND current PDF
  const pageHighlights = highlights.filter(
    (h) => h.pageIndex === currentPage - 1 && h.pdfPath === selectedPdf?.path
  );

  if (pageHighlights.length === 0) return null;

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 8 }}
    >
      {pageHighlights.map((highlight) => {
        // Scale rects based on current zoom level
        const scaledRects = scaleRects(highlight.rects, scale);

        return (
          <div key={highlight.id}>
            {scaledRects.map((rect, idx) => (
              <div
                key={`${highlight.id}-${idx}`}
                className="absolute highlight-rect"
                style={{
                  left: rect.x,
                  top: rect.y,
                  width: rect.width,
                  height: rect.height,
                  backgroundColor: highlight.color || 'rgba(255, 255, 0, 0.4)',
                  mixBlendMode: 'multiply',
                }}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
