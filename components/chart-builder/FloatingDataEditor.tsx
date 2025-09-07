'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Maximize2, Minimize2, Move } from 'lucide-react';
import { DataEditor } from './DataEditor';

interface FloatingDataEditorProps {
  isOpen: boolean;
  data: any[];
  chartTitle: string;
  onClose: () => void;
  onChange: (data: any[]) => void;
}

export const FloatingDataEditor: React.FC<FloatingDataEditorProps> = ({
  isOpen,
  data,
  chartTitle,
  onClose,
  onChange
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 520, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = windowRef.current?.getBoundingClientRect();
    if (rect) {
      setDragStart({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={windowRef}
      className={`fixed bg-white rounded-xl shadow-2xl border border-gray-300 transition-all duration-300 ${
        isMinimized ? 'w-64' : 'w-[500px]'
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 1000
      }}
    >
      {/* Window Header */}
      <div
        className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-teal-600 to-teal-700 rounded-t-xl cursor-move"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <Move className="w-4 h-4 text-white/70" />
          <h3 className="text-white font-semibold text-sm select-none">
            Data Editor - {chartTitle}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
            title={isMinimized ? "Maximize" : "Minimize"}
          >
            {isMinimized ? (
              <Maximize2 className="w-4 h-4 text-white" />
            ) : (
              <Minimize2 className="w-4 h-4 text-white" />
            )}
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded transition-colors"
            title="Close"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Window Content */}
      {!isMinimized && (
        <div className="p-4 max-h-[500px] overflow-auto">
          <DataEditor
            data={data}
            onChange={onChange}
          />
        </div>
      )}

      {/* Minimized State */}
      {isMinimized && (
        <div className="px-4 py-3">
          <p className="text-sm text-gray-600">
            {data.length} rows × {data.length > 0 ? Object.keys(data[0]).length : 0} columns
          </p>
          <button
            onClick={() => setIsMinimized(false)}
            className="mt-2 text-xs text-teal-600 hover:text-teal-700 font-medium"
          >
            Click to expand →
          </button>
        </div>
      )}
    </div>
  );
};