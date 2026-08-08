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

/** Parses core `notification.youWon` store line: "You won 0.64 EUR!" optional "#1.17" odd suffix. */
export function parseYouWonContent(content: string) {
  const withoutMeta = content.split('#')[0];
  const oddMatch = content.match(/#([\d.]+)\s*$/);
  const match = withoutMeta.match(
    /you won\s+([\d.,]+)\s*([A-Za-z]{3,10})/i,
  );
  if (!match) return null;
  return {
    amount: match[1],
    currency: match[2].toUpperCase(),
    odd: oddMatch ? Number(oddMatch[1]) : null,
  };
}

export type PusulaNoticeItem = {
  key: PusulaPanelKey;
  kind: 'cashout' | 'betAccepted';
  content: string;
};

/** All active panel toasts — first panel on top, second below. */
export function listActivePusulaNotices(
  notificationsData: INotificationsData,
): PusulaNoticeItem[] {
  const items: PusulaNoticeItem[] = [];
  for (const key of PUSULA_PANEL_KEYS) {
    const panel = notificationsData[key];
    if (!panel.active || !panel.content) continue;
    if (isCashoutNotice(panel.content)) {
      items.push({ key, kind: 'cashout', content: panel.content });
    } else if (isBetAcceptedNotice(panel.content)) {
      items.push({ key, kind: 'betAccepted', content: panel.content });
    }
  }
  return items;
}

/** @deprecated single-notice picker — use listActivePusulaNotices */
export function findActivePusulaNotice(
  notificationsData: INotificationsData,
): PusulaNoticeItem | null {
  return listActivePusulaNotices(notificationsData)[0] ?? null;
}
