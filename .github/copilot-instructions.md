Purpose
-------
This repository currently has no source files in the workspace root. These instructions tell an AI coding agent how to be immediately productive here: how to discover missing context, what conventions to follow when making changes, and how to propose work for review.

Quick First Actions
-------------------
- Start by listing the repository root and hidden files (PowerShell):

  ```powershell
  Get-ChildItem -Force -Recurse -ErrorAction SilentlyContinue | Select-Object FullName
  ```

- Look for language manifests and entry points: `package.json`, `pyproject.toml`, `requirements.txt`, `setup.py`, `go.mod`, `Cargo.toml`. If none exist, stop and ask the user for the intended language and goals.

- If asked to modify the repo without additional context, create minimal, reversible changes (new files under `.github/` or a `README.md`) and document assumptions in the commit/PR description.

How to Discover Architecture
----------------------------
- There are no files to read; prefer an exploratory question to the repo owner: "Which language(s), frameworks, and CI should I assume?"
- If the user provides new files, prioritize finding these artifacts:
  - `README.md` for project purpose and run/build instructions
  - `src/` or language-specific directories for data flow and service boundaries
  - Tests (`tests/`, `spec/`) to infer expected behavior

Project-specific Conventions (current)
-------------------------------------
- None detected in repository. Until project files appear, follow these conservative conventions:
  - Keep changes minimal and well-documented in PRs.
  - Use feature branches and clearly describe assumptions.
  - Prefer creating new files over deleting user content.

Patch and PR Guidance for AI Agents
----------------------------------
- Use the repository's patch workflow (we use `apply_patch` in this environment). Make focused changes and include a short rationale.
- Examples of safe, initial contributions:
  - Add `.github/copilot-instructions.md` (this file) or `README.md` with discovery questions.
  - Add a small `CONTRIBUTING.md` template asking the user to provide preferred build/test commands.

Testing & Build
---------------
- No build or test commands discovered. Do NOT guess test runners or CI configuration.
- If the user wants a runnable scaffold, ask for the target language and whether to include a minimal test and CI.

Integration & External Dependencies
----------------------------------
- No dependencies discovered. Before adding dependency manifests, ask which package ecosystem (npm, pip, crates, etc.) to use.

Communication & Safety
----------------------
- Always attach a short "assumptions" block to patches if the repository lacks explicit documentation. Example:

  - Assumptions: "This is an empty repo. Creating a top-level README and this Copilot instructions file. Please tell me the intended language and CI."

- If the user asks for broad refactors or to scaffold a full project, request confirmation of language, license, and CI choices first.

When to Pause and Ask
---------------------
- If you cannot find a manifest or README within the first scan.
- If code changes would require selecting a framework, test runner, or package registry.
- If code-level design decisions affect architecture (APIs, database choices, deployment targets).

Where to Look Next (actions for the human)
-----------------------------------------
- If you intended to include existing code, please add or point me to the repository files. Tell me the primary language and a short run command.

Feedback
--------
Tell me if you want this file to: add a minimal scaffold (language of your choice), include a CONTRIBUTING template, or be more prescriptive about branching and commit message style.
