# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Liquid Science** is a full-stack web application for PDF document annotation with a spatial canvas-based relationship mapping system. It integrates with Zotero's document storage for managing academic papers and research documents.

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
npm run preview      # Preview production build
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
  utils/            # Coordinate conversion, text extraction
  types.ts          # TypeScript interfaces
  api.ts            # Backend API client

backend/
  main.py           # FastAPI server with 5 endpoints
  projects/         # Saved project JSON files
```

### Key Components

- **Canvas.tsx**: ReactFlow-based node canvas for snippet visualization
- **PDFViewer.tsx**: PDF document viewer with react-pdf
- **SelectionLayer.tsx**: Text selection overlay for creating snippets
- **PersistentHighlights.tsx**: Renders highlights tied to canvas nodes
- **SnippetNodeComponent.tsx**: Individual canvas node with source location

### Backend API Endpoints

```
GET  /files              - List PDF/HTML files from PDF_DIR
GET  /pdf/{filename}     - Stream PDF file
GET  /html/{filename}    - Stream HTML file
POST /save               - Save project JSON to PROJECTS_DIR
```

### Coordinate Systems

The codebase manages two coordinate systems:
- **PDF Coordinates**: Bottom-left origin (used in `PDFLocation`)
- **DOM Coordinates**: Top-left origin (used for highlights/selections)

Conversion utilities are in `frontend/src/utils/coordinates.ts`.

### State Persistence

Zustand persists state to localStorage under key `liquid-science-storage`. This includes PDF state, canvas nodes/edges, highlights, and project metadata.

### Environment Configuration

Backend uses hardcoded paths in `main.py`:
- `PDF_DIR`: Path to Zotero storage (default: `C:/Users/JOG/Zotero/storage`)
- `PROJECTS_DIR`: Path for saving projects (default: `./projects`)

## Key Data Types

- **SnippetNode**: Canvas node containing text excerpt with PDF source location
- **PersistentHighlight**: Highlight rectangles tied to canvas nodes
- **PDFLocation**: Page index + position in PDF coordinates
- **ProjectData**: Complete project serialization format
