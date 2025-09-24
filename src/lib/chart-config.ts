import { ApexOptions } from 'apexcharts';
import { ChartConfig, ChartType, DataRow } from '@/types/chart';
import { BOARDSMITH_COLORS, CHART_COLORS } from './constants';
import { AdvancedStyles } from '@/components/chart/AdvancedStyling';

export const getDefaultChartOptions = (): ApexOptions => ({
  chart: {
    fontFamily: 'Inter, sans-serif',
    toolbar: { 
      show: true,
      tools: {
        download: true,
        selection: false,
        zoom: false,
        zoomin: false,
        zoomout: false,
        pan: false,
      }
    },
    animations: { enabled: true, speed: 300 },
  },
  colors: CHART_COLORS,
  dataLabels: { enabled: false },
  legend: { position: 'bottom' },
  grid: { borderColor: '#e2e8f0' },
});

export const getChartOptions = (config: ChartConfig, advancedStyles?: AdvancedStyles): ApexOptions => {
  const baseOptions = getDefaultChartOptions();
  
  switch (config.type) {
    case 'bar':
      return {
        ...baseOptions,
        chart: {
          ...baseOptions.chart,
          type: 'bar',
          animations: {
            enabled: true,
            speed: advancedStyles?.animationSpeed || 800,
            dynamicAnimation: {
              enabled: true,
              speed: 350
            }
          },
          dropShadow: {
            enabled: advancedStyles?.shadowEnabled || false,
            top: 3,
            left: 2,
            blur: 4,
            opacity: 0.1,
          }
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: `${advancedStyles?.columnWidth || 55}%`,
            endingShape: 'rounded',
            borderRadius: advancedStyles?.borderRadius || 4,
            borderRadiusApplication: 'end',
            dataLabels: {
              position: advancedStyles?.dataLabelsPosition || 'top',
            },
            distributed: false,
          },
        },
        fill: {
          type: advancedStyles?.gradientEnabled ? 'gradient' : 'solid',
          gradient: advancedStyles?.gradientEnabled ? {
            shade: 'light',
            type: 'vertical',
            shadeIntensity: 0.3,
            gradientToColors: undefined,
            inverseColors: false,
            opacityFrom: 0.9,
            opacityTo: 0.7,
            stops: [0, 90, 100]
          } : undefined
        },
        grid: {
          ...baseOptions.grid,
          strokeDashArray: 3,
          opacity: advancedStyles?.gridOpacity || 0.3,
        },
        xaxis: {
          categories: config.data.map(row => row[config.xColumn]),
          title: { text: config.xAxisLabel },
          axisBorder: { show: false },
          axisTicks: { show: false }
        },
        yaxis: {
          title: { text: config.yAxisLabel },
        },
        title: {
          text: config.title,
          align: 'center',
          style: {
            fontSize: '18px',
            fontWeight: '600'
          }
        },
        dataLabels: {
          enabled: advancedStyles?.dataLabelsEnabled || false,
          style: {
            fontSize: '12px',
            fontWeight: 'bold',
            colors: ['#fff']
          }
        },
        colors: config.colors,
      };
      
    case 'line':
      return {
        ...baseOptions,
        chart: {
          ...baseOptions.chart,
          type: 'line',
          animations: {
            enabled: true,
            speed: advancedStyles?.animationSpeed || 800,
          },
          dropShadow: {
            enabled: advancedStyles?.shadowEnabled || false,
            top: 3,
            left: 2,
            blur: 4,
            opacity: 0.1,
          }
        },
        stroke: {
          curve: advancedStyles?.strokeCurve || 'smooth',
          width: advancedStyles?.strokeWidth || 3,
          lineCap: 'round'
        },
        markers: {
          size: advancedStyles?.markerEnabled ? (advancedStyles?.markerSize || 6) : 0,
          strokeWidth: 2,
          strokeColors: '#fff',
          hover: {
            size: advancedStyles?.markerEnabled ? ((advancedStyles?.markerSize || 6) + 2) : 0,
          }
        },
        fill: {
          type: advancedStyles?.gradientEnabled ? 'gradient' : 'solid',
          gradient: advancedStyles?.gradientEnabled ? {
            shade: 'light',
            type: 'vertical',
            shadeIntensity: 0.1,
            gradientToColors: undefined,
            inverseColors: false,
            opacityFrom: 0.4,
            opacityTo: 0.1,
          } : undefined
        },
        grid: {
          ...baseOptions.grid,
          strokeDashArray: 3,
          opacity: advancedStyles?.gridOpacity || 0.3,
        },
        xaxis: {
          categories: config.data.map(row => row[config.xColumn]),
          title: { text: config.xAxisLabel },
          axisBorder: { show: false },
          axisTicks: { show: false }
        },
        yaxis: {
          title: { text: config.yAxisLabel },
        },
        title: {
          text: config.title,
          align: 'center',
          style: {
            fontSize: '18px',
            fontWeight: '600'
          }
        },
        dataLabels: {
          enabled: advancedStyles?.dataLabelsEnabled || false,
          style: {
            fontSize: '11px',
            fontWeight: 'bold'
          }
        },
        colors: config.colors,
      };
      
    case 'pie':
      return {
        ...baseOptions,
        chart: {
          ...baseOptions.chart,
          type: 'pie',
        },
        labels: config.data.map(row => String(row[config.xColumn])),
        title: {
          text: config.title,
          align: 'center',
        },
        colors: config.colors,
        legend: {
          position: 'bottom',
        },
      };
      
    case 'waterfall':
      return {
        ...baseOptions,
        chart: {
          ...baseOptions.chart,
          type: 'bar',
          stacked: true,
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '65%',
            endingShape: 'flat',
          },
        },
        xaxis: {
          categories: config.data.map(row => row[config.xColumn]),
          title: { text: config.xAxisLabel },
        },
        yaxis: {
          title: { text: config.yAxisLabel },
          min: 0, // Keep Y-axis starting at 0
        },
        title: {
          text: config.title,
          align: 'center',
        },
        colors: ['rgba(0,0,0,0)', '#0f766e', '#ef4444', '#6b7280'],
        fill: {
          opacity: [0, 1, 1, 0], // Make base series invisible but keep the floating effect
        },
        dataLabels: {
          enabled: true,
          formatter: function(val: number, opts: { seriesIndex: number; dataPointIndex: number }) {
            const seriesIndex = opts.seriesIndex;
            const dataIndex = opts.dataPointIndex;
            if (seriesIndex === 0) return ''; // Hidden base series
            if (val === 0) return ''; // Don't show zero values
            
            const actualValue = opts.w.config.series[3].data[dataIndex];
            return actualValue !== 0 ? actualValue : '';
          },
          style: {
            colors: ['#fff'],
            fontSize: '12px',
            fontWeight: 'bold',
          },
        },
        legend: {
          show: false,
        },
        tooltip: {
          shared: false,
          custom: function({ seriesIndex, dataPointIndex, w }: { seriesIndex: number; dataPointIndex: number; w: { config: { xaxis: { categories: string[] }; series: Array<{ data: number[] }> } } }) {
            if (seriesIndex === 0) return '';
            
            const category = w.config.xaxis.categories[dataPointIndex];
            const value = w.config.series[3].data[dataPointIndex];
            
            // Calculate running total for waterfall
            let runningTotal = 0;
            for (let i = 0; i <= dataPointIndex; i++) {
              if (i === 0) {
                runningTotal = w.config.series[3].data[i];
              } else {
                runningTotal += w.config.series[3].data[i];
              }
            }
            
            const label = dataPointIndex === 0 ? 'Starting Value' : 'Change';
            
            return `
              <div class="bg-white p-2 border border-gray-200 rounded shadow-sm">
                <div class="font-semibold">${category}</div>
                <div class="text-sm">${label}: ${value}</div>
                <div class="text-sm">Running Total: ${runningTotal}</div>
              </div>
            `;
          },
        },
      };
      
    default:
      return baseOptions;
  }
};

