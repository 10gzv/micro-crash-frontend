import { FC, useMemo } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import Decimal from 'decimal.js';

import {
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

    const cashedOutCount = useMemo(
      () => bets.filter(b => !!b.cashout_odd).length,
      [bets],
    );

    const totalCount = Math.max(numOfBets || 0, bets.length);

    const totalWin = useMemo(() => {
      return bets.reduce((sum, bet) => {
        if (!bet.cashout_amount) return sum;
        return sum.plus(bet.cashout_amount);
      }, new Decimal(0));
    }, [bets]);

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
                {cashedOutCount}/{totalCount || 0}
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
            className='Pusula-TotalBets-ProgressFill'
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  },
);
