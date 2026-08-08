import { FC } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import Decimal from 'decimal.js';

import { getDisplayPrecision, userConfigsStore, userDataStore, useTranslation } from '@10gzv/crash-core';
import { useBodyScrollLock } from '@lego/hooks/useBodyScrollLock';
import {
  PUSULA_BURGER_MENU_ICONS,
  pusulaBurgerMenuIcon,
} from '@lego/constants/gameAssets';

export type PusulaGameLimitsPanelProps = {
  opened: boolean;
  onClose: () => void;
};

const formatLimit = (value: number | string | undefined) => {
  if (value == null || value === '') return '—';
  try {
    return new Decimal(value).toFixed(getDisplayPrecision());
  } catch {
    return String(value);
  }
};

export const PusulaGameLimitsPanel: FC<PusulaGameLimitsPanelProps> = observer(
  ({ opened, onClose }) => {
    const { t } = useTranslation();
    useBodyScrollLock(opened);
    const { currency } = userDataStore;
    const { minBet, maxBet, maxWin } = userConfigsStore;

    const rtpParam = new URLSearchParams(window.location.search).get('rtp');
    const rtpLabel = rtpParam
      ? `RTP ${rtpParam}${rtpParam.includes('%') ? '' : '%'}`
      : t('pusula.limits.rtpDefault', { defaultValue: 'RTP 92.10 - 97.50%' });

    const cards = [
      {
        value: `${formatLimit(minBet)} ${currency}`,
        label: t('pusula.limits.minBet', { defaultValue: 'Minimum bet' }),
      },
      {
        value: `${formatLimit(maxBet)} ${currency}`,
        label: t('pusula.limits.maxBet', { defaultValue: 'Maximum bet' }),
      },
      {
        value: `${formatLimit(maxWin)} ${currency}`,
        label: t('pusula.limits.maxPayout', { defaultValue: 'Maximum payout' }),
      },
    ];

    return (
      <>
        {opened && (
          <button
            type="button"
            className="Pusula-GameLimitsPanel-Backdrop"
            aria-label={t('pusula.settings.close', { defaultValue: 'Close' })}
            onClick={onClose}
          />
        )}
        <div
          className={clsx('Pusula-GameLimitsPanel', opened && 'Pusula-GameLimitsPanel_open')}
          role="dialog"
          aria-modal="true"
          aria-label={t('pusula.settings.gameLimits', { defaultValue: 'Game limits' })}
        >
          <header className="Pusula-GameLimitsPanel-Header">
            <div className="Pusula-GameLimitsPanel-Title">
              <img
                src={pusulaBurgerMenuIcon(PUSULA_BURGER_MENU_ICONS.gameLimits)}
                alt=""
                width={24}
                height={24}
                draggable={false}
              />
              <span>{t('pusula.settings.gameLimits', { defaultValue: 'Game limits' })}</span>
            </div>
            <button
              type="button"
              className="Pusula-GameLimitsPanel-Close"
              onClick={onClose}
              aria-label={t('pusula.settings.close', { defaultValue: 'Close' })}
            >
              <img
                src={pusulaBurgerMenuIcon(PUSULA_BURGER_MENU_ICONS.close)}
                alt=""
                width={14}
                height={14}
                draggable={false}
              />
            </button>
          </header>

          <div className="Pusula-GameLimitsPanel-Body">
            <div className="Pusula-GameLimitsPanel-Frame">
              <div className="Pusula-GameLimitsPanel-FrameInner">
                {cards.map((card) => (
                  <div key={card.label} className="Pusula-GameLimitsPanel-Card">
                    <div className="Pusula-GameLimitsPanel-CardValue">{card.value}</div>
                    <div className="Pusula-GameLimitsPanel-CardLabel">{card.label}</div>
                  </div>
                ))}
              </div>
              <p className="Pusula-GameLimitsPanel-Rtp">{rtpLabel}</p>
            </div>
          </div>
        </div>
      </>
    );
  },
);
