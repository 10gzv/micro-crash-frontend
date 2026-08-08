import type { INotificationsData } from '@10gzv/crash-core';

export type PusulaPanelKey = keyof INotificationsData;

export const PUSULA_PANEL_KEYS: PusulaPanelKey[] = ['first', 'second'];

export const PUSULA_NOTICE_MS = 3000;

export function isBetAcceptedNotice(content: string) {
  const lower = content.toLowerCase();
  if (
    /cancel|you won|insufficient|went wrong|placing your bet|freebet remaining/i.test(
      lower,
    )
  ) {
    return false;
  }
  return /accept|accepted|kabul edildi|^bet accepted/i.test(lower);
}

export function isCashoutNotice(content: string) {
  return /you won|kazand/i.test(content.toLowerCase());
}

/** Parses core `notification.youWon` store line: "You won 0.64 EUR!" */
export function parseYouWonContent(content: string) {
  const match = content.match(
    /you won\s+([\d.,]+)\s*([A-Za-z]{3,10})/i,
  );
  if (!match) return null;
  return { amount: match[1], currency: match[2].toUpperCase() };
}

export function findActivePusulaNotice(
  notificationsData: INotificationsData,
): {
  key: PusulaPanelKey;
  kind: 'cashout' | 'betAccepted';
  content: string;
} | null {
  for (const key of PUSULA_PANEL_KEYS) {
    const panel = notificationsData[key];
    if (!panel.active || !panel.content) continue;
    if (isCashoutNotice(panel.content)) {
      return { key, kind: 'cashout', content: panel.content };
    }
  }
  for (const key of PUSULA_PANEL_KEYS) {
    const panel = notificationsData[key];
    if (!panel.active || !panel.content) continue;
    if (isBetAcceptedNotice(panel.content)) {
      return { key, kind: 'betAccepted', content: panel.content };
    }
  }
  return null;
}
