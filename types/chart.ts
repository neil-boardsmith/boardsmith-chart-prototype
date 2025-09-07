export type ChartOrientation = 'top' | 'right';

export interface ChartType {
  id: string;
  name: string;
  icons: {
    standard?: string;
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  hasOrientations: boolean;
}

export const chartTypes: ChartType[] = [
  {
    id: 'stacked',
    name: 'Stacked',
    icons: {
      standard: '/icons/Stacked_top.svg',
      top: '/icons/Stacked_top.svg',
      right: '/icons/Stacked_right.svg',
    },
    hasOrientations: true,
  },
  {
    id: 'stacked100',
    name: 'Stacked 100%',
    icons: {
      standard: '/icons/Stacked%20100%25_top.svg',
      top: '/icons/Stacked%20100%25_top.svg',
      right: '/icons/Stacked%20100%25_right.svg',
    },
    hasOrientations: true,
  },
  {
    id: 'clustered',
    name: 'Clustered',
    icons: {
      standard: '/icons/Clustered_top.svg',
      top: '/icons/Clustered_top.svg',
      right: '/icons/Clustered_right.svg',
    },
    hasOrientations: true,
  },
  {
    id: 'waterfall',
    name: 'Waterfall',
    icons: {
      standard: '/icons/Waterfall_top.svg',
      top: '/icons/Waterfall_top.svg',
    },
    hasOrientations: false,
  },
  {
    id: 'combination',
    name: 'Combination',
    icons: {
      standard: '/icons/Combination_top.svg',
      top: '/icons/Combination_top.svg',
    },
    hasOrientations: false,
  },
  {
    id: 'line',
    name: 'Line',
    icons: {
      standard: '/icons/Line.svg',
      top: '/icons/Line.svg',
    },
    hasOrientations: false,
  },
  {
    id: 'area',
    name: 'Area',
    icons: {
      standard: '/icons/Area.svg',
      top: '/icons/Area.svg',
    },
    hasOrientations: false,
  },
  {
    id: 'area100',
    name: 'Area 100%',
    icons: {
      standard: '/icons/Area100%25.svg',
      top: '/icons/Area100%25.svg',
    },
    hasOrientations: false,
  },
];