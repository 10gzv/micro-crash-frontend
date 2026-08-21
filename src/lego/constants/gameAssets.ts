import { assetUrl } from '@lego/helpers/assetUrl';

export const GAME_ASSET_PATHS = {
  brand: {
    logo: 'brand/logo.svg',
    abraMark: 'brand/abra-mark.png',
    abraText: 'brand/abra-text.svg',
    abraLogo: 'brand/abra-logo.png',
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
    craneA: 'stage/crane-a.png',
    craneB: 'stage/crane-b.png',
    craneC: 'stage/crane-c.png',
    craneD: 'stage/crane-d.png',
    craneASync: 'stage/crane-a-sync.png',
    craneBSync: 'stage/crane-b-sync.png',
    craneCSync: 'stage/crane-c-sync.png',
    craneDSync: 'stage/crane-d-sync.png',
    craneAb33: 'stage/crane-ab33.png',
    craneAb66: 'stage/crane-ab66.png',
    craneBd33: 'stage/crane-bd33.png',
    craneBd66: 'stage/crane-bd66.png',
    craneDc33: 'stage/crane-dc33.png',
    craneDc66: 'stage/crane-dc66.png',
    craneCa33: 'stage/crane-ca33.png',
    craneCa66: 'stage/crane-ca66.png',
    craneWait: 'stage/crane-wait.png',
    rays: 'stage/rays.svg?v=narrow2',
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

export const HOLLYWOOD_CRANE_FRAMES = [
  GAME_ASSET_PATHS.stage.craneASync,
  GAME_ASSET_PATHS.stage.craneBSync,
  GAME_ASSET_PATHS.stage.craneDSync,
  GAME_ASSET_PATHS.stage.craneCSync,
] as const;

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
