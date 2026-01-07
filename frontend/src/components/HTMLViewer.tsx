import { useAppStore } from '../store/useAppStore';
import { getHtmlUrl } from '../api';

export function HTMLViewer() {
  const selectedFile = useAppStore((state) => state.selectedPdf);

  if (!selectedFile || selectedFile.type !== 'html') {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <p className="text-lg mb-2">No HTML file selected</p>
          <p className="text-sm">Select an HTML snapshot from the library to view</p>
        </div>
      </div>
    );
  }

  const htmlUrl = getHtmlUrl(selectedFile.path);

  return (
    <div className="h-full w-full bg-white">
      <iframe
        src={htmlUrl}
        className="w-full h-full border-0"
        sandbox="allow-same-origin allow-popups"
        title="HTML Snapshot"
      />
    </div>
  );
}
