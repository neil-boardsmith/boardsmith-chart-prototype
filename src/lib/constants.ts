export const BOARDSMITH_COLORS = {
  primary: '#0f766e',
  secondary: '#0d9488',
  accent: '#99f6e4',
  background: '#f8fafc',
  textSecondary: '#475569',
  textPrimary: '#0f172a',
};

export const CHART_COLORS = [
  '#0f766e',
  '#0d9488',
  '#14b8a6',
  '#2dd4bf',
  '#5eead4',
  '#99f6e4',
];

export const BAR_CHART_DATA = [
  { category: 'Q1 2024', revenue: 450, costs: 320, profit: 130 },
  { category: 'Q2 2024', revenue: 520, costs: 340, profit: 180 },
  { category: 'Q3 2024', revenue: 610, costs: 380, profit: 230 },
  { category: 'Q4 2024', revenue: 580, costs: 360, profit: 220 },
];

export const LINE_CHART_DATA = [
  { month: 'Jan 2024', users: 1200, sessions: 3400 },
  { month: 'Feb 2024', users: 1450, sessions: 3800 },
  { month: 'Mar 2024', users: 1650, sessions: 4200 },
  { month: 'Apr 2024', users: 1800, sessions: 4600 },
  { month: 'May 2024', users: 2100, sessions: 5200 },
  { month: 'Jun 2024', users: 2300, sessions: 5800 },
];

export const PIE_CHART_DATA = [
  { segment: 'Enterprise', marketShare: 45 },
  { segment: 'Mid-Market', marketShare: 30 },
  { segment: 'Small Business', marketShare: 20 },
  { segment: 'Startups', marketShare: 5 },
];

export const WATERFALL_DATA = [
  { category: 'Starting Revenue', value: 1000, isTotal: true },
  { category: 'New Sales', value: 350, isTotal: false },
  { category: 'Upsells', value: 150, isTotal: false },
  { category: 'Churn', value: -200, isTotal: false },
  { category: 'Downgrades', value: -50, isTotal: false },
  { category: 'Ending Revenue', value: 1250, isTotal: true },
];

// Legacy export for backward compatibility
export const DUMMY_DATA = BAR_CHART_DATA;