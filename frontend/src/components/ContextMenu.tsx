import { MessageSquare, Trash2 } from 'lucide-react';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onAddComment: () => void;
  onDelete: () => void;
}

export function ContextMenu({ x, y, onClose, onAddComment, onDelete }: ContextMenuProps) {
  return (
    <div
      className="fixed bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50 min-w-[160px]"
      style={{ left: x, top: y }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={onAddComment}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors"
      >
        <MessageSquare className="w-4 h-4" />
        Add Comment
      </button>
      <div className="border-t border-gray-100 my-1" />
      <button
        onClick={onDelete}
        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
      >
        <Trash2 className="w-4 h-4" />
        Delete
      </button>
    </div>
  );
}
