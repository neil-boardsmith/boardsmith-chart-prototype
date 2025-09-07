'use client';

import React from 'react';
import { ChartType } from '@/types/chart';
import { BarChart3, LineChart, PieChart, TrendingDown } from 'lucide-react';
import { getChartTypeConfig } from '@/lib/chart-data';
import { cn } from '@/lib/utils';

interface ChartTypeSelectionProps {
  onSelect: (type: ChartType) => void;
}

const chartTypes = [
  { type: 'bar' as ChartType, icon: BarChart3, label: 'Bar Chart' },
  { type: 'line' as ChartType, icon: LineChart, label: 'Line Chart' },
  { type: 'pie' as ChartType, icon: PieChart, label: 'Pie Chart' },
  { type: 'waterfall' as ChartType, icon: TrendingDown, label: 'Waterfall' },
];

export function ChartTypeSelection({ onSelect }: ChartTypeSelectionProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Choose Chart Type</h2>
        <p className="text-slate-600">Select the chart type that best fits your data and analysis needs</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {chartTypes.map(({ type, icon: Icon, label }) => {
          const config = getChartTypeConfig(type);
          return (
            <button
              key={type}
              onClick={() => onSelect(type)}
              className="p-6 bg-white rounded-lg border-2 border-slate-200 hover:border-teal-600 hover:shadow-lg transition-all duration-200 text-left group"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Icon className="w-8 h-8 text-teal-600 group-hover:text-teal-700" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{label}</h3>
                  <p className="text-sm text-slate-600 mb-3">{config.description}</p>
                  <div className="text-xs text-slate-500">
                    <span className="font-medium">Sample:</span> {config.title}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}