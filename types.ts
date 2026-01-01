
export type BlockType = 
  | 'text' 
  | 'h1' 
  | 'h2' 
  | 'todo' 
  | 'bullet' 
  | 'quote' 
  | 'code' 
  | 'image' 
  | 'callout'
  | 'divider';

export interface Block {
  id: string;
  type: BlockType;
  content: string;
  props?: {
    checked?: boolean;
    language?: string;
    url?: string;
  };
  children?: string[]; // IDs of child blocks
}

export type ParaCategory = 'Projects' | 'Areas' | 'Resources' | 'Archives';

export interface Page {
  id: string;
  title: string;
  emoji: string;
  category: ParaCategory;
  blocks: string[]; // Root level block IDs
  createdAt: number;
  updatedAt: number;
  tags: string[];
}

export interface WorkspaceState {
  pages: Record<string, Page>;
  blocks: Record<string, Block>;
  activePageId: string | null;
}
