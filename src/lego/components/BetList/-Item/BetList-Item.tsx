/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { FC } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import { Avatar } from '../../Avatar';
import { Odd } from '../../Odd';
import { getExchangeAmount, IBet } from '@10gzv/crash-core';
import { getPusulaOddTier } from '@/lego/helpers/pusulaOddColor';
import type { PusulaPersonTone } from '@/lego/components/Avatar/PusulaPersonAvatar';

export const BetListItem: FC<IBet> = observer(
  ({
    nickname,
    amount,
    currency,
    cashout_odd,
    cashout_amount,
    round_id,
  }) => {
    const pusulaTier = cashout_odd ? getPusulaOddTier(cashout_odd) : null;
    const avatarTone: PusulaPersonTone = pusulaTier || 'pending';

    return (
      <li
        className={clsx(
          'Lego-Bet-List-Item',
          cashout_odd && 'Lego-Bet-List-Item_won',
          !cashout_odd && 'Lego-Bet-List-Item_pending',
          pusulaTier && `Lego-Bet-List-Item_tier-${pusulaTier}`,
        )}>
        <div className='Lego-Bet-List-Item-Cell User'>
          <Avatar tone={avatarTone} /> <span>{nickname}</span>
        </div>
        <div className='Lego-Bet-List-Item-Cell Amount'>
          {getExchangeAmount(amount, currency)}
        </div>
        <div className='Lego-Bet-List-Item-Cell Odd'>
          <div className='Lego-Bet-List-Item-Cell-OddWrapper'>
            {cashout_odd ? (
              <Odd
                roundId={round_id}
                crashValue={cashout_odd}
                className='Lego-Bet-List-Item-Cell-Odd'
              />
            ) : (
              ''
            )}
          </div>
        </div>
        <div className='Lego-Bet-List-Item-Cell Win'>
          {cashout_amount ? getExchangeAmount(cashout_amount, currency) : ''}
        </div>
      </li>
    );
  },
);
