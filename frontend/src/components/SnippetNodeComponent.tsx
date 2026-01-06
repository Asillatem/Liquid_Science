import { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { FileText, MessageSquare } from 'lucide-react';
import type { SnippetNodeData } from '../types';
import { useAppStore } from '../store/useAppStore';
import { ContextMenu } from './ContextMenu';
import { CommentPopover } from './CommentPopover';

export function SnippetNodeComponent({ data, selected, id }: NodeProps<SnippetNodeData>) {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
  const [showCommentPopover, setShowCommentPopover] = useState(false);

  const jumpToSource = useAppStore((state) => state.jumpToSource);
  const removeNode = useAppStore((state) => state.removeNode);

  const comments = data.comments || [];
  const hasComments = comments.length > 0;

  const handleJumpToSource = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Jump to the source PDF and page, switching documents if needed
    jumpToSource(data.sourcePdf, data.location);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenuPos({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  const handleDelete = () => {
    setShowContextMenu(false);
    removeNode(id);
  };

  // Close context menu on outside click
  useEffect(() => {
    const handleClickOutside = () => setShowContextMenu(false);
    if (showContextMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showContextMenu]);

  // Extract filename from path
  const filename = data.sourcePdf.split(/[/\\]/).pop() || data.sourcePdf;

  // Truncate long text for display
  const displayText =
    data.label.length > 200 ? data.label.substring(0, 200) + '...' : data.label;

  return (
    <>
      {/* Connection handles */}
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="!w-3 !h-3 !bg-blue-500 !border-2 !border-white snippet-handle"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="!w-3 !h-3 !bg-blue-500 !border-2 !border-white snippet-handle"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="!w-3 !h-3 !bg-blue-500 !border-2 !border-white snippet-handle"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="!w-3 !h-3 !bg-blue-500 !border-2 !border-white snippet-handle"
      />

      <div
        onContextMenu={handleContextMenu}
        className={`
          bg-white rounded-lg shadow-lg p-4 border-2 transition-all
          ${selected ? 'border-blue-500 shadow-xl' : 'border-gray-300'}
          min-w-[220px] max-w-[400px]
        `}
      >
        {/* Header with source info and comment badge */}
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-200">
          <FileText className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-xs text-gray-600 truncate" title={filename}>
              {filename}
            </div>
            <div className="text-xs text-gray-400">
              Page {data.location.pageIndex + 1}
            </div>
          </div>

          {/* Comment indicator */}
          {hasComments && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowCommentPopover(!showCommentPopover);
              }}
              className="relative p-1 hover:bg-gray-100 rounded transition-colors"
              title={`${comments.length} comment${comments.length !== 1 ? 's' : ''}`}
            >
              <MessageSquare className="w-4 h-4 text-blue-500" />
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {comments.length}
              </span>
            </button>
          )}
        </div>

        {/* Extracted text content */}
        <div className="text-sm text-gray-800 whitespace-pre-wrap mb-3">
          {displayText}
        </div>

        {/* Footer with actions */}
        <div className="flex gap-2 pt-2 border-t border-gray-100">
          <button
            onClick={handleJumpToSource}
            className="text-xs text-blue-600 hover:text-blue-800 hover:underline transition-colors"
          >
            Jump to source
          </button>
          {!hasComments && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowCommentPopover(true);
              }}
              className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              Add comment
            </button>
          )}
        </div>
      </div>

      {/* Context Menu */}
      {showContextMenu && (
        <ContextMenu
          x={contextMenuPos.x}
          y={contextMenuPos.y}
          onClose={() => setShowContextMenu(false)}
          onAddComment={() => {
            setShowContextMenu(false);
            setShowCommentPopover(true);
          }}
          onDelete={handleDelete}
        />
      )}

      {/* Comment Popover */}
      {showCommentPopover && (
        <CommentPopover
          nodeId={id}
          comments={comments}
          onClose={() => setShowCommentPopover(false)}
        />
      )}
    </>
  );
}
