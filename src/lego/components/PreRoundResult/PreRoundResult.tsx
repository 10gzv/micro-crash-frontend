import { FC, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import { BetList } from '../BetList';

import { IPreRoundResultProps } from './PreRoundResult.types';
import { preRoundResultStore } from '@10gzv/crash-core';

export const PreRoundResult: FC<IPreRoundResultProps> = observer(
  ({ headerNames }) => {
    useEffect(() => {
      preRoundResultStore.sendGetPreviousRoundResult();
    }, []);

    return (
      <div className='Lego-PreRoundResult'>
        <BetList headerNames={headerNames} bets={preRoundResultStore.bets} />
      </div>
    );
  },
);
