'use client';

import React, { useMemo, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { ChartType, DataRow } from '@/types/chart';
import { getChartOptions, getSeries } from '@/lib/chart-config';
import { CHART_COLORS } from '@/lib/constants';
import { AdvancedStyles } from './AdvancedStyling';

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export interface ChartRendererRef {
  exportChart: (format: 'png' | 'svg') => Promise<void>;
}

interface ChartRendererProps {
  type: ChartType;
  data: DataRow[];
  title: string;
  colors?: string[];
  xAxisLabel?: string;
  yAxisLabel?: string;
  xColumn: string;
  yColumns: string[];
  advancedStyles?: AdvancedStyles;
}

export const ChartRenderer = React.forwardRef<any, ChartRendererProps>(({
  type,
  data,
  title,
  colors = CHART_COLORS,
  xAxisLabel,
  yAxisLabel,
  xColumn,
  yColumns,
  advancedStyles,
}, ref) => {
  const chartRef = useRef<any>(null);
  const config = useMemo(() => ({
    id: 'chart',
    type,
    title,
    data,
    xColumn,
    yColumns,
    colors,
    xAxisLabel,
    yAxisLabel,
  }), [type, title, data, xColumn, yColumns, colors, xAxisLabel, yAxisLabel]);

  const options = useMemo(() => {
    const baseOptions = getChartOptions(config, advancedStyles);
    return {
      ...baseOptions,
      chart: {
        ...baseOptions.chart,
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: false,
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
          },
          export: {
            csv: {
              filename: 'chart-data',
            },
            svg: {
              filename: 'chart',
            },
            png: {
              filename: 'chart',
            }
          }
        }
      }
    };
  }, [config, advancedStyles]);
  
  const series = useMemo(() => getSeries(config), [config]);
  
  // For waterfall charts, we need to render as 'bar' type to ApexCharts
  const chartType = type === 'waterfall' ? 'bar' : type;

  // Update chart options without re-rendering when advanced styles change
  useEffect(() => {
    if (chartRef.current && chartRef.current.chart) {
      const newOptions = getChartOptions(config, advancedStyles);
      chartRef.current.chart.updateOptions(newOptions, false, false, false);
    }
  }, [advancedStyles, config]);

  // Update series data when data changes (with animation)
  useEffect(() => {
    if (chartRef.current && chartRef.current.chart) {
      chartRef.current.chart.updateSeries(series, true);
    }
  }, [series]);

  return (
    <div className="w-full h-full">
      <ApexChart
        ref={(el) => {
          chartRef.current = el;
          if (ref) {
            if (typeof ref === 'function') {
              ref(el);
            } else {
              ref.current = el;
            }
          }
        }}
        options={options}
        series={series}
        type={chartType}
        height="100%"
      />
    </div>
  );
});

ChartRenderer.displayName = 'ChartRenderer';