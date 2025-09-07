'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { ChartConfig } from '@/types/chart-types';
import { getApexConfig } from '@/lib/chart-config/simple-apex-config';
import { Loader2 } from 'lucide-react';

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
}

export const ChartPreview: React.FC<ChartPreviewProps> = ({ config }) => {
  const chartOptions = useMemo(() => {
    try {
      // Use simple direct configuration for our chart types
      const chartId = config.subtype === 'stacked100' && config.type === 'area' ? 'area100' :
                      config.subtype === 'stacked100' ? 'stacked100' : 
                      config.subtype === 'stacked' ? 'stacked' :
                      config.subtype === 'grouped' ? 'clustered' :
                      config.type === 'waterfall' ? 'waterfall' :
                      config.type === 'combo' ? 'combination' :
                      config.type === 'line' ? 'line' :
                      config.type === 'area' ? 'area' : 'clustered';
      
      const orientation = config.orientation || 'top';
      
      return getApexConfig(chartId, orientation, config.data);
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

  return (
    <div className="relative w-full h-full">
      {/* Chart Container */}
      <div className="bg-white rounded-lg w-full h-full overflow-hidden">
        <Chart
          options={chartOptions}
          series={chartOptions.series || []}
          type={chartType as any}
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

      {/* Chart Type Badge */}
      <div className="absolute top-4 right-4">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
          {config.type.charAt(0).toUpperCase() + config.type.slice(1)}
          {config.subtype && config.subtype !== 'standard' && ` - ${config.subtype}`}
        </span>
      </div>
    </div>
  );
};