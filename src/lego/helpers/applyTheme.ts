import { GAME_THEME } from '@lego/constants/gameTheme';
import { slugOverride } from '@lego/constants/slugOverrides';
import { gameAsset, GAME_ASSET_PATHS } from '@lego/constants/gameAssets';

export const resolvedTheme = {
  documentTitle: slugOverride.documentTitle ?? GAME_THEME.documentTitle,
  logo: GAME_THEME.logo,
  groupImage: GAME_THEME.groupImage,
  sounds: GAME_THEME.sounds,
  chart: {
    fill: slugOverride.chart?.fill ?? GAME_THEME.chart.fill,
    stroke: slugOverride.chart?.stroke ?? GAME_THEME.chart.stroke,
  },
  stageMarkers: GAME_THEME.stageMarkers,
  stage: slugOverride.stage ?? GAME_THEME.stage,
  bgmVolume: slugOverride.bgmVolume ?? GAME_THEME.bgmVolume,
} as const;

const PUSULA_FONT_STYLE_ID = 'pusulabet-crash-fonts';

function injectPusulaFonts(): void {
  if (document.getElementById(PUSULA_FONT_STYLE_ID)) return;

  const woff2 = gameAsset(GAME_ASSET_PATHS.fonts.roganSemiBoldWoff2);
  const woff = gameAsset(GAME_ASSET_PATHS.fonts.roganSemiBoldWoff);
  const style = document.createElement('style');
  style.id = PUSULA_FONT_STYLE_ID;
  style.textContent = `
@font-face {
  font-family: 'Rogan';
  src: url('${woff2}') format('woff2'),
       url('${woff}') format('woff');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}
`;
  document.head.appendChild(style);
  document.documentElement.style.setProperty(
    '--font-pusula',
    "'Rogan', Clash, Helvetica, Arial, sans-serif",
  );
}

export function applyTheme(): void {
  if (typeof document === 'undefined') return;

  document.title = resolvedTheme.documentTitle;
  document.documentElement.dataset.gameSlug = 'pusulabet-crash';
  document.documentElement.dataset.stage = resolvedTheme.stage;

  injectPusulaFonts();

  const { cssVars } = slugOverride;
  if (!cssVars) return;

  const root = document.documentElement;
  for (const [key, value] of Object.entries(cssVars)) {
    root.style.setProperty(key, value);
  }
}
