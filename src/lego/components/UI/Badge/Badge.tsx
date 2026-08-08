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
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
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
