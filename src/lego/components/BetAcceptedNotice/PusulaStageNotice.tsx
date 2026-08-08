import { FC, useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

import { notificationStore, oddDataStore, useTranslation } from '@10gzv/crash-core';
import { gameAsset, GAME_ASSET_PATHS } from '@lego/constants/gameAssets';

import {
  listActivePusulaNotices,
  parseYouWonContent,
  PUSULA_NOTICE_MS,
  type PusulaNoticeItem,
  type PusulaPanelKey,
} from './pusulaNoticeHelpers';

type NoticeRowProps = {
  item: PusulaNoticeItem;
};

const PusulaStageNoticeRow: FC<NoticeRowProps> = observer(({ item }) => {
  const { t } = useTranslation();
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }

    hideTimer.current = setTimeout(() => {
      notificationStore.updateNotificationsData(
        { active: false, content: '' },
        item.key,
      );
    }, PUSULA_NOTICE_MS);

    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [item.key, item.kind, item.content]);

  const win =
    item.kind === 'cashout' ? parseYouWonContent(item.content) : null;
  const cashoutOdd =
    win?.odd != null && !Number.isNaN(win.odd)
      ? win.odd
      : Number(oddDataStore.odd) || 0;
  const oddLabel = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cashoutOdd);

  return (
    <div
      className={clsx('Pusula-StageNotice', 'Pusula-StageNotice_visible', {
        'Pusula-StageNotice_cashout': item.kind === 'cashout',
        'Pusula-StageNotice_betAccepted': item.kind === 'betAccepted',
      })}
      role='status'
      aria-live='polite'
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

      {item.kind === 'betAccepted' && (
        <span className='Pusula-StageNotice-Text'>
          {t('notification.betAccepted', { defaultValue: 'Bet accepted!' })}
        </span>
      )}

      {item.kind === 'cashout' && win && (
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

/** Figma stage toasts — top-right stack (first / second bet panels). */
export const PusulaStageNotice: FC = observer(() => {
  const { notificationsData } = notificationStore;
  const items = listActivePusulaNotices(notificationsData);

  if (!items.length) return null;

  return (
    <div className='Pusula-StageNoticeStack' aria-live='polite'>
      {items.map(item => (
        <PusulaStageNoticeRow key={item.key as PusulaPanelKey} item={item} />
      ))}
    </div>
  );
});
