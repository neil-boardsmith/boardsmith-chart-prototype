'use client';

import React from 'react';
import { ChartType } from '@/types/chart';
import { BarChart3, LineChart, PieChart, TrendingDown } from 'lucide-react';
import { getChartTypeConfig } from '@/lib/chart-data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ChartDropdownSelectionProps {
  onSelect: (type: ChartType) => void;
}

const chartTypes = [
  { type: 'bar' as ChartType, icon: BarChart3, label: 'Bar Chart' },
  { type: 'line' as ChartType, icon: LineChart, label: 'Line Chart' },
  { type: 'pie' as ChartType, icon: PieChart, label: 'Pie Chart' },
  { type: 'waterfall' as ChartType, icon: TrendingDown, label: 'Waterfall Chart' },
];

export function ChartDropdownSelection({ onSelect }: ChartDropdownSelectionProps) {
  const handleValueChange = (value: string) => {
    onSelect(value as ChartType);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Create Chart</h2>
        <p className="text-slate-600">Choose the type of chart you want to create</p>
      </div>
      
      <Select onValueChange={handleValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a chart type" />
        </SelectTrigger>
        <SelectContent>
          {chartTypes.map(({ type, icon: Icon, label }) => {
            const config = getChartTypeConfig(type);
            return (
              <SelectItem key={type} value={type}>
                <div className="flex items-center gap-3 w-full">
                  <Icon className="w-4 h-4 text-teal-600" />
                  <div className="flex-1">
                    <div className="font-medium">{label}</div>
                    <div className="text-xs text-slate-500">{config.description}</div>
                  </div>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}