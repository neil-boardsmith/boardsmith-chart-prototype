'use client';

import React from 'react';
import { Download } from 'lucide-react';

interface ChartExportProps {
  onExport: (format: 'png' | 'svg' | 'pdf') => void;
}

export function ChartExport({ onExport }: ChartExportProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-600">Export as:</span>
      <button
        onClick={() => onExport('png')}
        className="flex items-center gap-1 px-3 py-1.5 text-sm bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors"
      >
        <Download className="w-3.5 h-3.5" />
        PNG
      </button>
      <button
        onClick={() => onExport('svg')}
        className="flex items-center gap-1 px-3 py-1.5 text-sm bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors"
      >
        <Download className="w-3.5 h-3.5" />
        SVG
      </button>
    </div>
  );
}