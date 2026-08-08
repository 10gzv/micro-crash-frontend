import { FC } from 'react';
import { observer } from 'mobx-react-lite';

import { BetCard } from '../BetCard';

import { IBetListProps } from './BetList.types';
import { BetListHeader } from './-Header';
import { BetListItem } from './-Item';

export const BetList: FC<IBetListProps> = observer(
  ({ headerNames, type = 'row', bets }) => {
    const Bet = type === 'row' ? BetListItem : BetCard;

    return (
      <div className='Lego-Bet-List'>
        {headerNames && <BetListHeader headerNames={headerNames} />}
        <ul className='Lego-Bet-List-Body'>
          {bets.map(bet => (
            <Bet key={bet.id} {...bet} withActions tag='li' />
          ))}
        </ul>
      </div>
    );
  },
);
