'use client';

import React from 'react';
import { Type } from 'lucide-react';

interface FontControlsProps {
  fontFamily: string;
  title: string;
  onChange: (updates: any) => void;
}

const fontOptions = [
  { value: 'Inter, system-ui, sans-serif', label: 'Inter' },
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: '"Times New Roman", serif', label: 'Times New Roman' },
  { value: 'Helvetica, Arial, sans-serif', label: 'Helvetica' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: '"Courier New", monospace', label: 'Courier' }
];

export const FontControls: React.FC<FontControlsProps> = ({ 
  fontFamily, 
  title, 
  onChange 
}) => {
  return (
    <div className="space-y-4">
      {/* Chart Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Chart Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Enter chart title"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
      </div>

      {/* Font Family */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Font Family
        </label>
        <select
          value={fontFamily}
          onChange={(e) => onChange({ fontFamily: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        >
          {fontOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Font Size Controls */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Font Sizes
        </label>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-600 w-20">Title</span>
            <input
              type="range"
              min="12"
              max="24"
              defaultValue="18"
              className="flex-1"
            />
            <span className="text-xs text-gray-600 w-10">18px</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-600 w-20">Axis</span>
            <input
              type="range"
              min="8"
              max="14"
              defaultValue="11"
              className="flex-1"
            />
            <span className="text-xs text-gray-600 w-10">11px</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-600 w-20">Legend</span>
            <input
              type="range"
              min="8"
              max="14"
              defaultValue="12"
              className="flex-1"
            />
            <span className="text-xs text-gray-600 w-10">12px</span>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-start gap-2">
          <Type className="w-4 h-4 text-gray-500 mt-0.5" />
          <div>
            <p 
              className="text-sm font-semibold text-gray-900"
              style={{ fontFamily }}
            >
              Preview Text
            </p>
            <p 
              className="text-xs text-gray-600 mt-1"
              style={{ fontFamily }}
            >
              This is how your chart text will appear
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};