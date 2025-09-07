export interface DataRow {
  [key: string]: string | number;
}

export interface ChartConfig {
  id: string;
  type: ChartType;
  title: string;
  data: DataRow[];
  xColumn: string;
  yColumns: string[];
  colors: string[];
  xAxisLabel?: string;
  yAxisLabel?: string;
  showDataLabels?: boolean;
  showLegend?: boolean;
}

export type ChartType = 'bar' | 'line' | 'pie' | 'waterfall' | 'area' | 'combo';

export interface WaterfallDataPoint extends DataRow {
  isSum?: boolean;
  isIntermediate?: boolean;
}