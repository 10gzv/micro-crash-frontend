import { gameAsset, GAME_ASSET_PATHS } from './gameAssets';

export const GAME_THEME = {
  documentTitle: 'Pusulabet Crash',
  logo: gameAsset(GAME_ASSET_PATHS.brand.logo),
  groupImage: gameAsset(GAME_ASSET_PATHS.brand.abraMark),
  sounds: {
    background: gameAsset(GAME_ASSET_PATHS.audio.background),
    bet: gameAsset(GAME_ASSET_PATHS.audio.bet),
    crash: gameAsset(GAME_ASSET_PATHS.audio.crash),
    win: gameAsset(GAME_ASSET_PATHS.audio.win),
  },
  chart: {
    fill: '#E09527',
    stroke: '#FFE08A',
  },
  stageMarkers: [gameAsset(GAME_ASSET_PATHS.stage.marker)],
  stage: 'pusula' as const,
  bgmVolume: 1,
} as const;

export type GameTheme = typeof GAME_THEME;
export type CrashStage = GameTheme['stage'];
