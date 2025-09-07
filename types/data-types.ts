export type DataType = 
  | 'text' 
  | 'number' 
  | 'currency' 
  | 'percentage' 
  | 'date';

export interface DataAnalysis {
  dataTypes: {
    [column: string]: DataType;
  };
  suggestions: {
    chartTypes: ChartType[];
    colorScheme: ThemeName;
    formatting: AutoFormattingConfig;
  };
}

export interface DataColumn {
  key: string;
  label: string;
  type: DataType;
  format?: string;
}

export interface DataRow {
  id: string;
  [key: string]: any;
}

export interface DataSet {
  columns: DataColumn[];
  rows: DataRow[];
}

export interface DataImportResult {
  success: boolean;
  data?: DataSet;
  errors?: string[];
}

export interface AxisRange {
  min: number;
  max: number;
  ticks?: number[];
}

export interface NumberFormat {
  type: 'number' | 'currency' | 'percentage';
  decimals: number;
  prefix?: string;
  suffix?: string;
  thousandsSeparator: boolean;
}

// Import from chart-types to avoid circular dependency
import type { ChartType, ThemeName, AutoFormattingConfig } from './chart-types';