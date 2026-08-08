import { FC } from 'react';

import { IBetListHeaderProps } from './BetList-Header.types';

export const BetListHeader: FC<IBetListHeaderProps> = ({ headerNames }) => {
  return (
    <div className='Lego-Bet-List-Header'>
      {headerNames.map(name => (
        <span key={name} title={name} className='Lego-Bet-List-Header-Item'>
          {name}
        </span>
      ))}
    </div>
  );
};
