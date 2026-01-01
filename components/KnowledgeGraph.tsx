
import React, { useEffect, useRef } from 'react';
import { useWorkspaceStore } from '../store/useWorkspaceStore';
import { Page } from '../types';

const KnowledgeGraph: React.FC = () => {
  const { pages } = useWorkspaceStore();
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // Basic D3-like simulation would go here.
    // For this version, we render a static star layout or simple cluster.
  }, [pages]);

  return (
    <div className="w-full h-64 bg-neutral-50 border border-neutral-200 rounded-2xl relative overflow-hidden group">
      <div className="absolute top-4 right-4 z-10">
        <span className="text-xs font-bold text-neutral-400 bg-white/80 backdrop-blur px-2 py-1 rounded-md border border-neutral-100 uppercase tracking-widest">
          Knowledge Graph
        </span>
      </div>
      <svg ref={svgRef} className="w-full h-full">
        {/* Fix: Cast Object.values(pages) to Page[] to resolve type 'unknown' errors */}
        {(Object.values(pages) as Page[]).map((page, i) => {
          const x = 50 + Math.random() * 200;
          const y = 50 + Math.random() * 100;
          return (
            <g key={page.id} className="cursor-pointer hover:opacity-80 transition-opacity">
              <circle cx={x} cy={y} r="4" fill="#6C63FF" />
              <text x={x + 10} y={y + 5} className="text-[10px] fill-neutral-500 font-medium">
                {page.title}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default KnowledgeGraph;
