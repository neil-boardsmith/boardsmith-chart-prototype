'use client';

import React from 'react';
import { ChartType } from '@/types/chart';
import { BarChart3, LineChart, PieChart, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChartTypeSelectorProps {
  value: ChartType;
  onChange: (type: ChartType) => void;
}

const chartTypes = [
  { type: 'bar' as ChartType, icon: BarChart3, label: 'Bar Chart' },
  { type: 'line' as ChartType, icon: LineChart, label: 'Line Chart' },
  { type: 'pie' as ChartType, icon: PieChart, label: 'Pie Chart' },
  { type: 'waterfall' as ChartType, icon: TrendingDown, label: 'Waterfall' },
];

export function ChartTypeSelector({ value, onChange }: ChartTypeSelectorProps) {
  return (
    <div className="flex gap-2">
      {chartTypes.map(({ type, icon: Icon, label }) => (
        <button
          key={type}
          onClick={() => onChange(type)}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors',
            value === type
              ? 'bg-teal-800 text-white border-teal-800'
              : 'bg-white text-slate-600 border-slate-200 hover:border-teal-600'
          )}
        >
          <Icon className="w-4 h-4" />
          <span className="text-sm font-medium">{label}</span>
        </button>
      ))}
    </div>
  );
}