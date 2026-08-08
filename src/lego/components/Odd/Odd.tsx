import { FC } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import { Badge } from '../UI';
import { getPusulaOddTier } from '@lego/helpers/pusulaOddColor';

import { IOddProps } from './Odd.types';
import { getOddColor } from './Odd.helpers';
import { fairnessStore } from '@10gzv/crash-core';

export const Odd: FC<IOddProps> = observer(
  ({ roundId, crashValue, className }) => {
    const onClick = () => {
      if (!roundId) return;
      fairnessStore.sendGetRoundFairness(roundId);
    };

    const tier = getPusulaOddTier(crashValue);

    return (
      <>
        <Badge
          onClick={onClick}
          color={getOddColor(crashValue)}
          className={clsx(
            'Lego-Odd',
            roundId && 'Lego-Odd_active',
            tier && `Lego-Odd_tier-${tier}`,
            className && className,
          )}>
          <span className='Lego-Odd-Rate'>x</span>
          <span>{Number(crashValue).toFixed(2)}</span>
        </Badge>
      </>
    );
  },
);
