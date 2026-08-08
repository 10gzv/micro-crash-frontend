import { FC } from 'react';
import { observer } from 'mobx-react-lite';

import { Badge, SvgUse } from '../UI';
import { Odd } from '../Odd';

import { IDrawHistoryProps } from './DrawHistory.types';
import { gamePreviousResultsStore, gameStore, oddDataStore } from '@10gzv/crash-core';

export const DrawHistory: FC<IDrawHistoryProps> = observer(() => {
  const { gamePreviousResults } = gamePreviousResultsStore;
  const { seconds } = gameStore;

  const getBadgeText = () => {
    if (seconds) {
      return `00:0${seconds}`;
    }
    return `x${oddDataStore.odd}`;
  };

  return (
    <div className='Lego-DrawHistory'>
      <Badge className='Lego-DrawHistory-NextOdd'>{getBadgeText()}</Badge>
      <div className='Lego-DrawHistory-List'>
        {gamePreviousResults.map(result => (
          <Odd
            roundId={result.id}
            key={result.id}
            crashValue={result.crashValue}
          />
        ))}
      </div>
      <div className='Lego-DrawHistory-EndBadge'>
        <SvgUse id='clock' className='Lego-DrawHistory-ClockIcon' />
      </div>
    </div>
  );
});
