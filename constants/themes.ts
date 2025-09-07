import { ThemeName } from '@/types/chart-types';

export interface ThemeConfig {
  colors: string[];
  fontFamily: string;
  gridColor: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
}

export const professionalThemes: Record<ThemeName, ThemeConfig> = {
  'boardsmith-professional': {
    colors: ['#0D9488', '#0A766C', '#053B36', '#032C28', '#55B4AB', '#CEE9E7', '#E6F4F3'],
    fontFamily: 'Inter, sans-serif',
    gridColor: 'rgba(206, 233, 231, 0.5)',
    backgroundColor: '#ffffff',
    textColor: '#032C28',
    borderColor: '#CEE9E7'
  },
  
  'financial': {
    colors: ['#E46C44', '#EC987C', '#F9E1D9', '#FCF0EC'],
    fontFamily: 'Inter, sans-serif',
    gridColor: 'rgba(252, 240, 236, 0.5)',
    backgroundColor: '#ffffff',
    textColor: '#032C28',
    borderColor: '#F9E1D9'
  },
  
  'consulting': {
    colors: ['#0D9488', '#55B4AB', '#CEE9E7', '#E46C44', '#EC987C', '#F9E1D9'],
    fontFamily: 'Inter, sans-serif',
    gridColor: 'rgba(206, 233, 231, 0.5)',
    backgroundColor: '#ffffff',
    textColor: '#032C28',
    borderColor: '#CEE9E7'
  },
  
  'monochrome': {
    colors: ['#032C28', '#053B36', '#0A766C', '#0D9488', '#55B4AB', '#CEE9E7', '#E6F4F3'],
    fontFamily: 'Inter, sans-serif',
    gridColor: 'rgba(206, 233, 231, 0.3)',
    backgroundColor: '#ffffff',
    textColor: '#032C28',
    borderColor: '#CEE9E7'
  }
};