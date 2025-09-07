// Simple, direct ApexCharts configuration
import { professionalThemes } from '@/constants/themes';

export function getApexConfig(chartId: string, orientation: string, data: any[]) {
  const isHorizontal = orientation === 'right';
  
  // Use the boardsmith-professional theme colors
  const theme = professionalThemes['boardsmith-professional'];
  
  // Extract series from data
  const categories = data.map(row => row.category);
  const seriesKeys = Object.keys(data[0]).filter(key => key !== 'category');
  const series = seriesKeys.map(key => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    data: data.map(row => row[key] || 0)
  }));

  // Base config for all charts
  let config: any = {
    series: series,
    chart: {
      type: 'bar',
      height: 350,
      stacked: false,
      fontFamily: 'Inter, sans-serif',
      background: 'transparent'
    },
    colors: theme.colors,
    plotOptions: {
      bar: {
        horizontal: isHorizontal
      }
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          colors: theme.textColor,
          fontFamily: 'Inter, sans-serif'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: theme.textColor,
          fontFamily: 'Inter, sans-serif'
        }
      }
    },
    legend: {
      position: orientation === 'top' ? 'top' : 'bottom',
      labels: {
        colors: theme.textColor
      }
    },
    grid: {
      borderColor: theme.gridColor
    }
  };

  // Apply specific configurations based on chart type
  switch(chartId) {
    case 'stacked':
      config.chart.stacked = true;
      break;
      
    case 'stacked100':
      config.chart.stacked = true;
      config.chart.stackType = '100%';
      break;
      
    case 'clustered':
      config.chart.stacked = false;
      break;
      
    case 'waterfall':
      // Waterfall needs special handling with rangeBar
      // Note: Horizontal waterfall is experimental in ApexCharts
      config.chart.type = 'rangeBar';
      let runningTotal = 0;
      const waterfallData = data.map(row => {
        const value = row.value || 0;
        const start = runningTotal;
        runningTotal += value;
        return [start, runningTotal];
      });
      config.series = [{
        name: 'Waterfall',
        data: waterfallData
      }];
      break;
      
    case 'combination':
      config.chart.type = 'line';
      config.series = [
        {
          name: 'Bars',
          type: 'column',
          data: data.map(row => row.bars || 0)
        },
        {
          name: 'Line',
          type: 'line',
          data: data.map(row => row.line || 0)
        }
      ];
      config.stroke = {
        width: [0, 4]
      };
      break;
      
    case 'line':
      config.chart.type = 'line';
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
      config.chart.type = 'area';
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
      
    case 'area100':
      config.chart.type = 'area';
      config.chart.stacked = true;
      config.chart.stackType = '100%';
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
      config.yaxis = {
        labels: {
          formatter: (val) => val + '%'
        }
      };
      break;
  }

  return config;
}