import { FC, PropsWithChildren } from 'react';
import clsx from 'clsx';

import { IBadgeProps } from './Badge.types';

export const Badge: FC<PropsWithChildren<IBadgeProps>> = ({
  children,
  color,
  className,
  onClick,
}) => {
  return (

    <div
      className={clsx(
        'Lego-Badge',
        color && `Lego-Badge_${color}`,
        className && className,
      )}
      onClick={onClick}
      role='button'
      tabIndex={0}>
      {children}
    </div>
  );
};
