
import React, { useState } from 'react';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import BlockItem from './BlockItem';
import { UI_ICONS } from '../../constants';
import { summarizeContent, suggestTags } from '../../services/geminiService';

const Editor: React.FC = () => {
  const { pages, activePageId, updatePage } = useWorkspaceStore();
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);

  const activePage = activePageId ? pages[activePageId] : null;

  if (!activePage) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-neutral-400 bg-white">
        <UI_ICONS.FileText size={48} strokeWidth={1} className="mb-4" />
        <p>اختر صفحة من القائمة للبدء</p>
      </div>
    );
  }

  const handleAiAction = async () => {
    if (!activePage) return;
    setIsAiLoading(true);
    try {
      // Gather all text from blocks
      const store = useWorkspaceStore.getState();
      const textContent = activePage.blocks
        .map(id => store.blocks[id]?.content || '')
        .join('\n');
      
      const [summary, tags] = await Promise.all([
        summarizeContent(textContent),
        suggestTags(textContent)
      ]);
      
      setAiSummary(summary);
      if (tags.length > 0) {
        updatePage(activePage.id, { tags: [...new Set([...activePage.tags, ...tags])] });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-white h-screen overflow-y-auto flex flex-col custom-scrollbar">
      {/* Top Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md px-8 py-3 flex items-center justify-between border-b border-neutral-100">
        <div className="flex items-center gap-2">
           <span className="text-xl">{activePage.emoji}</span>
           <span className="text-sm font-medium text-neutral-500">{activePage.title}</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleAiAction}
            disabled={isAiLoading}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              isAiLoading 
              ? 'bg-neutral-100 text-neutral-400 animate-pulse cursor-not-allowed' 
              : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
            }`}
          >
            <UI_ICONS.BrainCircuit size={14} />
            {isAiLoading ? 'جاري التحليل...' : 'مساعد إدراك الذكي'}
          </button>
          <button className="p-1.5 rounded-md hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-colors">
            <UI_ICONS.Globe size={18} />
          </button>
          <button className="p-1.5 rounded-md hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-colors">
            <UI_ICONS.MoreVertical size={18} />
          </button>
        </div>
      </header>

      {/* Main Page Body */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-8 py-16">
        <div className="mb-12">
          <div className="group relative inline-block mb-4">
            <span className="text-6xl cursor-pointer hover:bg-neutral-100 p-2 rounded-xl transition-colors">{activePage.emoji}</span>
          </div>
          <input
            type="text"
            value={activePage.title}
            onChange={(e) => updatePage(activePage.id, { title: e.target.value })}
            className="w-full text-5xl font-bold bg-transparent outline-none placeholder:text-neutral-200"
            placeholder="بلا عنوان"
          />
          <div className="flex flex-wrap gap-2 mt-6">
            {activePage.tags.map(tag => (
              <span key={tag} className="flex items-center gap-1 px-2 py-0.5 bg-neutral-100 text-neutral-500 text-xs rounded-md border border-neutral-200">
                <UI_ICONS.Hash size={10} />
                {tag}
              </span>
            ))}
            <button className="text-neutral-300 hover:text-neutral-500 transition-colors">
              <UI_ICONS.Plus size={16} />
            </button>
          </div>
        </div>

        {/* AI Summary Section */}
        {aiSummary && (
          <div className="mb-12 bg-amber-50/50 border border-amber-100 p-6 rounded-2xl relative group">
            <button 
              onClick={() => setAiSummary(null)}
              className="absolute top-2 left-2 p-1 text-amber-300 hover:text-amber-600 transition-colors opacity-0 group-hover:opacity-100"
            >
              <UI_ICONS.ChevronLeft size={16} />
            </button>
            <h4 className="text-amber-800 font-bold text-sm mb-2 flex items-center gap-2">
              <UI_ICONS.BrainCircuit size={14} />
              ملخص ذكي من إدراك
            </h4>
            <p className="text-amber-900/80 leading-relaxed text-sm">{aiSummary}</p>
          </div>
        )}

        {/* Blocks Container */}
        <div className="space-y-0.5 pb-32">
          {activePage.blocks.map((id) => (
            <BlockItem key={id} blockId={id} pageId={activePage.id} />
          ))}
          <button 
            onClick={() => useWorkspaceStore.getState().addBlock(activePage.id, 'text')}
            className="w-full text-right py-3 text-neutral-300 hover:text-neutral-500 transition-colors text-sm flex items-center gap-2"
          >
             <UI_ICONS.Plus size={16} />
             ابدأ بالكتابة أو أضف كتلة جديدة...
          </button>
        </div>
      </main>
    </div>
  );
};

export default Editor;
