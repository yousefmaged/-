
import React, { useState, useRef, useEffect } from 'react';
import { Block, BlockType } from '../../types';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import { UI_ICONS } from '../../constants';

interface BlockItemProps {
  blockId: string;
  pageId: string;
  onKeyDown?: (e: React.KeyboardEvent, id: string) => void;
}

const BlockItem: React.FC<BlockItemProps> = ({ blockId, pageId, onKeyDown }) => {
  const { blocks, updateBlock, deleteBlock, addBlock } = useWorkspaceStore();
  const block = blocks[blockId];
  const inputRef = useRef<HTMLTextAreaElement>(null);

  if (!block) return null;

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateBlock(blockId, { content: e.target.value });
    // Auto-resize
    e.target.style.height = 'inherit';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addBlock(pageId, 'text', blockId);
    } else if (e.key === 'Backspace' && block.content === '') {
      e.preventDefault();
      deleteBlock(pageId, blockId);
    }
    onKeyDown?.(e, blockId);
  };

  const renderContent = () => {
    const baseClasses = "w-full bg-transparent outline-none resize-none overflow-hidden placeholder:text-neutral-300 transition-all duration-150";
    
    switch (block.type) {
      case 'h1':
        return <textarea 
          ref={inputRef}
          value={block.content} 
          onChange={handleInput} 
          onKeyDown={handleKeyDown}
          placeholder="عنوان 1"
          className={`${baseClasses} text-3xl font-bold mb-4 mt-2`}
          rows={1}
        />;
      case 'h2':
        return <textarea 
          ref={inputRef}
          value={block.content} 
          onChange={handleInput} 
          onKeyDown={handleKeyDown}
          placeholder="عنوان 2"
          className={`${baseClasses} text-2xl font-semibold mb-3 mt-4`}
          rows={1}
        />;
      case 'todo':
        return (
          <div className="flex items-start gap-2 group/block">
            <input 
              type="checkbox" 
              checked={block.props?.checked} 
              onChange={(e) => updateBlock(blockId, { props: { ...block.props, checked: e.target.checked } })}
              className="mt-1.5 cursor-pointer h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
            <textarea 
              ref={inputRef}
              value={block.content} 
              onChange={handleInput} 
              onKeyDown={handleKeyDown}
              placeholder="مهمة..."
              className={`${baseClasses} text-base ${block.props?.checked ? 'line-through text-neutral-400' : ''}`}
              rows={1}
            />
          </div>
        );
      case 'quote':
        return (
          <div className="border-r-4 border-indigo-200 pr-4 py-1 italic text-neutral-600">
            <textarea 
              ref={inputRef}
              value={block.content} 
              onChange={handleInput} 
              onKeyDown={handleKeyDown}
              placeholder="اقتباس..."
              className={`${baseClasses} text-lg`}
              rows={1}
            />
          </div>
        );
      case 'callout':
        return (
          <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 flex gap-3">
             <span className="text-xl">💡</span>
             <textarea 
              ref={inputRef}
              value={block.content} 
              onChange={handleInput} 
              onKeyDown={handleKeyDown}
              placeholder="ملحوظة هامة..."
              className={`${baseClasses} text-neutral-800`}
              rows={1}
            />
          </div>
        );
      default:
        return <textarea 
          ref={inputRef}
          value={block.content} 
          onChange={handleInput} 
          onKeyDown={handleKeyDown}
          placeholder="ابدأ الكتابة..."
          className={`${baseClasses} text-base leading-relaxed text-neutral-700`}
          rows={1}
        />;
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'inherit';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, []);

  return (
    <div className="group relative py-1 px-8 -mx-8 hover:bg-neutral-50 rounded-sm transition-colors">
      <div className="absolute left-0 top-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1 items-center">
        <button className="text-neutral-300 hover:text-neutral-600 cursor-grab active:cursor-grabbing">
          <UI_ICONS.MoreVertical size={14} />
        </button>
      </div>
      {renderContent()}
    </div>
  );
};

export default BlockItem;
