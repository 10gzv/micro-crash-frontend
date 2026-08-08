import { FC, useMemo } from 'react';
import clsx from 'clsx';

import { IProgressProps } from './Progress.types';

export const Progress: FC<IProgressProps> = ({
  duration,
  remaining,
  reverse,
}) => {
  const { animationDuration, completedPercent } = useMemo(() => {
    const percent = (Math.max(remaining, 0) / duration) * 100;
    return {
      completedPercent: reverse ? 100 - percent : percent,
      animationDuration: `${remaining}s`,
    };
  }, []);

  return (
    <div className={clsx('Lego-Progress', reverse && 'Lego-Progress_reverse')}>
      <div
        className='Lego-Progress-Inner'
        style={{ inset: `0 ${completedPercent}% 0 0`, animationDuration }}
      />
    </div>
  );
};
