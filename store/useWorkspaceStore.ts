
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WorkspaceState, Page, Block, BlockType, ParaCategory } from '../types';

interface WorkspaceActions {
  addPage: (category: ParaCategory) => string;
  updatePage: (id: string, updates: Partial<Page>) => void;
  deletePage: (id: string) => void;
  setActivePage: (id: string | null) => void;
  addBlock: (pageId: string, type: BlockType, afterBlockId?: string) => string;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  deleteBlock: (pageId: string, blockId: string) => void;
}

const INITIAL_BLOCKS: Record<string, Block> = {
  'welcome-1': { id: 'welcome-1', type: 'h1', content: 'مرحباً بك في إدراك' },
  'welcome-2': { id: 'welcome-2', type: 'text', content: 'هذا هو عقلك الرقمي الثاني. ابدأ بتدوين أفكارك وربطها ببعضها.' },
};

const INITIAL_PAGES: Record<string, Page> = {
  'p1': {
    id: 'p1',
    title: 'ملاحظاتي الأولى',
    emoji: '🚀',
    category: 'Projects',
    blocks: ['welcome-1', 'welcome-2'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    tags: ['ترحيب', 'بداية'],
  },
};

export const useWorkspaceStore = create<WorkspaceState & WorkspaceActions>()(
  persist(
    (set, get) => ({
      pages: INITIAL_PAGES,
      blocks: INITIAL_BLOCKS,
      activePageId: 'p1',

      addPage: (category) => {
        const id = crypto.randomUUID();
        const firstBlockId = crypto.randomUUID();
        const newBlock: Block = { id: firstBlockId, type: 'text', content: '' };
        const newPage: Page = {
          id,
          title: 'صفحة جديدة',
          emoji: '📄',
          category,
          blocks: [firstBlockId],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          tags: [],
        };
        set((state) => ({
          pages: { ...state.pages, [id]: newPage },
          blocks: { ...state.blocks, [firstBlockId]: newBlock },
          activePageId: id,
        }));
        return id;
      },

      updatePage: (id, updates) => set((state) => ({
        pages: { ...state.pages, [id]: { ...state.pages[id], ...updates, updatedAt: Date.now() } }
      })),

      deletePage: (id) => set((state) => {
        const newPages = { ...state.pages };
        delete newPages[id];
        return { 
          pages: newPages, 
          activePageId: state.activePageId === id ? Object.keys(newPages)[0] || null : state.activePageId 
        };
      }),

      setActivePage: (id) => set({ activePageId: id }),

      addBlock: (pageId, type, afterBlockId) => {
        const id = crypto.randomUUID();
        const newBlock: Block = { id, type, content: '' };
        set((state) => {
          const page = state.pages[pageId];
          const index = afterBlockId ? page.blocks.indexOf(afterBlockId) : page.blocks.length - 1;
          const newBlockOrder = [...page.blocks];
          newBlockOrder.splice(index + 1, 0, id);
          
          return {
            blocks: { ...state.blocks, [id]: newBlock },
            pages: {
              ...state.pages,
              [pageId]: { ...page, blocks: newBlockOrder, updatedAt: Date.now() }
            }
          };
        });
        return id;
      },

      updateBlock: (id, updates) => set((state) => ({
        blocks: { ...state.blocks, [id]: { ...state.blocks[id], ...updates } }
      })),

      deleteBlock: (pageId, blockId) => set((state) => {
        const page = state.pages[pageId];
        const newBlockOrder = page.blocks.filter(id => id !== blockId);
        const newBlocks = { ...state.blocks };
        delete newBlocks[blockId];
        
        return {
          blocks: newBlocks,
          pages: {
            ...state.pages,
            [pageId]: { ...page, blocks: newBlockOrder, updatedAt: Date.now() }
          }
        };
      }),
    }),
    { name: 'edrak-storage' }
  )
);
