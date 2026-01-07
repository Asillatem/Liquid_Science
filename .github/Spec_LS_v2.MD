Phase 1: Foundation & Configuration
Goal: Securely manage secrets and establish a robust database.

Task 1.1: Implement Environment Variables (.env)

Backend:

Add python-dotenv to backend/requirements.txt.

Update backend/main.py to load environment variables at startup.

Create a .env.example file with placeholders:

Ini, TOML

# Core
DATABASE_URL=sqlite:///./liquid_science.db

# Integrations
ZOTERO_USER_ID=
ZOTERO_API_KEY=
OPENAI_API_KEY=  # Future use
Replace the hardcoded PDF_DIR logic in main.py to rely on these variables or fallback gracefully.

Task 1.2: SQL Database Setup

Backend:

Replace project.json file storage with SQLModel (SQLite for now).

Define Tables:

User (id, zotero_id)

Project (id, user_id, name)

Node (id, project_id, content, zotero_item_key, position_x, position_y)

Edge (source_node_id, target_node_id)

Phase 2: Zotero "Universal" Data Layer
Goal: Treat Zotero as the file system for both PDFs and HTML Snapshots.

Task 2.1: Zotero Service Integration

Backend:

Install pyzotero.

Create services/zotero.py.

Implement get_library_items(): Fetch metadata for all items (PDFs and Web Snapshots).

Logic Change: Instead of listing files from a folder, this endpoint returns Zotero Item Objects.

Task 2.2: Universal File Handler (PDF & HTML)

Backend (GET /proxy/{item_key}):

Logic:

Check if item_key is cached in a temporary folder.

If not, use zot.dump(item_key, path) to download it.

MIME Type Detection:

If PDF: Return application/pdf.

If HTML Snapshot (Zip/Folder): Zotero often stores snapshots as ZIPs or folders containing an index.html.

Sub-task: Locate the primary .html file inside the snapshot.

Sub-task: Serve the HTML file content. (Note: You may need to rewrite relative paths in the HTML or serve the whole folder as static assets, but starting with serving the raw HTML string is a good MVP).

Phase 3: Frontend Adaptation
Goal: The viewer must be smart enough to handle different content types.

Task 3.1: Content Type Switcher

Frontend (src/types.ts):

Update FileEntry to include a contentType field ('application/pdf' or 'text/html').

Task 3.2: Universal Viewer Component

Frontend (PDFViewer.tsx):

Rename PDFViewer.tsx to DocumentViewer.tsx.

Render Logic:

If contentType === 'application/pdf': Render the existing <PDFViewer> (React-PDF).

If contentType === 'text/html': Render an <iframe> pointing to the backend proxy URL.

Note: Text highlighting in an iframe is harder than PDF. For MVP, just allow viewing the snapshot. For V2, we can inject a script into the iframe to handle selection.

Summary Checklist for the Agent
Refactor Request:

Environment: Add python-dotenv. Create .env file for ZOTERO_API_KEY and OPENAI_API_KEY.

Backend: Replace local file scanning with pyzotero.

HTML Support: In the download endpoint, detect if the Zotero item is a Web Snapshot. If so, unzip (if needed) and serve the index.html.

Frontend: In PDFLibrarySidebar, fetch items from Zotero API. In the Viewer, checks the file type:

PDF: Use existing React-PDF logic.

HTML: Render inside an <iframe>.

This setup solves your sharing problem (users bring their own Zotero keys) and prepares the ground for AI (API key is ready in .env). 