'use client';

import React from 'react';
import { CHART_COLORS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface ChartCustomizerProps {
  title: string;
  xAxisLabel: string;
  yAxisLabel: string;
  colors: string[];
  onTitleChange: (title: string) => void;
  onXAxisLabelChange: (label: string) => void;
  onYAxisLabelChange: (label: string) => void;
  onColorsChange: (colors: string[]) => void;
}

export function ChartCustomizer({
  title,
  xAxisLabel,
  yAxisLabel,
  colors,
  onTitleChange,
  onXAxisLabelChange,
  onYAxisLabelChange,
  onColorsChange,
}: ChartCustomizerProps) {
  const toggleColor = (color: string) => {
    if (colors.includes(color)) {
      if (colors.length > 1) {
        onColorsChange(colors.filter(c => c !== color));
      }
    } else {
      onColorsChange([...colors, color]);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Chart Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
          placeholder="Enter chart title"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            X-Axis Label
          </label>
          <input
            type="text"
            value={xAxisLabel}
            onChange={(e) => onXAxisLabelChange(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
            placeholder="X-axis label"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Y-Axis Label
          </label>
          <input
            type="text"
            value={yAxisLabel}
            onChange={(e) => onYAxisLabelChange(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
            placeholder="Y-axis label"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Colors
        </label>
        <div className="flex gap-2 flex-wrap">
          {CHART_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => toggleColor(color)}
              className={cn(
                'w-10 h-10 rounded-lg border-2 transition-all',
                colors.includes(color)
                  ? 'border-slate-900 scale-110'
                  : 'border-slate-200 hover:border-slate-400'
              )}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}