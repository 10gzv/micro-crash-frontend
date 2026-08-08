import { assetUrl } from '@lego/helpers/assetUrl';

/**
 * Relative paths under `public/game_assets/pusulabet-crash/`.
 * Grouped by domain — use `gameAsset()` for resolved URLs.
 */
export const GAME_ASSET_PATHS = {
  brand: {
    logo: 'brand/logo.svg',
    abraMark: 'brand/abra-mark.png',
    abraText: 'brand/abra-text.svg',
  },
  icons: {
    header: {
      chat: 'icons/header/chat.png',
      menu: 'icons/header/menu.svg',
    },
    chat: {
      groupBubble: 'icons/chat/group-bubble.png',
      playersOnline: 'icons/chat/players-online.png',
      smileCircle: 'icons/chat/smile-circle.png',
    },
    avatars: {
      person: 'icons/avatars/person.svg',
    },
    notice: {
      betAccepted: 'icons/notice/bet-accepted.svg',
    },
    betPanel: {
      minus: 'icons/bet-panel/minus.svg',
      plus: 'icons/bet-panel/plus.svg',
    },
    fairness: {
      copy: 'icons/fairness/copy.png',
    },
    menu: {
      chevronRight: 'icons/menu/chevron-right.svg',
      close: 'icons/menu/close.svg',
      document: 'icons/menu/document.svg',
      fairPlay: 'icons/menu/fair-play.svg',
      gameLimits: 'icons/menu/game-limits.svg',
      poweredBadge: 'icons/menu/powered-badge.svg',
      settings: 'icons/menu/settings.svg',
      sound: 'icons/menu/sound.svg',
      user: 'icons/menu/user.svg',
    },
  },
  stage: {
    compass: 'stage/compass.png',
    marker: 'stage/marker.svg',
    rays: 'stage/rays.svg',
  },
  audio: {
    background: 'audio/background.mp3',
    bet: 'audio/bet.mp3',
    crash: 'audio/crash.m4a',
    win: 'audio/win.m4a',
  },
  fonts: {
    roganSemiBoldWoff2: 'fonts/Rogan-SemiBold.woff2',
    roganSemiBoldWoff: 'fonts/Rogan-SemiBold.woff',
  },
} as const;

export function gameAsset(path: string): string {
  return assetUrl(path);
}

/** @deprecated Prefer `GAME_ASSET_PATHS.icons.menu` + `gameAsset`. */
export const PUSULA_BURGER_MENU_ICONS = {
  settingsGear: GAME_ASSET_PATHS.icons.menu.settings,
  close: GAME_ASSET_PATHS.icons.menu.close,
  user: GAME_ASSET_PATHS.icons.menu.user,
  sound: GAME_ASSET_PATHS.icons.menu.sound,
  shieldFair: GAME_ASSET_PATHS.icons.menu.fairPlay,
  document: GAME_ASSET_PATHS.icons.menu.document,
  gameLimits: GAME_ASSET_PATHS.icons.menu.gameLimits,
  chevronRight: GAME_ASSET_PATHS.icons.menu.chevronRight,
  poweredBadge: GAME_ASSET_PATHS.icons.menu.poweredBadge,
} as const;

export const pusulaBurgerMenuIcon = gameAsset;
