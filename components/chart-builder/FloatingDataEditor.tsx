'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Maximize2, Minimize2, Move, Expand } from 'lucide-react';
import { DataEditor } from './DataEditor';
import { ChartCustomizer } from './ChartCustomizer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartConfig } from '@/types/chart-types';

interface FloatingDataEditorProps {
  isOpen: boolean;
  data: Record<string, any>[];
  chartTitle: string;
  chartConfig: ChartConfig;
  onClose: () => void;
  onChange: (data: Record<string, any>[]) => void;
  onConfigChange: (config: ChartConfig) => void;
}

export const FloatingDataEditor: React.FC<FloatingDataEditorProps> = ({
  isOpen,
  data,
  chartTitle,
  chartConfig,
  onClose,
  onChange,
  onConfigChange
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 100 });
  const [size, setSize] = useState({ width: 500, height: 600 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  // Set initial height based on screen size
  useEffect(() => {
    const optimalHeight = Math.min(800, window.innerHeight - 200);
    setSize(prev => ({ ...prev, height: optimalHeight }));
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y
        });
      } else if (isResizing) {
        const newWidth = Math.max(300, resizeStart.width + (e.clientX - resizeStart.x));
        const newHeight = Math.max(200, resizeStart.height + (e.clientY - resizeStart.y));
        setSize({ width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragStart, resizeStart]);

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

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height
    });
    setIsResizing(true);
  };

  if (!isOpen) return null;

  // Fullscreen expanded mode
  if (isExpanded) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Edit Data Table</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Exit fullscreen"
            >
              <Minimize2 className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Close"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 p-6 overflow-hidden">
          <div className="h-full">
            <Tabs defaultValue="data" className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="data">Data</TabsTrigger>
                <TabsTrigger value="customise">Customise</TabsTrigger>
              </TabsList>
              <TabsContent value="data" className="flex-1 overflow-auto">
                <DataEditor
                  data={data}
                  onChange={onChange}
                  isExpanded={true}
                />
              </TabsContent>
              <TabsContent value="customise" className="flex-1 overflow-auto">
                <ChartCustomizer
                  config={chartConfig}
                  onChange={onConfigChange}
                  isExpanded={true}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }

  // Normal floating mode
  return (
    <div
      ref={windowRef}
      className={`fixed bg-white rounded-lg shadow-2xl border border-gray-300 transition-all duration-300 ${
        isMinimized ? 'w-64' : ''
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: isMinimized ? undefined : `${size.width}px`,
        height: isMinimized ? undefined : 'auto',
        maxHeight: isMinimized ? undefined : `${size.height}px`,
        zIndex: 1000
      }}
    >
      {/* Window Header */}
      <div
        className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-teal-600 to-teal-700 rounded-t-lg cursor-move"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <Move className="w-3 h-3 text-white/70" />
          <h3 className="text-white font-semibold text-xs select-none">
            Data Editor - {chartTitle}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-0.5 hover:bg-white/20 rounded transition-colors"
            title={isMinimized ? "Maximize" : "Minimize"}
          >
            {isMinimized ? (
              <Maximize2 className="w-3 h-3 text-white" />
            ) : (
              <Minimize2 className="w-3 h-3 text-white" />
            )}
          </button>
          <button
            onClick={() => setIsExpanded(true)}
            className="p-0.5 hover:bg-white/20 rounded transition-colors"
            title="Expand to fullscreen"
          >
            <Expand className="w-3 h-3 text-white" />
          </button>
          <button
            onClick={onClose}
            className="p-0.5 hover:bg-white/20 rounded transition-colors"
            title="Close"
          >
            <X className="w-3 h-3 text-white" />
          </button>
        </div>
      </div>

      {/* Window Content */}
      {!isMinimized && (
        <div className="p-3 overflow-hidden" style={{ height: `${size.height - 60}px` }}>
          <Tabs defaultValue="data" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2 mb-3">
              <TabsTrigger value="data" className="text-xs">Data</TabsTrigger>
              <TabsTrigger value="customise" className="text-xs">Customise</TabsTrigger>
            </TabsList>
            <TabsContent value="data" className="flex-1 overflow-auto">
              <DataEditor
                data={data}
                onChange={onChange}
              />
            </TabsContent>
            <TabsContent value="customise" className="flex-1 overflow-auto">
              <ChartCustomizer
                config={chartConfig}
                onChange={onConfigChange}
              />
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Resize Handle */}
      {!isMinimized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
          onMouseDown={handleResizeMouseDown}
        >
          <svg className="w-4 h-4 text-gray-400" viewBox="0 0 16 16">
            <path
              fill="currentColor"
              d="M14.5 14.5L14.5 10M14.5 14.5L10 14.5M14.5 14.5L8 8M10.5 14.5L10.5 12M14.5 10.5L12 10.5"
              strokeWidth="1"
            />
          </svg>
        </div>
      )}

      {/* Minimized State */}
      {isMinimized && (
        <div className="px-3 py-2">
          <p className="text-xs text-gray-600">
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