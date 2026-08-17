import { FC } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import Decimal from 'decimal.js';

import {
  gameStore,
  getDisplayPrecision,
  userBetsStore,
  userDataStore,
  useTranslation,
} from '@10gzv/crash-core';
import { PusulaPersonAvatar } from '@/lego/components/Avatar/PusulaPersonAvatar';

export const PusulaTotalBets: FC<{ className?: string }> = observer(
  ({ className }) => {
    const { t } = useTranslation();
    const { bets, numOfBets } = userBetsStore;
    const { currency } = userDataStore;
    const { isOddStarted, isRoundOver } = gameStore;

    const isLive = isOddStarted && !isRoundOver;
    const totalCount = Math.max(numOfBets || 0, bets.length);

    let cashedOutCount = 0;
    const totalWin = bets.reduce((sum, bet) => {
      if (bet.cashout_odd) cashedOutCount += 1;
      if (bet.cashout_amount) return sum.plus(bet.cashout_amount);
      if (bet.cashout_odd) {
        return sum.plus(new Decimal(bet.amount).times(bet.cashout_odd));
      }
      return sum;
    }, new Decimal(0));

    const remaining = Math.max(0, totalCount - cashedOutCount);
    const progress = totalCount
      ? Math.min(100, (cashedOutCount / totalCount) * 100)
      : 0;

    const winDisplay = totalWin.toFixed(getDisplayPrecision());

    return (
      <div className={clsx('Pusula-TotalBets', className)}>
        <div className='Pusula-TotalBets-Row'>
          <div className='Pusula-TotalBets-Left'>
            <div className='Pusula-TotalBets-Avatars' aria-hidden>
              <PusulaPersonAvatar tone='a' />
              <PusulaPersonAvatar tone='b' />
              <PusulaPersonAvatar tone='c' />
            </div>
            <div className='Pusula-TotalBets-BetsMeta'>
              <span className='Pusula-TotalBets-BetsCount'>
                {remaining}/{totalCount || 0}
              </span>
              <span className='Pusula-TotalBets-BetsLabel'>
                {t('totalBets.title', { defaultValue: 'Bets' })}
              </span>
            </div>
          </div>
          <div className='Pusula-TotalBets-Right'>
            <span className='Pusula-TotalBets-WinValue'>{winDisplay}</span>
            <span className='Pusula-TotalBets-WinLabel'>
              {t('totalBets.totalWin', {
                defaultValue: 'Total win {{currency}}',
                currency: currency || 'USD',
              })}
            </span>
          </div>
        </div>
        <div className='Pusula-TotalBets-Progress' aria-hidden>
          <div
            className={clsx('Pusula-TotalBets-ProgressFill', {
              'Pusula-TotalBets-ProgressFill_loading': isLive,
            })}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  },
);
