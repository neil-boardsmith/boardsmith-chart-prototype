export type ChartType = 
  | 'column' 
  | 'bar' 
  | 'line' 
  | 'area' 
  | 'waterfall' 
  | 'pie' 
  | 'doughnut' 
  | 'combo' 
  | 'scatter';

export type ChartSubtype = 
  | 'standard' 
  | 'stacked' 
  | 'stacked100' 
  | 'clustered' 
  | 'stepped';

export type ThemeName = 
  | 'boardsmith-professional' 
  | 'financial' 
  | 'consulting' 
  | 'monochrome';

export interface ChartConfig {
  id: string;
  title: string;
  type: ChartType;
  subtype?: ChartSubtype;
  data: ChartData[];
  
  // User Controls
  colors: string[];
  theme: ThemeName;
  fontFamily: string;
  showLegend: boolean;
  legendPosition: 'top' | 'bottom' | 'right' | 'left';
  showDataLabels: boolean;
  
  // New Customization Options
  subtitle?: string;
  source?: string;
  showStackTotals?: boolean;
  showXAxisLabels?: boolean;
  showYAxisLabels?: boolean;
  xAxisTitle?: string;
  yAxisTitle?: string;
  
  // System Managed (Intelligent Defaults)
  axes: AutoAxisConfig;
  formatting: AutoFormattingConfig;
  layout: AutoLayoutConfig;
  orientation?: string;
}

export interface ChartData {
  category: string;
  [key: string]: string | number;
}

export interface SeriesConfig {
  name: string;
  color: string;
  visible: boolean;
  type?: ChartType; // For combo charts
}

export interface AutoAxisConfig {
  xAxis: {
    range: 'auto';
    format: 'auto-detect';
    ticks: 'optimal';
  };
  yAxis: {
    range: 'auto-padded';
    format: 'smart-currency-percentage';
    ticks: 'readable-intervals';
  };
}

export interface AutoFormattingConfig {
  detectCurrency: boolean;
  detectPercentages: boolean;
  thousandsSeparator: boolean;
  decimalPlaces: 'smart' | number;
}

export interface AutoLayoutConfig {
  margins: 'balanced';
  gridLines: 'subtle';
  labelSpacing: 'auto-conflict-free';
  chartPadding: 'professional';
}

export interface ChartTemplate {
  id: string;
  name: string;
  description: string;
  category: 'comparison' | 'trend' | 'part-to-whole' | 'distribution';
  type: ChartType;
  subtype?: ChartSubtype;
  icon: React.ComponentType<any>;
  preview?: string;
  useCases: string[];
}

export interface StyleControls {
  // Typography
  fontFamily: 'Inter' | 'Arial' | 'Times New Roman' | 'Helvetica';
  fontSize: {
    title: number;
    axis: number;
    legend: number;
    dataLabels: number;
  };
  
  // Chart Elements
  title: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  
  // Legend
  showLegend: boolean;
  legendPosition: 'top' | 'bottom' | 'right' | 'left';
  
  // Data Labels
  showDataLabels: boolean;
  dataLabelPosition: 'center' | 'top' | 'bottom';
  
  // Series Visibility
  visibleSeries: string[];
}

export interface ColorSystem {
  seriesColors: string[];
  theme: ThemeName;
  customColors?: string[];
}