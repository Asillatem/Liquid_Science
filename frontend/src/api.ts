export type FileEntry = {
  name: string
  path: string
  size?: number
  modified?: number
}

export async function fetchFiles(): Promise<FileEntry[]> {
  const resp = await fetch('http://localhost:8000/files')
  if (!resp.ok) {
    throw new Error(`Failed to fetch files: ${resp.status} ${resp.statusText}`)
  }
  const data = await resp.json()
  if (!Array.isArray(data)) return []

  // Backend may return Windows paths or Zotero-style subpaths.
  // Normalize to a flat list of { name, path }
  const entries: FileEntry[] = data.map((it: any) => {
    const raw = it.filename ?? it.path ?? String(it)
    // split on both forward and backward slashes
    const parts = raw.split(/[/\\\\]+/)
    const name = parts[parts.length - 1]
    return { name, path: raw, size: it.size, modified: it.modified }
  })
  return entries
}