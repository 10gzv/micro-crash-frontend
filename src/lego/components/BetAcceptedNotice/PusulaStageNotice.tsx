import { FC, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

import {
  notificationStore,
  oddDataStore,
  useTranslation,
} from '@10gzv/crash-core';
import { gameAsset, GAME_ASSET_PATHS } from '@lego/constants/gameAssets';

import {
  findActivePusulaNotice,
  parseYouWonContent,
  PUSULA_NOTICE_MS,
  type PusulaPanelKey,
} from './pusulaNoticeHelpers';

/** Figma stage toasts — top-right; data from notificationStore (same as crash). */
export const PusulaStageNotice: FC = observer(() => {
  const { t } = useTranslation();
  const { notificationsData } = notificationStore;
  const active = findActivePusulaNotice(notificationsData);

  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panelKeyRef = useRef<PusulaPanelKey | null>(null);
  const [cashoutOdd, setCashoutOdd] = useState(0);

  useEffect(() => {
    if (active?.kind === 'cashout') {
      setCashoutOdd(Number(oddDataStore.odd) || 0);
    }
  }, [active?.key, active?.kind, active?.content]);

  useEffect(() => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }

    if (!active) {
      panelKeyRef.current = null;
      return undefined;
    }

    if (active.kind === 'cashout') {
      setCashoutOdd(Number(oddDataStore.odd) || 0);
    }

    panelKeyRef.current = active.key;
    hideTimer.current = setTimeout(() => {
      const key = panelKeyRef.current;
      if (!key) return;
      notificationStore.updateNotificationsData(
        { active: false, content: '' },
        key,
      );
    }, PUSULA_NOTICE_MS);

    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [active?.key, active?.kind, active?.content]);

  const visible = Boolean(active);
  const win = active?.kind === 'cashout' ? parseYouWonContent(active.content) : null;
  const oddLabel = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cashoutOdd);

  return (
    <div
      className={clsx('Pusula-StageNotice', {
        'Pusula-StageNotice_visible': visible,
        'Pusula-StageNotice_cashout': active?.kind === 'cashout',
        'Pusula-StageNotice_betAccepted': active?.kind === 'betAccepted',
      })}
      role='status'
      aria-live='polite'
      aria-hidden={!visible}
    >
      <span className='Pusula-StageNotice-IconWrap' aria-hidden>
        <img
          className='Pusula-StageNotice-Icon'
          src={gameAsset(GAME_ASSET_PATHS.icons.notice.betAccepted)}
          alt=''
          width={24}
          height={24}
          draggable={false}
        />
      </span>

      {active?.kind === 'betAccepted' && (
        <span className='Pusula-StageNotice-Text'>
          {t('notification.betAccepted', { defaultValue: 'Bet accepted!' })}
        </span>
      )}

      {active?.kind === 'cashout' && win && (
        <>
          <span className='Pusula-StageNotice-Label'>
            {t('betPanel.cashout', { defaultValue: 'Cashout' })}
          </span>
          <span className='Pusula-StageNotice-At'>
            {t('pusula.cashoutAt', {
              defaultValue: 'at x{{odd}}',
              odd: oddLabel,
            })}
          </span>
          <span className='Pusula-StageNotice-AmountPill'>
            <span className='Pusula-StageNotice-Amount'>
              {win.amount} {win.currency}
            </span>
          </span>
        </>
      )}
    </div>
  );
});
