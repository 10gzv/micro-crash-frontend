import { FC, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import { BetList } from '../BetList';

import { ITopBetsProps } from './TopBets.types';
import { topBetsStore } from '@10gzv/crash-core';

export const TopBets: FC<ITopBetsProps> = observer(() => {
  useEffect(() => {
    topBetsStore.sendGetTopBets();
  }, []);

  return (
    <div className='Lego-TopBets'>
      <BetList bets={topBetsStore.bets} type='card' />
    </div>
  );
});
