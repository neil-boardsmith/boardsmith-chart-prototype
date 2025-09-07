'use client';

import React from 'react';
import { ThemeName } from '@/types/chart-types';
import { professionalThemes } from '@/constants/themes';
import { Check } from 'lucide-react';

interface ThemeSelectorProps {
  selectedTheme: ThemeName;
  onChange: (theme: ThemeName) => void;
}

const themeInfo: Record<ThemeName, { name: string; description: string }> = {
  'boardsmith-professional': {
    name: 'Boardsmith',
    description: 'Clean, modern teal palette'
  },
  'financial': {
    name: 'Financial',
    description: 'Traditional business colors'
  },
  'consulting': {
    name: 'Consulting',
    description: 'Bold, confident palette'
  },
  'monochrome': {
    name: 'Monochrome',
    description: 'Grayscale for print'
  }
};

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ 
  selectedTheme, 
  onChange 
}) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {(Object.keys(professionalThemes) as ThemeName[]).map(themeKey => {
        const theme = professionalThemes[themeKey];
        const info = themeInfo[themeKey];
        const isSelected = selectedTheme === themeKey;
        
        return (
          <button
            key={themeKey}
            onClick={() => onChange(themeKey)}
            className={`
              relative p-3 rounded-lg border-2 transition-all duration-200
              hover:shadow-md hover:scale-[1.02]
              ${isSelected 
                ? 'border-teal-600 bg-teal-50 shadow-md' 
                : 'border-gray-200 bg-white hover:border-teal-400'
              }
            `}
          >
            {/* Color swatches */}
            <div className="flex gap-1 mb-2">
              {theme.colors.slice(0, 4).map((color, index) => (
                <div
                  key={index}
                  className="flex-1 h-6 rounded"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            
            {/* Theme name and description */}
            <div className="text-left">
              <p className={`text-sm font-semibold ${
                isSelected ? 'text-teal-900' : 'text-gray-900'
              }`}>
                {info.name}
              </p>
              <p className={`text-xs mt-0.5 ${
                isSelected ? 'text-teal-700' : 'text-gray-500'
              }`}>
                {info.description}
              </p>
            </div>
            
            {/* Selected indicator */}
            {isSelected && (
              <div className="absolute top-2 right-2">
                <div className="w-5 h-5 bg-teal-600 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};