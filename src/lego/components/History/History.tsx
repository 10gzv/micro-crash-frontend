import { FC, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import { BetList } from '../BetList';

import { IHistoryProps } from './History.types';
import { userHistoryStore } from '@10gzv/crash-core';

export const History: FC<IHistoryProps> = observer(({ headerNames }) => {
  useEffect(() => {
    userHistoryStore.sendGetMyLast();
  }, []);

  return (
    <div className='Lego-History'>
      <BetList headerNames={headerNames} bets={userHistoryStore.bets} />
    </div>
  );
});
