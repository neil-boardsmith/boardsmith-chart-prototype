'use client';

import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, ChevronRight } from 'lucide-react';
import { chartTypes, ChartOrientation } from '@/types/chart';

interface ChartDropdownProps {
  onSelect: (chartId: string, orientation?: ChartOrientation) => void;
}

export const ChartDropdown: React.FC<ChartDropdownProps> = ({ onSelect }) => {
  const handleChartSelect = (chartId: string, orientation?: ChartOrientation) => {
    onSelect(chartId, orientation);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm">
          <Plus className="w-3.5 h-3.5" />
          Add Chart
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {chartTypes.map((chart) => {
          if (chart.hasOrientations) {
            return (
              <DropdownMenuSub key={chart.id}>
                <DropdownMenuSubTrigger>
                  <span>{chart.name}</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={() => handleChartSelect(chart.id, 'top')}>
                    Vertical
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleChartSelect(chart.id, 'right')}>
                    Horizontal
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            );
          } else {
            return (
              <DropdownMenuItem 
                key={chart.id} 
                onClick={() => handleChartSelect(chart.id)}
              >
                {chart.name}
              </DropdownMenuItem>
            );
          }
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};