export const SMART_DEFAULTS = {
  // Intelligent axis scaling
  axisPadding: 0.1, // 10% padding for better visualization
  minTickCount: 5,
  maxTickCount: 10,
  
  // Professional formatting
  currencyThreshold: 1000, // Use K formatting above $1,000
  percentageThreshold: 1, // Auto-detect if all values < 1
  
  // Chart aesthetics
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSize: {
    title: 18,
    subtitle: 14,
    axis: 11,
    legend: 12,
    dataLabels: 10
  },
  gridOpacity: 0.1,
  animationDuration: 750,
  borderRadius: 8,
  
  // Color intelligence
  autoColorScheme: true,
  colorAccessibility: true, // Ensure sufficient contrast
  
  // Layout
  chartHeight: 400,
  chartPadding: {
    top: 20,
    right: 30,
    bottom: 40,
    left: 50
  },
  
  // Data editor
  maxRows: 50,
  maxColumns: 20,
  defaultRows: 10,
  defaultColumns: 3,
  
  // Export settings
  exportQuality: 2, // 2x resolution for high-quality exports
  exportFormats: ['png', 'svg', 'pdf'] as const
};

export const DEFAULT_DATA = [
  { category: 'Q1 2024', revenue: 125000, profit: 32000, growth: 15 },
  { category: 'Q2 2024', revenue: 145000, profit: 38000, growth: 18 },
  { category: 'Q3 2024', revenue: 162000, profit: 42000, growth: 22 },
  { category: 'Q4 2024', revenue: 178000, profit: 48000, growth: 25 }
];

export const CHART_ANIMATIONS = {
  enabled: true,
  speed: 350,
  animateGradually: {
    enabled: true,
    delay: 150
  },
  dynamicAnimation: {
    enabled: true,
    speed: 350
  }
};