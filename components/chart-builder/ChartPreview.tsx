'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { ChartConfig } from '@/types/chart-types';
import { getApexConfig } from '@/lib/chart-config/simple-apex-config';
import { Loader2, Database, Trash2 } from 'lucide-react';

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        <span className="text-sm text-gray-600">Loading chart...</span>
      </div>
    </div>
  )
});

interface ChartPreviewProps {
  config: ChartConfig;
  onOpenDataEditor?: () => void;
  onDelete?: () => void;
}

export const ChartPreview: React.FC<ChartPreviewProps> = ({ config, onOpenDataEditor, onDelete }) => {
  const chartOptions = useMemo(() => {
    try {
      return getApexConfig(config);
    } catch (error) {
      console.error('Error generating chart options:', error);
      return null;
    }
  }, [config]);

  if (!chartOptions) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <p className="text-gray-600 font-medium">Unable to render chart</p>
          <p className="text-sm text-gray-500 mt-1">Please check your data configuration</p>
        </div>
      </div>
    );
  }

  // Handle pie/doughnut charts differently
  const chartType = ['pie', 'doughnut'].includes(config.type) 
    ? (config.type === 'doughnut' ? 'donut' : 'pie')
    : chartOptions.chart?.type || 'bar';
  
  // Cast to ApexCharts type
  type ApexChartType = "bar" | "line" | "area" | "pie" | "scatter" | "rangeBar" | "donut" | "radialBar" | "bubble" | "heatmap" | "candlestick" | "boxPlot" | "radar" | "polarArea" | "rangeArea" | "treemap";
  const apexChartType = chartType as ApexChartType;

  return (
    <div className="relative w-full h-full">
      {/* Chart Container */}
      <div className="bg-white rounded-lg w-full h-full overflow-hidden">
        <Chart
          options={chartOptions as any}
          series={chartOptions.series || []}
          type={apexChartType}
          height="100%"
          width="100%"
        />
      </div>

      {/* Data Quality Indicator */}
      {config.data.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/90 rounded-lg">
          <div className="text-center">
            <p className="text-gray-700 font-medium">No data to display</p>
            <p className="text-sm text-gray-500 mt-1">Add data using the editor on the left</p>
          </div>
        </div>
      )}

      {/* Source Text */}
      {config.source && (
        <div className="absolute bottom-2 left-2">
          <span className="text-xs text-gray-500 bg-white/90 px-2 py-1 rounded">
            {config.source}
          </span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="absolute bottom-2 right-2 flex gap-1">
        {onOpenDataEditor && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDataEditor();
            }}
            className="p-1.5 bg-white/90 hover:bg-white border border-gray-300 rounded-md shadow-sm transition-all hover:shadow-md"
            title="Edit Data"
          >
            <Database className="w-3 h-3 text-gray-600" />
          </button>
        )}
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1.5 bg-white/90 hover:bg-red-50 border border-gray-300 rounded-md shadow-sm transition-all hover:shadow-md hover:border-red-300"
            title="Delete Chart"
          >
            <Trash2 className="w-3 h-3 text-gray-600 hover:text-red-600" />
          </button>
        )}
      </div>
    </div>
  );
};