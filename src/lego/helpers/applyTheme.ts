import { gameAsset, GAME_ASSET_PATHS } from '@lego/constants/gameAssets';
import { GAME_THEME } from '@lego/constants/gameTheme';
import { getSlugOverride } from '@lego/constants/slugOverrides';
import { GAME_SLUG } from '@lego/helpers/assetUrl';

const activeOverride = getSlugOverride(GAME_SLUG);

export const resolvedTheme = {
  documentTitle: activeOverride.documentTitle ?? GAME_THEME.documentTitle,
  logo: gameAsset(activeOverride.logo ?? GAME_ASSET_PATHS.brand.logo),
  headerMenuIcon: gameAsset(
    activeOverride.headerMenuIcon ?? GAME_ASSET_PATHS.icons.header.menu,
  ),
  headerChatIcon: gameAsset(
    activeOverride.headerChatIcon ?? GAME_ASSET_PATHS.icons.header.chat,
  ),
  groupImage: GAME_THEME.groupImage,
  sounds: GAME_THEME.sounds,
  chart: {
    fill: activeOverride.chart?.fill ?? GAME_THEME.chart.fill,
    stroke: activeOverride.chart?.stroke ?? GAME_THEME.chart.stroke,
  },
  stageMarkers: [
    gameAsset(activeOverride.stageMarker ?? GAME_ASSET_PATHS.stage.marker),
  ],
  stage: activeOverride.stage ?? GAME_THEME.stage,
  bgmVolume: activeOverride.bgmVolume ?? GAME_THEME.bgmVolume,
} as const;

const PUSULA_FONT_STYLE_ID = 'pusulabet-crash-fonts';

function injectPusulaFonts(): void {
  if (GAME_SLUG !== 'pusulabet-crash') return;
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

  const override = getSlugOverride(GAME_SLUG);

  document.title = resolvedTheme.documentTitle;
  document.documentElement.dataset.gameSlug = GAME_SLUG;
  document.documentElement.dataset.stage = resolvedTheme.stage;

  injectPusulaFonts();

  const { cssVars } = override;
  if (!cssVars) return;

  const root = document.documentElement;
  for (const [key, value] of Object.entries(cssVars)) {
    root.style.setProperty(key, value);
  }
}
