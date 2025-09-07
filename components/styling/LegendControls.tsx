'use client';

import React from 'react';
import { AlignLeft, AlignCenter, AlignRight, Square } from 'lucide-react';

interface LegendControlsProps {
  showLegend: boolean;
  legendPosition: 'top' | 'bottom' | 'right' | 'left';
  onChange: (updates: any) => void;
}

export const LegendControls: React.FC<LegendControlsProps> = ({ 
  showLegend, 
  legendPosition, 
  onChange 
}) => {
  const positions = [
    { value: 'top', label: 'Top', icon: '↑' },
    { value: 'bottom', label: 'Bottom', icon: '↓' },
    { value: 'left', label: 'Left', icon: '←' },
    { value: 'right', label: 'Right', icon: '→' }
  ];

  return (
    <div className="space-y-3">
      {/* Show/Hide Legend */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showLegend}
            onChange={(e) => onChange({ showLegend: e.target.checked })}
            className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
          />
          <span className="text-sm font-medium text-gray-700">
            Show Legend
          </span>
        </label>
      </div>

      {/* Legend Position */}
      {showLegend && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Legend Position
          </label>
          <div className="grid grid-cols-4 gap-2">
            {positions.map(pos => (
              <button
                key={pos.value}
                onClick={() => onChange({ legendPosition: pos.value })}
                className={`
                  flex flex-col items-center justify-center p-2 rounded-lg
                  border-2 transition-all duration-200
                  ${legendPosition === pos.value
                    ? 'border-teal-600 bg-teal-50 text-teal-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-teal-400'
                  }
                `}
              >
                <span className="text-lg">{pos.icon}</span>
                <span className="text-xs mt-1">{pos.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Visual Preview */}
      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs font-medium text-gray-600 mb-2">Preview</p>
        <div className="relative bg-white rounded border border-gray-300 p-4 h-24">
          {/* Chart area placeholder */}
          <div className="absolute inset-4 bg-gray-100 rounded flex items-center justify-center">
            <span className="text-xs text-gray-500">Chart Area</span>
          </div>
          
          {/* Legend preview */}
          {showLegend && (
            <div 
              className={`
                absolute flex items-center gap-2
                ${legendPosition === 'top' ? 'top-1 left-1/2 -translate-x-1/2' : ''}
                ${legendPosition === 'bottom' ? 'bottom-1 left-1/2 -translate-x-1/2' : ''}
                ${legendPosition === 'left' ? 'left-1 top-1/2 -translate-y-1/2 flex-col' : ''}
                ${legendPosition === 'right' ? 'right-1 top-1/2 -translate-y-1/2 flex-col' : ''}
              `}
            >
              <div className="flex items-center gap-1">
                <Square className="w-2 h-2 fill-teal-600 text-teal-600" />
                <span className="text-[8px] text-gray-600">Series</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};