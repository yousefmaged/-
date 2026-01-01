
import React from 'react';
import { useWorkspaceStore } from '../store/useWorkspaceStore';
import { PARA_ICONS, UI_ICONS } from '../constants';
import { Page, ParaCategory } from '../types';

const Sidebar: React.FC = () => {
  const { pages, activePageId, setActivePage, addPage } = useWorkspaceStore();
  
  const categories: ParaCategory[] = ['Projects', 'Areas', 'Resources', 'Archives'];

  return (
    <aside className="w-64 h-screen bg-neutral-100 border-l border-neutral-200 flex flex-col custom-scrollbar overflow-y-auto">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">إ</div>
          <span className="font-bold text-lg text-neutral-800">إدراك</span>
        </div>
        <button className="text-neutral-500 hover:text-neutral-800 transition-colors">
          <UI_ICONS.Search size={18} />
        </button>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-6">
        {categories.map((cat) => (
          <div key={cat} className="space-y-1">
            <div className="flex items-center justify-between px-2 mb-1 group">
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                {PARA_ICONS[cat]}
                {cat === 'Projects' ? 'المشاريع' : cat === 'Areas' ? 'المجالات' : cat === 'Resources' ? 'الموارد' : 'الأرشيف'}
              </div>
              <button 
                onClick={() => addPage(cat)}
                className="text-neutral-400 opacity-0 group-hover:opacity-100 hover:text-neutral-600 transition-all"
              >
                <UI_ICONS.Plus size={14} />
              </button>
            </div>
            
            <div className="space-y-0.5">
              {/* Fix: Cast Object.values(pages) to Page[] to resolve type 'unknown' errors */}
              {(Object.values(pages) as Page[])
                .filter(p => p.category === cat)
                .map(page => (
                  <button
                    key={page.id}
                    onClick={() => setActivePage(page.id)}
                    className={`w-full text-right px-2 py-1.5 rounded-md text-sm transition-colors flex items-center gap-2 ${
                      activePageId === page.id 
                      ? 'bg-neutral-200 text-neutral-900 font-medium' 
                      : 'text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900'
                    }`}
                  >
                    <span className="flex-shrink-0 text-base">{page.emoji}</span>
                    <span className="truncate">{page.title}</span>
                  </button>
                ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-neutral-200">
        <button className="w-full flex items-center gap-2 px-2 py-2 text-neutral-600 hover:bg-neutral-200 rounded-md transition-colors text-sm">
          <UI_ICONS.BrainCircuit size={18} />
          <span>الخريطة المعرفية</span>
        </button>
        <button className="w-full flex items-center gap-2 px-2 py-2 text-neutral-600 hover:bg-neutral-200 rounded-md transition-colors text-sm">
          <UI_ICONS.Settings size={18} />
          <span>الإعدادات</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
