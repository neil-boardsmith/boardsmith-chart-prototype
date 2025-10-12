'use client';

import React, { useState, useCallback } from 'react';
import { Plus, Download, Grid, Settings } from 'lucide-react';
import { ChartDropdown } from './ChartDropdown';
import { FloatingDataEditor } from './FloatingDataEditor';
import { ChartPreview } from './ChartPreview';
import { ChartConfig, ChartData } from '@/types/chart-types';
import { professionalThemes } from '@/constants/themes';
import { chartTypes } from '@/types/chart';
import { v4 as uuidv4 } from 'uuid';

interface ChartInstance {
  id: string;
  config: ChartConfig;
  data: ChartData[];
  position: { x: number; y: number };
  size: { width: number; height: number };
  showDataEditor?: boolean;
}

export const ChartWorkspace: React.FC = () => {
  const [charts, setCharts] = useState<ChartInstance[]>([]);
  const [selectedChartId, setSelectedChartId] = useState<string | null>(null);

  const handleAddChart = useCallback((
    chartId: string, 
    orientation?: string
  ) => {
    const id = uuidv4();
    
    // Generate sample data based on chart type - SIMPLE AND CLEAR
    let sampleData: ChartData[] = [];
    
    if (chartId === 'stacked' || chartId === 'stacked100') {
      // Stacked charts need multiple series
      sampleData = [
        { category: 'Jan', series1: 44, series2: 55, series3: 41 },
        { category: 'Feb', series1: 55, series2: 60, series3: 67 },
        { category: 'Mar', series1: 30, series2: 38, series3: 41 },
        { category: 'Apr', series1: 40, series2: 51, series3: 55 },
        { category: 'May', series1: 50, series2: 45, series3: 48 },
        { category: 'Jun', series1: 60, series2: 68, series3: 72 }
      ];
    } else if (chartId === 'clustered') {
      // Clustered charts need multiple series
      sampleData = [
        { category: 'Jan', series1: 44, series2: 55 },
        { category: 'Feb', series1: 55, series2: 60 },
        { category: 'Mar', series1: 30, series2: 38 },
        { category: 'Apr', series1: 40, series2: 51 },
        { category: 'May', series1: 50, series2: 45 },
        { category: 'Jun', series1: 60, series2: 68 }
      ];
    } else if (chartId === 'waterfall') {
      // Waterfall needs value changes
      sampleData = [
        { category: 'Start', value: 100 },
        { category: 'Q1', value: 30 },
        { category: 'Q2', value: -20 },
        { category: 'Q3', value: 45 },
        { category: 'Q4', value: -15 },
        { category: 'End', value: 0 } // End will be calculated
      ];
    } else if (chartId === 'combination') {
      // Combination needs bar and line series
      sampleData = [
        { category: 'Jan', bars: 44, line: 37 },
        { category: 'Feb', bars: 55, line: 42 },
        { category: 'Mar', bars: 30, line: 35 },
        { category: 'Apr', bars: 40, line: 45 },
        { category: 'May', bars: 50, line: 48 },
        { category: 'Jun', bars: 60, line: 51 }
      ];
    } else if (chartId === 'line') {
      // Line chart with single or multiple series
      sampleData = [
        { category: 'Jan', series1: 30, series2: 40 },
        { category: 'Feb', series1: 40, series2: 35 },
        { category: 'Mar', series1: 35, series2: 50 },
        { category: 'Apr', series1: 50, series2: 45 },
        { category: 'May', series1: 49, series2: 60 },
        { category: 'Jun', series1: 60, series2: 55 }
      ];
    } else if (chartId === 'area') {
      // Area chart with single or multiple series
      sampleData = [
        { category: 'Jan', series1: 31, series2: 44 },
        { category: 'Feb', series1: 40, series2: 55 },
        { category: 'Mar', series1: 28, series2: 38 },
        { category: 'Apr', series1: 51, series2: 66 },
        { category: 'May', series1: 42, series2: 55 },
        { category: 'Jun', series1: 60, series2: 77 }
      ];
    } else if (chartId === 'area100') {
      // Area 100% needs multiple series for stacking
      sampleData = [
        { category: 'Jan', series1: 44, series2: 55, series3: 31 },
        { category: 'Feb', series1: 55, series2: 60, series3: 45 },
        { category: 'Mar', series1: 30, series2: 38, series3: 22 },
        { category: 'Apr', series1: 40, series2: 51, series3: 35 },
        { category: 'May', series1: 50, series2: 45, series3: 40 },
        { category: 'Jun', series1: 60, series2: 68, series3: 52 }
      ];
    }
    
    const actualOrientation = orientation || 'top';
    const chartName = chartTypes.find(c => c.id === chartId)?.name || 'Chart';
    
    // Determine the correct chart type and subtype for the ChartConfig
    let chartType: string;
    let subtype: string;
    
    const isHorizontal = actualOrientation === 'left' || actualOrientation === 'right';
    
    // Map each chart type correctly
    switch(chartId) {
      case 'stacked':
        chartType = isHorizontal ? 'bar' : 'column';
        subtype = 'stacked';
        break;
      case 'stacked100':
        chartType = isHorizontal ? 'bar' : 'column';
        subtype = 'stacked100';
        break;
      case 'clustered':
        chartType = isHorizontal ? 'bar' : 'column';
        subtype = 'grouped';
        break;
      case 'waterfall':
        chartType = 'waterfall';
        subtype = 'standard';
        break;
      case 'combination':
        chartType = 'combo';
        subtype = 'standard';
        break;
      case 'line':
        chartType = 'line';
        subtype = 'standard';
        break;
      case 'area':
        chartType = 'area';
        subtype = 'standard';
        break;
      case 'area100':
        chartType = 'area';
        subtype = 'stacked100';
        break;
      default:
        chartType = 'column';
        subtype = 'standard';
    }
    
    const newChart: ChartInstance = {
      id,
      config: {
        id,
        title: `${chartName} - ${actualOrientation.charAt(0).toUpperCase() + actualOrientation.slice(1)}`,
        type: chartType as ChartConfig['type'],
        subtype: subtype as ChartConfig['subtype'],
        data: sampleData,
        colors: professionalThemes['boardsmith-professional'].colors,
        theme: 'boardsmith-professional',
        fontFamily: 'Inter, sans-serif',
        showLegend: true,
        legendPosition: actualOrientation === 'top' ? 'top' : 'bottom',
        showDataLabels: false,
        // New customization options with defaults
        subtitle: '',
        source: '',
        showStackTotals: false,
        showXAxisLabels: true,
        showYAxisLabels: true,
        xAxisTitle: '',
        yAxisTitle: '',
        axes: {
          xAxis: { range: 'auto', format: 'auto-detect', ticks: 'optimal' },
          yAxis: { range: 'auto-padded', format: 'smart-currency-percentage', ticks: 'readable-intervals' }
        },
        formatting: {
          detectCurrency: true,
          detectPercentages: chartId === 'stacked100',
          thousandsSeparator: true,
          decimalPlaces: 'smart'
        },
        layout: {
          margins: 'balanced',
          gridLines: 'subtle',
          labelSpacing: 'auto-conflict-free',
          chartPadding: 'professional'
        },
        orientation: actualOrientation
      },
      data: sampleData,
      position: { 
        x: window.innerWidth / 2 - 300, // Center horizontally (600px width / 2)
        y: window.innerHeight / 2 - 200 - 32 // Center vertically (400px height / 2, accounting for header)
      },
      size: { width: 600, height: 400 }
    };

    const chartWithEditor = { ...newChart, showDataEditor: true };
    setCharts([...charts, chartWithEditor]);
    setSelectedChartId(id);
  }, [charts]);

  const handleDataChange = useCallback((chartId: string, newData: ChartData[]) => {
    setCharts(prevCharts => 
      prevCharts.map(chart => 
        chart.id === chartId 
          ? { 
              ...chart, 
              data: newData,
              config: { ...chart.config, data: newData }
            }
          : chart
      )
    );
  }, []);

  const handleConfigChange = useCallback((chartId: string, newConfig: ChartConfig) => {
    setCharts(prevCharts => 
      prevCharts.map(chart => 
        chart.id === chartId 
          ? { 
              ...chart, 
              config: newConfig,
              data: newConfig.data
            }
          : chart
      )
    );
  }, []);

  const handleChartClick = (chartId: string) => {
    setSelectedChartId(chartId);
  };

  const toggleDataEditor = (chartId: string) => {
    setCharts(prevCharts => 
      prevCharts.map(chart => 
        chart.id === chartId 
          ? { ...chart, showDataEditor: !chart.showDataEditor }
          : chart
      )
    );
  };

  const closeDataEditor = (chartId: string) => {
    setCharts(prevCharts => 
      prevCharts.map(chart => 
        chart.id === chartId 
          ? { ...chart, showDataEditor: false }
          : chart
      )
    );
  };

  const deleteChart = useCallback((chartId: string) => {
    setCharts(prevCharts => prevCharts.filter(chart => chart.id !== chartId));
    if (selectedChartId === chartId) {
      setSelectedChartId(null);
    }
  }, [selectedChartId]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Toolbar */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1920px] mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-gray-900">Chart Builder</h1>
              <ChartDropdown onSelect={handleAddChart} />
            </div>
            
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Grid View">
                <Grid className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Settings">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Export All">
                <Download className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Workspace Area */}
      <div className="relative" style={{ height: 'calc(100vh - 64px)' }}>
        {charts.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-center">
              <div className="mb-6">
                <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                  <Plus className="w-12 h-12 text-gray-400" />
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Start Creating Charts
              </h2>
              <p className="text-gray-600 max-w-md">
                Click &quot;Add Chart&quot; above to insert your first chart. Choose from various chart types 
                and select vertical or horizontal orientation where available.
              </p>
            </div>
          </div>
        ) : (
          // Vertical chart stack
          <div className="p-6 flex flex-col items-center gap-6 overflow-y-auto">
            {charts.map((chart) => (
              <div
                key={chart.id}
                className="bg-white rounded-xl shadow-lg transition-all cursor-pointer hover:shadow-xl"
                style={{
                  width: `${chart.size.width}px`,
                  height: `${chart.size.height}px`
                }}
                onClick={() => handleChartClick(chart.id)}
              >
                <div className="p-4 h-full">
                  <div className="h-full">
                    <ChartPreview 
                      config={chart.config} 
                      onOpenDataEditor={() => toggleDataEditor(chart.id)}
                      onDelete={() => deleteChart(chart.id)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Data Editors - One for each chart */}
      {charts.map(chart => 
        chart.showDataEditor ? (
          <FloatingDataEditor
            key={`editor-${chart.id}`}
            isOpen={true}
            data={chart.data}
            chartTitle={chart.config.title}
            chartConfig={chart.config}
            onClose={() => closeDataEditor(chart.id)}
            onChange={(newData) => handleDataChange(chart.id, newData)}
            onConfigChange={(newConfig) => handleConfigChange(chart.id, newConfig)}
          />
        ) : null
      )}
    </div>
  );
};