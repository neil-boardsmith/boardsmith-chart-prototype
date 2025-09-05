import { ChartType, DataRow } from '@/types/chart';
import { BAR_CHART_DATA, LINE_CHART_DATA, PIE_CHART_DATA, WATERFALL_DATA } from './constants';

export interface ChartTypeConfig {
  data: DataRow[];
  title: string;
  description: string;
}

export const getChartTypeConfig = (type: ChartType): ChartTypeConfig => {
  switch (type) {
    case 'bar':
      return {
        data: BAR_CHART_DATA,
        title: 'Quarterly Financial Performance',
        description: 'Compare revenue, costs, and profit across quarters'
      };
    
    case 'line':
      return {
        data: LINE_CHART_DATA,
        title: 'User Growth Trends',
        description: 'Track user growth and engagement over time'
      };
    
    case 'pie':
      return {
        data: PIE_CHART_DATA,
        title: 'Market Share Analysis',
        description: 'Visualize market share distribution by segment'
      };
    
    case 'waterfall':
      return {
        data: WATERFALL_DATA,
        title: 'Revenue Bridge Analysis',
        description: 'Show how revenue components contribute to total change'
      };
    
    default:
      return {
        data: BAR_CHART_DATA,
        title: 'Sample Chart',
        description: 'Sample data visualization'
      };
  }
};