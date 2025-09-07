'use client';

import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Palette, Check } from 'lucide-react';

interface ColorPickerProps {
  colors: string[];
  onChange: (colors: string[]) => void;
  seriesNames?: string[];
}

const presetColors = [
  '#0f766e', '#14b8a6', '#2dd4bf', '#5eead4',
  '#2563eb', '#7c3aed', '#dc2626', '#ea580c',
  '#16a34a', '#0891b2', '#9333ea', '#e11d48',
  '#1f4e79', '#70ad47', '#ffc000', '#c5504b',
  '#1f2937', '#374151', '#4b5563', '#6b7280'
];

export const ColorPicker: React.FC<ColorPickerProps> = ({ 
  colors, 
  onChange, 
  seriesNames = [] 
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showCustomPicker, setShowCustomPicker] = useState(false);

  const handleColorSelect = (color: string, index: number) => {
    const newColors = [...colors];
    newColors[index] = color;
    onChange(newColors);
  };

  const handlePresetClick = (color: string) => {
    if (selectedIndex !== null) {
      handleColorSelect(color, selectedIndex);
    }
  };

  return (
    <div className="space-y-3">
      {/* Series Colors */}
      <div className="space-y-2">
        {seriesNames.map((name, index) => (
          <div key={index} className="flex items-center gap-3">
            <button
              onClick={() => {
                setSelectedIndex(index);
                setShowCustomPicker(!showCustomPicker);
              }}
              className={`
                w-10 h-10 rounded-lg border-2 transition-all cursor-pointer
                hover:scale-110 hover:shadow-md
                ${selectedIndex === index ? 'border-teal-600 shadow-lg' : 'border-gray-300'}
              `}
              style={{ backgroundColor: colors[index] || presetColors[index] }}
              title={`Click to change color for ${name}`}
            />
            <span className="text-sm text-gray-700 flex-1">{name}</span>
            {selectedIndex === index && (
              <Check className="w-4 h-4 text-teal-600" />
            )}
          </div>
        ))}
      </div>

      {/* Preset Colors Grid */}
      {selectedIndex !== null && (
        <div className="pt-3 border-t border-gray-200">
          <p className="text-xs font-medium text-gray-600 mb-2">Quick Colors</p>
          <div className="grid grid-cols-8 gap-1">
            {presetColors.map((color) => (
              <button
                key={color}
                onClick={() => handlePresetClick(color)}
                className="w-8 h-8 rounded border-2 border-gray-200 hover:border-gray-400 hover:scale-110 transition-all"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      )}

      {/* Custom Color Picker */}
      {showCustomPicker && selectedIndex !== null && (
        <div className="pt-3 border-t border-gray-200">
          <p className="text-xs font-medium text-gray-600 mb-2">Custom Color</p>
          <div className="flex flex-col items-center">
            <HexColorPicker
              color={colors[selectedIndex] || '#000000'}
              onChange={(color) => handleColorSelect(color, selectedIndex)}
            />
            <div className="mt-3 flex items-center gap-2">
              <input
                type="text"
                value={colors[selectedIndex] || '#000000'}
                onChange={(e) => handleColorSelect(e.target.value, selectedIndex)}
                className="px-2 py-1 text-sm font-mono border border-gray-300 rounded"
                placeholder="#000000"
              />
              <button
                onClick={() => setShowCustomPicker(false)}
                className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};