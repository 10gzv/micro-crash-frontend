import { observer } from 'mobx-react-lite';
import { FC, useEffect, useState } from 'react';
import clsx from 'clsx';

import { gameStore, oddDataStore } from '@10gzv/crash-core';

export const Score: FC = observer(() => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const { odd } = oddDataStore;
  const { isRoundOver } = gameStore;

  useEffect(() => {
    if (isPopupVisible) {
      const timeoutId = setTimeout(() => {
        setIsPopupVisible(false);
      }, 5000);

      return () => clearTimeout(timeoutId);
    }
  }, [isPopupVisible]);

  useEffect(() => {
    if (isRoundOver) {
      setIsPopupVisible(true);
    }
  }, [isRoundOver]);

  return (
    <div
      className={clsx(
        'Lego-Score',
        isPopupVisible && odd && 'Lego-Score_startAnimation',
      )}>
      {/* <SvgUse id='score' className='Lego-Score-Svg' /> */}
      <div className='Lego-Score-Content'>
        <div className='Lego-Score-Odd'>x{Number(odd)?.toFixed(2)}</div>
      </div>
    </div>
  );
});
