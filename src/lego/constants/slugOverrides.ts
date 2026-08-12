/**
 * Per–game-slug presentation tokens (boot-time CSS vars, chart, assets).
 */
import { DEFAULT_GAME_SLUG, GAME_SLUG } from '@lego/helpers/assetUrl';
import type { CrashStage } from './gameTheme';

export type CssVarMap = Record<string, string>;

export type SlugOverride = {
  documentTitle?: string;
  logo?: string;
  stageMarker?: string;
  headerMenuIcon?: string;
  headerChatIcon?: string;
  cssVars?: CssVarMap;
  chart?: {
    fill?: string;
    stroke?: string;
  };
  stage?: CrashStage;
  bgmVolume?: number;
};

const PUSULABET_CRASH: SlugOverride = {
  documentTitle: 'Pusulabet Crash',
  logo: 'brand/logo.svg',
  stageMarker: 'stage/marker.svg',
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

/** Hollywoodbets Crash — Figma Canvas-Glow / purple shell, gold flight line. */
const HOLLYWOODBETS_CRASH: SlugOverride = {
  documentTitle: 'Hollywoodbets Crash',
  logo: 'brand/logo.png',
  stageMarker: 'stage/marker.png',
  headerMenuIcon: 'icons/header/menu.png',
  headerChatIcon: 'icons/header/chat.svg',
  stage: 'pusula',
  chart: {
    fill: '#E8A317',
    stroke: '#FFE566',
  },
  cssVars: {
    '--color-core': '#faf9fe',
    '--color-background': '#faf9fe',
    '--color-background-header': '#ffffff',
    '--color-background-section': '#ffffff',
    '--color-section': '#ffffff',
    '--color-section-light': '#ffffff',
    '--color-action': '#8a3ed8',
    '--color-action-07': 'rgba(138, 62, 216, 0.7)',
    '--color-action-04': 'rgba(138, 62, 216, 0.4)',
    '--color-main': 'rgba(138, 62, 216, 0.45)',
    '--color-main-hover': 'rgba(138, 62, 216, 0.65)',
    '--color-main-active': '#6b2fb8',
    '--color-secondary': 'rgba(124, 102, 209, 0.5)',
    '--color-main-light': '#7c66d1',
    '--color-text-main': '#1a1a1b',
    '--header-height': '42px',
    '--left-section-width': '301px',
    '--font-pusula': 'Helvetica, Arial, sans-serif',
    '--gradient-main':
      'linear-gradient(180deg, #ffd68a 0%, #f5a623 45%, #e8a317 100%)',
  },
};

const SLUG_OVERRIDES: Record<string, SlugOverride> = {
  'pusulabet-crash': PUSULABET_CRASH,
  'hollywoodbets-crash': HOLLYWOODBETS_CRASH,
};

export function getSlugOverride(slug: string = GAME_SLUG): SlugOverride {
  return SLUG_OVERRIDES[slug] ?? SLUG_OVERRIDES[DEFAULT_GAME_SLUG];
}

/** Active slug override (from `?game_slug=` or default). */
export const slugOverride = getSlugOverride();
