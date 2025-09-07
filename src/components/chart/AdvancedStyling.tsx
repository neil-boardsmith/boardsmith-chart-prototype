'use client';

import React from 'react';
import { ChartType } from '@/types/chart';

interface AdvancedStylingProps {
  chartType: ChartType;
  styles: AdvancedStyles;
  onStylesChange: (styles: AdvancedStyles) => void;
}

export interface AdvancedStyles {
  // Bar chart specific
  borderRadius: number;
  columnWidth: number;
  
  // Line chart specific
  strokeWidth: number;
  strokeCurve: 'smooth' | 'straight' | 'stepline';
  markerSize: number;
  markerEnabled: boolean;
  
  // General styling
  gradientEnabled: boolean;
  shadowEnabled: boolean;
  animationSpeed: number;
  gridOpacity: number;
  
  // Data labels
  dataLabelsEnabled: boolean;
  dataLabelsPosition: 'top' | 'center' | 'bottom';
}

const defaultStyles: AdvancedStyles = {
  borderRadius: 4,
  columnWidth: 65,
  strokeWidth: 3,
  strokeCurve: 'smooth',
  markerSize: 6,
  markerEnabled: true,
  gradientEnabled: true,
  shadowEnabled: true,
  animationSpeed: 800,
  gridOpacity: 0.3,
  dataLabelsEnabled: false,
  dataLabelsPosition: 'top',
};

export function AdvancedStyling({ chartType, styles, onStylesChange }: AdvancedStylingProps) {
  const updateStyle = (key: keyof AdvancedStyles, value: any) => {
    onStylesChange({ ...styles, [key]: value });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Advanced Styling</h3>

      {/* Animation & Effects */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-slate-700 border-b border-slate-200 pb-1">
          Animation & Effects
        </h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-2">
              Animation Speed: {styles.animationSpeed}ms
            </label>
            <input
              type="range"
              min="200"
              max="2000"
              step="100"
              value={styles.animationSpeed}
              onChange={(e) => updateStyle('animationSpeed', Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-2">
              Grid Opacity: {Math.round(styles.gridOpacity * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={styles.gridOpacity}
              onChange={(e) => updateStyle('gridOpacity', Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={styles.gradientEnabled}
              onChange={(e) => updateStyle('gradientEnabled', e.target.checked)}
              className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
            Gradient Fill
          </label>
          
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={styles.shadowEnabled}
              onChange={(e) => updateStyle('shadowEnabled', e.target.checked)}
              className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
            Drop Shadow
          </label>
        </div>
      </div>

      {/* Bar Chart Specific */}
      {(chartType === 'bar' || chartType === 'waterfall') && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-slate-700 border-b border-slate-200 pb-1">
            Bar Styling
          </h4>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-2">
                Corner Radius: {styles.borderRadius}px
              </label>
              <input
                type="range"
                min="0"
                max="20"
                value={styles.borderRadius}
                onChange={(e) => updateStyle('borderRadius', Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-2">
                Bar Width: {styles.columnWidth}%
              </label>
              <input
                type="range"
                min="20"
                max="90"
                value={styles.columnWidth}
                onChange={(e) => updateStyle('columnWidth', Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
          </div>
        </div>
      )}

      {/* Line Chart Specific */}
      {chartType === 'line' && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-slate-700 border-b border-slate-200 pb-1">
            Line Styling
          </h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-2">
                Line Width: {styles.strokeWidth}px
              </label>
              <input
                type="range"
                min="1"
                max="8"
                value={styles.strokeWidth}
                onChange={(e) => updateStyle('strokeWidth', Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-2">
                Line Curve
              </label>
              <select
                value={styles.strokeCurve}
                onChange={(e) => updateStyle('strokeCurve', e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              >
                <option value="smooth">Smooth</option>
                <option value="straight">Straight</option>
                <option value="stepline">Step</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={styles.markerEnabled}
                onChange={(e) => updateStyle('markerEnabled', e.target.checked)}
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              Show Markers
            </label>
            
            {styles.markerEnabled && (
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-600 mb-2">
                  Marker Size: {styles.markerSize}px
                </label>
                <input
                  type="range"
                  min="3"
                  max="12"
                  value={styles.markerSize}
                  onChange={(e) => updateStyle('markerSize', Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Data Labels */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-slate-700 border-b border-slate-200 pb-1">
          Data Labels
        </h4>
        
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={styles.dataLabelsEnabled}
              onChange={(e) => updateStyle('dataLabelsEnabled', e.target.checked)}
              className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
            Show Data Labels
          </label>
          
          {styles.dataLabelsEnabled && (
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Position
              </label>
              <select
                value={styles.dataLabelsPosition}
                onChange={(e) => updateStyle('dataLabelsPosition', e.target.value)}
                className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              >
                <option value="top">Top</option>
                <option value="center">Center</option>
                <option value="bottom">Bottom</option>
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { defaultStyles };