export const getSeries = (config: ChartConfig) => {
  if (config.type === 'pie') {
    return config.data.map(row => Number(row[config.yColumns[0]]));
  }
  
  if (config.type === 'waterfall') {
    // Proper waterfall with floating bars - keep the visual effect but fix the base series
    const bases: number[] = [];
    const increases: number[] = [];
    const decreases: number[] = [];
    const actuals: number[] = [];
    
    let runningTotal = 0;
    
    config.data.forEach((row, index) => {
      const value = Number(row[config.yColumns[0]]);
      const isTotal = row.isTotal === true;
      
      actuals.push(value);
      
      if (isTotal) {
        // Total columns (first and last) - show as full bars from 0
        bases.push(0);
        increases.push(value);
        decreases.push(0);
        if (index === 0) {
          runningTotal = value;
        }
      } else {
        // Incremental changes - floating bars
        if (value >= 0) {
          // Positive change - stack on top of current total
          bases.push(runningTotal);
          increases.push(value);
          decreases.push(0);
        } else {
          // Negative change - show as decrease from current total
          bases.push(runningTotal + value);
          increases.push(0);
          decreases.push(Math.abs(value));
        }
        runningTotal += value;
      }
    });
    
    return [
      { name: 'Base', data: bases },
      { name: 'Increase', data: increases },
      { name: 'Decrease', data: decreases },
      { name: 'Actual', data: actuals },
    ];
  }
  
  return config.yColumns.map(column => ({
    name: column,
    data: config.data.map(row => Number(row[column])),
  }));
};