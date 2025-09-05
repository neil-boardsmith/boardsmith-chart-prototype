'use client';

import React, { useState, useCallback, useRef } from 'react';
import { ChartType, DataRow, ChartConfig } from '@/types/chart';
import { ChartRenderer, ChartRendererRef } from './ChartRenderer';
import { DataEditor } from './DataEditor';
import { ChartCustomizer } from './ChartCustomizer';
import { AdvancedStyling, AdvancedStyles, defaultStyles } from './AdvancedStyling';
import { DUMMY_DATA, WATERFALL_DATA, CHART_COLORS } from '@/lib/constants';
import { getChartTypeConfig } from '@/lib/chart-data';
import { Settings, ArrowLeft, Palette, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChartBlockProps {
  id?: string;
  initialData?: DataRow[];
  initialType?: ChartType;
  onSave?: (config: ChartConfig) => void;
  onBack?: () => void;
}

type PanelType = 'customize' | 'advanced' | null;

export function ChartBlock({
  id = 'chart-1',
  initialData = DUMMY_DATA,
  initialType = 'bar',
  onSave,
  onBack,
}: ChartBlockProps) {
  const [activePanel, setActivePanel] = useState<PanelType>(null);
  const [chartType, setChartType] = useState<ChartType>(initialType);
  const [data, setData] = useState<DataRow[]>(initialData);
  const [title, setTitle] = useState(() => getChartTypeConfig(initialType).title);
  const [xAxisLabel, setXAxisLabel] = useState('');
  const [yAxisLabel, setYAxisLabel] = useState('');
  const [colors, setColors] = useState(CHART_COLORS.slice(0, 4));
  const [advancedStyles, setAdvancedStyles] = useState<AdvancedStyles>(defaultStyles);
  
  // Remove chart type change since chart type is fixed once selected
  
  const chartRef = useRef<ChartRendererRef>(null);

  const columns = data.length > 0 ? Object.keys(data[0]) : [];
  const xColumn = columns[0] || 'category';
  const yColumns = columns.slice(1);

  const handleDataChange = useCallback((newData: DataRow[]) => {
    setData(newData);
    // Don't automatically switch to chart tab when editing data
  }, []);

  const handleExport = useCallback((format: 'png' | 'svg' | 'pdf') => {
    if (format === 'pdf') {
      // For PDF, we'd need additional library like jsPDF
      alert('PDF export will be available soon!');
      return;
    }
    
    // The export is handled by ApexCharts toolbar
    alert(`To export as ${format.toUpperCase()}, use the download button in the chart toolbar.`);
  }, []);

  const togglePanel = (panel: PanelType) => {
    setActivePanel(activePanel === panel ? null : panel);
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden relative">
      {/* Header */}
      <div className="border-b border-slate-200">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            )}
            <h2 className="text-lg font-semibold text-slate-900">{title || 'Untitled Chart'}</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
              {chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart
            </div>
            <button
              onClick={() => togglePanel('customize')}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors',
                activePanel === 'customize'
                  ? 'bg-teal-800 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              )}
            >
              <Settings className="w-4 h-4" />
              Customize
            </button>
            <button
              onClick={() => togglePanel('advanced')}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors',
                activePanel === 'advanced'
                  ? 'bg-teal-800 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              )}
            >
              <Palette className="w-4 h-4" />
              Advanced
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex">
        <div className="flex-1 p-6 space-y-6">
          {/* Chart */}
          {data.length > 0 && yColumns.length > 0 ? (
            <div className="h-96">
              <ChartRenderer
                ref={chartRef}
                type={chartType}
                data={data}
                title={title}
                colors={colors}
                xAxisLabel={xAxisLabel}
                yAxisLabel={yAxisLabel}
                xColumn={xColumn}
                yColumns={yColumns}
                advancedStyles={advancedStyles}
              />
            </div>
          ) : (
            <div className="h-96 flex items-center justify-center text-slate-500 border-2 border-dashed border-slate-200 rounded-lg">
              <p>Add data below to see the chart</p>
            </div>
          )}
          
          {/* Data Editor */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Data</h3>
            <div className="max-h-80 overflow-y-auto border border-slate-200 rounded-lg">
              <DataEditor
                data={data}
                onChange={handleDataChange}
                editable={true}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Side Panel */}
      <div className={cn(
        "absolute top-0 right-0 h-full w-96 bg-white border-l border-slate-200 shadow-xl transform transition-transform duration-300 z-10",
        activePanel ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">
            {activePanel === 'customize' ? 'Customize Chart' : 'Advanced Styling'}
          </h3>
          <button
            onClick={() => setActivePanel(null)}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="p-4 h-full overflow-y-auto pb-20">
          {activePanel === 'customize' && (
            <ChartCustomizer
              title={title}
              xAxisLabel={xAxisLabel}
              yAxisLabel={yAxisLabel}
              colors={colors}
              onTitleChange={setTitle}
              onXAxisLabelChange={setXAxisLabel}
              onYAxisLabelChange={setYAxisLabel}
              onColorsChange={setColors}
            />
          )}

          {activePanel === 'advanced' && (
            <AdvancedStyling
              chartType={chartType}
              styles={advancedStyles}
              onStylesChange={setAdvancedStyles}
            />
          )}
        </div>
      </div>

      {/* Overlay */}
      {activePanel && (
        <div 
          className="absolute inset-0 bg-black bg-opacity-20 z-5"
          onClick={() => setActivePanel(null)}
        />
      )}
    </div>
  );
}