// Simple, direct ApexCharts configuration
import { professionalThemes } from '@/constants/themes';
import { ChartConfig } from '@/types/chart-types';

export function getApexConfig(chartConfig: ChartConfig) {
  const { data, orientation = 'top' } = chartConfig;
  const isHorizontal = orientation === 'right';
  
  // Use the boardsmith-professional theme colors
  const theme = professionalThemes['boardsmith-professional'];
  
  // Filter out empty rows (rows where all non-category values are empty/null/undefined)
  const filteredData = (data || []).filter(row => {
    if (!row || !row.category || row.category.toString().trim() === '') return false;
    const nonCategoryKeys = Object.keys(row).filter(key => key !== 'category');
    return nonCategoryKeys.some(key => row[key] !== null && row[key] !== undefined && row[key] !== '');
  });
  
  if (filteredData.length === 0) {
    // Return minimal config for empty data
    return {
      series: [],
      chart: { type: 'bar' },
      xaxis: { categories: [] },
      colors: theme.colors
    };
  }
  
  // Extract series from filtered data - only include columns with actual data
  const categories = filteredData.map(row => row.category || '');
  const allSeriesKeys = filteredData.length > 0 ? Object.keys(filteredData[0]).filter(key => key !== 'category') : [];
  
  // Filter out empty series (columns where all values are empty/null/undefined)
  const seriesKeys = allSeriesKeys.filter(key => 
    filteredData.some(row => row[key] !== null && row[key] !== undefined && row[key] !== '' && row[key] !== 0)
  );
  
  // Generate series based on chart type
  let series: Array<{name: string; data: (string | number)[]; type?: string}> = [];
  const chartType = chartConfig.type; // Use the main chart type, not subtype
  
  // Different chart types need different series structures
  if (chartType === 'combo') {
    // Combination charts need specific bars and line data
    series = [
      {
        name: 'Bars',
        type: 'column',
        data: filteredData.map(row => row.bars || 0)
      },
      {
        name: 'Line',
        type: 'line',
        data: filteredData.map(row => row.line || 0)
      }
    ];
  } else if (chartType === 'waterfall') {
    // Waterfall charts need special handling - will be handled in switch case
    series = [];
  } else {
    // Standard series generation for stacked, clustered, line, area charts
    series = seriesKeys.map(key => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      data: filteredData.map(row => row[key] || 0)
    }));
  }

  // Determine base chart type
  let baseChartType = 'bar';
  if (chartType === 'line') baseChartType = 'line';
  else if (chartType === 'area') baseChartType = 'area';
  else if (chartType === 'combo') baseChartType = 'line';
  else if (chartType === 'waterfall') baseChartType = 'bar'; // Will be overridden in switch case

  // Base config for all charts
  const config: Record<string, any> = { // eslint-disable-line @typescript-eslint/no-explicit-any
    series: series,
    chart: {
      type: baseChartType,
      height: 350,
      stacked: false,
      fontFamily: chartConfig.fontFamily || 'Inter, sans-serif',
      background: 'transparent',
      toolbar: {
        show: false
      }
    },
    colors: chartConfig.colors || theme.colors,
    plotOptions: {
      bar: {
        horizontal: isHorizontal
      }
    },
    xaxis: {
      categories: categories,
      labels: {
        show: chartConfig.showXAxisLabels !== false,
        style: {
          colors: theme.textColor,
          fontFamily: chartConfig.fontFamily || 'Inter, sans-serif'
        }
      }
    },
    yaxis: {
      labels: {
        show: chartConfig.showYAxisLabels !== false,
        style: {
          colors: theme.textColor,
          fontFamily: chartConfig.fontFamily || 'Inter, sans-serif'
        }
      }
    },
    legend: {
      show: chartConfig.showLegend,
      position: chartConfig.legendPosition || (orientation === 'top' ? 'top' : 'bottom'),
      labels: {
        colors: theme.textColor
      }
    },
    dataLabels: {
      enabled: chartConfig.showDataLabels
    },
    grid: {
      borderColor: theme.gridColor
    }
  };

  // Add title if present
  if (chartConfig.title) {
    config.title = {
      text: chartConfig.title,
      style: {
        fontFamily: chartConfig.fontFamily || 'Inter, sans-serif',
        color: theme.textColor
      }
    };
  }

  // Add subtitle if present
  if (chartConfig.subtitle) {
    config.subtitle = {
      text: chartConfig.subtitle,
      style: {
        fontFamily: chartConfig.fontFamily || 'Inter, sans-serif',
        color: theme.textColor
      }
    };
  }

  // Add axis titles if present
  if (chartConfig.xAxisTitle) {
    config.xaxis.title = {
      text: chartConfig.xAxisTitle,
      style: {
        color: theme.textColor,
        fontFamily: chartConfig.fontFamily || 'Inter, sans-serif'
      }
    };
  }

  if (chartConfig.yAxisTitle) {
    config.yaxis.title = {
      text: chartConfig.yAxisTitle,
      style: {
        color: theme.textColor,
        fontFamily: chartConfig.fontFamily || 'Inter, sans-serif'
      }
    };
  }

  // Apply specific configurations based on chart type and subtype
  const switchKey = chartConfig.type === 'area' && chartConfig.subtype === 'stacked100' ? 'area100' : 
                   chartConfig.type === 'waterfall' ? 'waterfall' :
                   chartConfig.subtype || chartConfig.type;
  
  console.log('Chart config debug:', {
    chartType: chartConfig.type,
    subtype: chartConfig.subtype,
    switchKey: switchKey,
    data: filteredData
  });
  
  switch(switchKey) {
    case 'stacked':
      config.chart.stacked = true;
      // Add stack totals if enabled
      if (chartConfig.showStackTotals) {
        config.dataLabels = {
          enabled: chartConfig.showDataLabels,
          total: {
            enabled: true,
            offsetX: 0,
            offsetY: 0,
            style: {
              fontWeight: '600',
              fontSize: '12px',
              color: theme.textColor
            }
          }
        };
        config.plotOptions.bar.dataLabels = {
          total: {
            enabled: true,
            style: {
              fontWeight: '600',
              fontSize: '12px',
              color: theme.textColor
            }
          }
        };
      }
      break;
      
    case 'stacked100':
      config.chart.stacked = true;
      config.chart.stackType = '100%';
      // Add stack totals if enabled
      if (chartConfig.showStackTotals) {
        config.dataLabels = {
          enabled: chartConfig.showDataLabels,
          total: {
            enabled: true,
            formatter: () => '100%',
            style: {
              fontWeight: 600,
              color: theme.textColor,
              fontSize: '12px'
            }
          }
        };
      }
      break;
      
    case 'clustered':
      config.chart.stacked = false;
      break;
      
    case 'waterfall':
      // ApexCharts waterfall using rangeBar (following official docs)
      config.chart.type = 'rangeBar';
      
      // Ensure we have valid data structure for waterfall
      if (filteredData.length === 0) {
        config.series = [];
        break;
      }
      
      // Calculate cumulative values for waterfall effect
      let cumulative = 0;
      const waterfallData: Array<{x: string; y: number[]; fillColor: string; originalChange?: number}> = [];
      
      filteredData.forEach((row, index) => {
        // Get the value - try multiple possible keys
        const value = Number(row.value || row.change || row.amount || seriesKeys[0] ? row[seriesKeys[0]] : 0);
        
        if (isNaN(value)) {
          return; // Skip invalid values
        }
        
        if (index === 0) {
          // Start value - show from 0 to initial value
          waterfallData.push({
            x: row.category || `Item ${index + 1}`,
            y: [0, value],
            fillColor: theme.colors[0] || '#008FFB',
            originalChange: value
          });
          cumulative = value;
        } else if (index === filteredData.length - 1 && 
                   (row.category?.toLowerCase().includes('total') || 
                    row.category?.toLowerCase().includes('end') ||
                    row.category?.toLowerCase().includes('final'))) {
          // End/Total value - show final cumulative from 0
          waterfallData.push({
            x: row.category || 'Total',
            y: [0, cumulative],
            fillColor: theme.colors[0] || '#008FFB',
            originalChange: 0 // No change for total bar
          });
        } else {
          // Incremental changes - show the increment/decrement
          const prevCumulative = cumulative;
          cumulative += value;
          
          // For range bars, always put smaller value first
          const rangeStart = Math.min(prevCumulative, cumulative);
          const rangeEnd = Math.max(prevCumulative, cumulative);
          
          waterfallData.push({
            x: row.category || `Item ${index + 1}`,
            y: [rangeStart, rangeEnd],
            fillColor: value >= 0 ? (theme.colors[1] || '#00E396') : (theme.colors[2] || '#FEB019'),
            originalChange: value // Store the original change amount
          });
        }
      });
      
      // Override the series with waterfall data (ApexCharts format)
      config.series = [{
        name: 'Value',
        data: waterfallData
      }];
      
      // Specific rangeBar configuration
      config.chart.type = 'rangeBar';
      config.plotOptions = {
        bar: {
          horizontal: isHorizontal,
          distributed: true, // Each bar can have different colors
          rangeBarOverlap: false
        }
      };
      
      // Remove categories from xaxis for rangeBar
      delete config.xaxis.categories;
      config.xaxis.type = 'category';
      
      config.legend = {
        show: false // Hide legend for waterfall
      };
      
      // Enhanced data labels for waterfall
      config.dataLabels = {
        enabled: chartConfig.showDataLabels,
        formatter: function(value: number[], opts: { dataPointIndex?: number } = {}) {
          if (opts && typeof opts.dataPointIndex === 'number' && waterfallData[opts.dataPointIndex]) {
            const dataPoint = waterfallData[opts.dataPointIndex];
            if (dataPoint && typeof dataPoint.originalChange === 'number') {
              const change = dataPoint.originalChange;
              if (change === 0) {
                // For total bars, show the total value
                return dataPoint.y[1].toString();
              }
              // For change bars, show the change with proper sign
              return change > 0 ? `+${change}` : change.toString();
            }
          }
          return '';
        },
        style: {
          fontSize: '11px',
          fontWeight: '500'
        }
      };
      
      // Custom tooltip for waterfall
      config.tooltip = {
        y: {
          formatter: function(value: number[], opts: { dataPointIndex?: number } = {}) {
            if (opts && typeof opts.dataPointIndex === 'number' && waterfallData[opts.dataPointIndex]) {
              const dataPoint = waterfallData[opts.dataPointIndex];
              if (dataPoint && typeof dataPoint.originalChange === 'number') {
                const change = dataPoint.originalChange;
                const currentValue = dataPoint.y[1];
                if (change === 0) {
                  return `Total: ${currentValue}`;
                }
                return `Change: ${change >= 0 ? '+' : ''}${change}<br/>Total: ${currentValue}`;
              }
            }
            return Array.isArray(value) ? value.join(' - ') : value.toString();
          }
        }
      };
      
      console.log('Waterfall data (ApexCharts format):', waterfallData);
      break;
      
    case 'combo':
      config.stroke = {
        width: [0, 4],
        curve: 'smooth'
      };
      config.plotOptions = {
        bar: {
          horizontal: isHorizontal,
          columnWidth: '60%'
        }
      };
      config.dataLabels = {
        enabled: chartConfig.showDataLabels,
        enabledOnSeries: [1] // Only show data labels on line series
      };
      config.markers = {
        size: [0, 6],
        hover: {
          size: [0, 8]
        }
      };
      break;
      
    case 'line':
      config.plotOptions = {};
      config.stroke = {
        curve: 'smooth',
        width: 3
      };
      config.markers = {
        size: 5,
        hover: {
          size: 7
        }
      };
      break;
      
    case 'area':
      config.plotOptions = {};
      config.stroke = {
        curve: 'smooth',
        width: 2
      };
      config.fill = {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3,
        }
      };
      break;
      
    case 'stacked100':
      config.chart.stacked = true;
      config.chart.stackType = '100%';
      if (chartConfig.showStackTotals) {
        config.dataLabels = {
          enabled: chartConfig.showDataLabels,
          total: {
            enabled: true,
            formatter: () => '100%',
            style: {
              fontWeight: 600,
              color: theme.textColor,
              fontSize: '12px'
            }
          }
        };
      }
      break;
      
    case 'area100':
      // For area charts, we need to manually convert to percentages
      // ApexCharts stackType: '100%' doesn't work properly with area charts
      
      // Convert raw data to percentages for each category
      const convertedSeries = series.map(serie => ({
        ...serie,
        data: serie.data.map((value, index) => {
          // Calculate total for this category
          const total = series.reduce((sum, s) => sum + (s.data[index] || 0), 0);
          // Convert to percentage and round to 1 decimal place
          return total > 0 ? Math.round((value / total) * 1000) / 10 : 0;
        })
      }));
      
      config.chart.type = 'area';
      config.chart.stacked = true;
      // Don't use stackType for area charts - handle manually
      config.series = convertedSeries;
      config.stroke = {
        curve: 'smooth',
        width: 2
      };
      config.fill = {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3,
        }
      };
      config.yaxis = {
        ...config.yaxis,
        max: 100,
        labels: {
          ...config.yaxis.labels,
          formatter: function (val) {
            return val.toFixed(0) + "%";
          }
        }
      };
      config.dataLabels = {
        enabled: chartConfig.showDataLabels,
        formatter: function (val) {
          // Only show data labels for values >= 5% to avoid clutter
          return val >= 5 ? val.toFixed(1) + "%" : "";
        },
        style: {
          fontSize: '11px',
          fontWeight: '500',
          colors: ['#fff']
        }
      };
      config.tooltip = {
        y: {
          formatter: function (val) {
            return val.toFixed(1) + "%";
          }
        }
      };
      console.log('Area 100% converted:', {
        original: series,
        converted: convertedSeries
      });
      break;
  }

  return config;
}