# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Liquid Science** is a full-stack web application for PDF and HTML document annotation with a spatial canvas-based relationship mapping system. It integrates with Zotero's local document storage for managing academic papers and research documents. Users can extract text snippets from documents, place them on an infinite canvas, create relationships between them via edges, and add comments.

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Python FastAPI
- **State Management**: Zustand (with localStorage persistence)
- **Canvas**: ReactFlow for node-graph visualization
- **PDF Rendering**: react-pdf
- **Styling**: Tailwind CSS

## Commands

### Frontend (from `frontend/` directory)

```bash
npm install          # Install dependencies
npm run dev          # Development server (port 5173)
npm run build        # Production build (runs tsc -b && vite build)
npm run lint         # ESLint
```

### Backend (from `backend/` directory)

```bash
python -m venv venv                    # Create virtual environment
venv\Scripts\activate                   # Activate (Windows)
source venv/bin/activate                # Activate (macOS/Linux)
pip install -r requirements.txt         # Install dependencies
uvicorn main:app --reload --port 8000   # Run dev server
```

### Running Both Services

Start backend on port 8000, then frontend on port 5173. Frontend API calls are hardcoded to `http://localhost:8000`.

## Architecture

### Directory Structure

```
frontend/src/
  components/       # React components
  store/            # Zustand store (useAppStore.ts)
  utils/            # Coordinate conversion, text extraction, highlight utilities
  types.ts          # TypeScript interfaces
  api.ts            # Backend API client

backend/
  main.py           # FastAPI server with 4 endpoints
  projects/         # Saved project JSON files
```

### Key Components

- **Canvas.tsx**: ReactFlow-based node canvas for snippet visualization with edge connections
- **PDFViewer.tsx**: PDF document viewer with react-pdf, includes TextSelectionLayer and PersistentHighlights
- **HTMLViewer.tsx**: HTML document viewer for Zotero web snapshots (text selection not yet supported)
- **TextSelectionLayer.tsx**: Text selection overlay for creating snippets from PDFs
- **PersistentHighlights.tsx**: Renders highlights tied to canvas nodes (PDF-specific)
- **SnippetNodeComponent.tsx**: Individual canvas node with source location and comments
- **PDFLibrarySidebar.tsx**: File browser that routes PDFs vs HTML to appropriate viewers

### Backend API Endpoints

```
GET  /files              - List PDF/HTML files from PDF_DIR (recursive scan)
GET  /pdf/{filename}     - Stream PDF file by relative path
GET  /html/{filename}    - Stream HTML file by relative path
POST /save               - Save project JSON to PROJECTS_DIR
```

All endpoints include path traversal protection via `safe_resolve()` function.

### Coordinate Systems

The codebase manages two coordinate systems:
- **PDF Coordinates**: Bottom-left origin, Y increases upward (used in `PDFLocation`)
- **DOM Coordinates**: Top-left origin, Y increases downward (used for highlights/selections)

Conversion utilities in `frontend/src/utils/coordinates.ts`:
- `pdfToDomY()` / `domToPdfY()` - Y-axis conversion requires page height
- `pdfRectToDomRect()` / `domRectToPdfRect()` - Full rectangle conversion

### State Management

Zustand store (`useAppStore.ts`) manages:
- **PDF state**: selected file, current page, scale, temporary highlight
- **Canvas state**: nodes, edges
- **Highlights**: persistent highlights tied to nodes by matching IDs
- **Project metadata**: name, timestamps, active PDF

**Persistence**: Uses `zustand/middleware/persist` with `partialize` to selectively persist to localStorage (key: `liquid-science-storage`). Page position and temporary highlights are NOT persisted.

**Cascade deletion**: When `removeNode()` is called, associated edges and highlights are also removed.

### Environment Configuration

Backend uses environment variables with defaults in `main.py`:
- `PDF_DIR`: Path to Zotero storage (default: `C:/Users/JOG/Zotero/storage`)
- `PROJECTS_DIR`: Path for saving projects (default: `./projects`)

## Key Data Types

- **SnippetNode**: Canvas node with `id`, `type: 'snippetNode'`, `data` (label, sourcePdf, location, comments), `position`
- **SnippetEdge**: Connection between nodes with optional label (smoothstep bezier curves)
- **PersistentHighlight**: Highlight rectangles tied to canvas nodes by matching `id` (PDF-specific)
- **PDFLocation**: Page index + rect in PDF coordinates + optional `highlightRects` for multi-line
- **FileEntry**: File metadata with `type` field ('pdf' | 'html') for viewer routing

## Important Behaviors

### Bi-directional Navigation
Clicking a canvas node's "Jump to Source" button (via `jumpToSource`):
1. Switches the active document if needed
2. Navigates to the correct page
3. Sets `highlightedRect` for temporary visual feedback

### File Type Routing
`FileEntry.type` determines which viewer renders the document:
- `'pdf'` → PDFViewer.tsx (full text selection support)
- `'html'` → HTMLViewer.tsx (view-only for now)

### Multi-line Text Selection
Text selections can span multiple lines. `PersistentHighlight.rects` is an array to support this.
