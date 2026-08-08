/**
 * Boot-time CSS variables and presentation tokens (Pusulabet Crash).
 */
import type { CrashStage } from './gameTheme';

export type CssVarMap = Record<string, string>;

export type SlugOverride = {
  documentTitle?: string;
  cssVars?: CssVarMap;
  chart?: {
    fill?: string;
    stroke?: string;
  };
  stage?: CrashStage;
  bgmVolume?: number;
};

export const slugOverride: SlugOverride = {
  documentTitle: 'Pusulabet Crash',
  stage: 'pusula',
  chart: {
    fill: '#E09527',
    stroke: '#FFE08A',
  },
  cssVars: {
    '--color-core': '#080f20',
    '--color-background': '#080f20',
    '--color-background-header': '#0b1428',
    '--color-background-section': '#0b1428',
    '--color-section': '#101c38',
    '--color-section-light': '#0b1428',
    '--color-action': '#ffac2c',
    '--color-action-07': 'rgba(255, 172, 44, 0.7)',
    '--color-action-04': 'rgba(255, 172, 44, 0.4)',
    '--color-main': 'rgba(224, 149, 39, 0.35)',
    '--color-main-hover': 'rgba(224, 149, 39, 0.65)',
    '--color-main-active': '#d98a18',
    '--color-secondary': 'rgba(101, 105, 118, 0.5)',
    '--color-main-light': '#656976',
    '--color-text-main': '#effff4',
    '--header-height': '42px',
    '--left-section-width': '301px',
    '--font-pusula': "'Rogan', Clash, Helvetica, Arial, sans-serif",
    '--gradient-main':
      'linear-gradient(180deg, #ffd68a 0%, #d8932d 45%, #d98a18 100%)',
  },
};
