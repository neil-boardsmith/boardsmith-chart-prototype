'use client';

import React, { useState } from 'react';
import { ChartBlock } from '@/components/chart/ChartBlock';
import { ChartDropdownSelection } from '@/components/chart/ChartDropdownSelection';
import { ChartType } from '@/types/chart';
import { getChartTypeConfig } from '@/lib/chart-data';
import { Plus } from 'lucide-react';

type AppState = 'empty' | 'selecting' | 'chart';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('empty');
  const [selectedChartType, setSelectedChartType] = useState<ChartType | null>(null);
  
  const handleChartTypeSelect = (type: ChartType) => {
    setSelectedChartType(type);
    setAppState('chart');
  };

  const handleBackToSelection = () => {
    setAppState('selecting');
    setSelectedChartType(null);
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Boardsmith Chart Prototype
          </h1>
          <p className="text-slate-600">
            Create professional board-ready visualizations with ease
          </p>
        </div>

        {appState === 'empty' && (
          <div className="flex items-center justify-center h-96 bg-white rounded-lg border-2 border-dashed border-slate-300">
            <button
              onClick={() => setAppState('selecting')}
              className="flex items-center gap-2 px-6 py-3 bg-teal-800 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Insert Chart
            </button>
          </div>
        )}

        {appState === 'selecting' && (
          <ChartDropdownSelection onSelect={handleChartTypeSelect} />
        )}

        {appState === 'chart' && selectedChartType && (
          <ChartBlock 
            key={selectedChartType} // Force re-render with new data
            initialType={selectedChartType}
            initialData={getChartTypeConfig(selectedChartType).data}
            onBack={handleBackToSelection}
          />
        )}
      </div>
    </main>
  );
}