# Project Specification: "Zotero-Spatial" Research Canvas

## 1. Project Overview
We are building a local-first "Spatial Knowledge Management" web application. The concept is similar to **LiquidText**, but designed to sit on top of an existing **Zotero** library without duplicating files. 

**Core Workflow:** 1. The user opens a PDF from their local Zotero directory.
2. The user highlights text/areas in the PDF ("Scissoring").
3. This selection is extracted into a "Node" on an infinite canvas (React Flow).
4. **Bi-directional Linking:** Clicking the Node on the canvas automatically scrolls the PDF viewer to the specific page and highlights the original coordinate location.

## 2. Tech Stack
* **Frontend:** React (Vite), TypeScript, Tailwind CSS.
* **State Management:** Zustand (for managing canvas nodes and PDF interaction state).
* **Canvas Engine:** React Flow (latest version).
* **PDF Engine:** `react-pdf` (rendering) and standard DOM APIs for coordinate calculation.
* **Backend:** Python (FastAPI). 
    * *Reason:* Browsers cannot access local file systems directly due to security sandboxing. FastAPI will act as a local server to proxy the Zotero PDF files to the frontend and save the JSON project files.

## 3. Architecture & Data Structure

### A. The Backend (FastAPI)
* **Endpoint 1:** `GET /files` -> Scans a configured local directory (Zotero storage) and lists available PDFs.
* **Endpoint 2:** `GET /pdf/{filename}` -> Streams the binary PDF file to the frontend.
* **Endpoint 3:** `POST /save` -> Saves the current canvas layout and nodes to a `project.json` file.

### B. The Data Model (JSON)
The canvas does not store the PDF. It stores **Metadata Pointers**.
```json
{
  "id": "node-unique-id",
  "type": "snippetNode",
  "data": {
    "label": "Extracted Text Content...",
    "sourcePdf": "zotero-key-or-filename.pdf",
    "location": {
      "pageIndex": 3,
      "rect": { "x": 100, "y": 200, "width": 300, "height": 50 } 
    }
  },
  "position": { "x": 250, "y": 100 }
}