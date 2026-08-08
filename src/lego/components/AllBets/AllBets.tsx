import { FC } from 'react';
import { observer } from 'mobx-react-lite';

import { BetList } from '../BetList';

import { IAllBetsProps } from './AllBets.types';
import { userBetsStore } from '@10gzv/crash-core';

export const AllBets: FC<IAllBetsProps> = observer(({ headerNames }) => {
  return (
    <div className='Lego-AllBets'>
      <BetList headerNames={headerNames} bets={userBetsStore.bets} />
    </div>
  );
});
