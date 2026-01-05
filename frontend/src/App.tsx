import React, { useEffect, useState } from 'react'
import { fetchFiles } from './api'
import type { FileEntry } from './api'

function basenameFromPath(p: string) {
  const parts = p.split(/[/\\\\]+/)
  return parts[parts.length - 1] || p
}

function App() {
  const [files, setFiles] = useState<FileEntry[]>([])
  const [selectedFile, setSelectedFile] = useState<FileEntry | null>(null)

  useEffect(() => {
    fetchFiles()
      .then((items) => {
        // Clean filenames to display only the basename
        const cleaned = items.map((it) => ({ ...it, displayName: basenameFromPath(it.path) }))
        setFiles(cleaned)
      })
      .catch((err) => console.error('fetchFiles error', err))
  }, [])

  function handleSelect(f: FileEntry & { displayName?: string }) {
    setSelectedFile(f)
    console.log('selectedFile', f)
  }

  return (
    <div className="flex h-screen w-full bg-white">
      <aside className="w-96 h-full overflow-y-auto bg-gray-50 border-r border-gray-200 p-4">
        <h2 className="text-lg font-semibold mb-4">PDF Library</h2>

        {files.length === 0 ? (
          <div className="text-sm text-gray-500">No files found</div>
        ) : (
          <div className="space-y-3">
            {files.map((f) => (
              <div
                key={f.path}
                onClick={() => handleSelect(f)}
                role="button"
                tabIndex={0}
                className="bg-white shadow rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="font-medium text-sm text-gray-800">{(f as any).displayName || f.name}</div>
                <div className="text-xs text-gray-400 truncate">{f.path}</div>
              </div>
            ))}
          </div>
        )}
      </aside>

      <main className="flex-1 h-full bg-gray-100 p-8 flex items-center justify-center">
        <div className="w-full max-w-4xl">
          {selectedFile ? (
            <div className="bg-white rounded shadow p-6">
              <h3 className="text-xl font-semibold mb-2">{(selectedFile as any).displayName || selectedFile.name}</h3>
              <p className="text-sm text-gray-600 break-all">{selectedFile.path}</p>
            </div>
          ) : (
            <div className="text-center text-gray-700">Select a PDF to start research</div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App