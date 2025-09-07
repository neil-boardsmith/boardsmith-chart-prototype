'use client';

import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { chartTypes, ChartOrientation } from '@/types/chart';

interface ChartItemProps {
  chart: typeof chartTypes[0];
  onSelect: (chartId: string, orientation?: ChartOrientation) => void;
}

const ChartItem: React.FC<ChartItemProps> = ({ chart, onSelect }) => {
  const [hoveredOrientation, setHoveredOrientation] = useState<ChartOrientation | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!chart.hasOrientations) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Diagonal from bottom-left to top-right
    // This creates two triangles:
    // - Upper-right triangle (above the diagonal) = TOP
    // - Lower-left triangle (below the diagonal) = RIGHT
    const normalizedX = x / rect.width;
    const normalizedY = y / rect.height;
    
    // Line equation: y = 1 - x (from bottom-left to top-right)
    // If y < (1 - x), we're above the line (TOP)
    // If y >= (1 - x), we're below the line (RIGHT)
    const isAboveDiagonal = normalizedY < (1 - normalizedX);
    
    setHoveredOrientation(isAboveDiagonal ? 'top' : 'right');
  };

  const handleMouseLeave = () => {
    setHoveredOrientation(null);
  };

  const handleClick = () => {
    onSelect(chart.id, hoveredOrientation || undefined);
  };

  const getCurrentIcon = () => {
    if (!chart.hasOrientations || !hoveredOrientation) {
      return chart.icons.standard || '/icons/Stacked_top.svg';
    }
    return chart.icons[hoveredOrientation] || chart.icons.standard || '/icons/Stacked_top.svg';
  };

  return (
    <div className="flex flex-col items-center gap-1 p-2">
      <div
        className="relative w-20 h-20 cursor-pointer group"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src={getCurrentIcon()}
            alt={chart.name}
            width={64}
            height={64}
            className="transition-all duration-150 object-contain"
          />
          
          {chart.hasOrientations && (
            <>
              {/* Triangle indicators - only top and right */}
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                <svg width="12" height="16" viewBox="0 0 12 16">
                  <path d="M12 8 L0 16 L0 0 Z" fill={hoveredOrientation === 'right' ? '#0D9488' : '#6B7280'} />
                </svg>
              </div>
              <div className="absolute left-1/2 -top-3 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                <svg width="16" height="12" viewBox="0 0 16 12">
                  <path d="M8 0 L16 12 L0 12 Z" fill={hoveredOrientation === 'top' ? '#0D9488' : '#6B7280'} />
                </svg>
              </div>
            </>
          )}
        </div>
      </div>
      <span className="text-xs text-center text-gray-700 max-w-20">{chart.name}</span>
    </div>
  );
};

interface ChartSelectorProps {
  onSelect?: (chartId: string, orientation?: ChartOrientation) => void;
  showAsDropdown?: boolean;
}

export const ChartSelector: React.FC<ChartSelectorProps> = ({ 
  onSelect, 
  showAsDropdown = false 
}) => {
  const [selectedChart, setSelectedChart] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleChartSelect = (chartId: string, orientation?: ChartOrientation) => {
    setSelectedChart(chartId);
    setIsOpen(false);
    if (onSelect) {
      onSelect(chartId, orientation);
    }
    console.log(`Selected chart: ${chartId}, Orientation: ${orientation || 'default'}`);
  };

  const selectedChartData = chartTypes.find(c => c.id === selectedChart);

  const content = (
    <>
      <div className="grid grid-cols-5 gap-4">
        {chartTypes.map((chart) => (
          <ChartItem key={chart.id} chart={chart} onSelect={handleChartSelect} />
        ))}
      </div>
    </>
  );

  if (showAsDropdown) {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-48">
            {selectedChartData ? selectedChartData.name : 'Select Chart Type'}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[600px] p-4">
          {content}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return <div className="w-[600px]">{content}</div>;
};