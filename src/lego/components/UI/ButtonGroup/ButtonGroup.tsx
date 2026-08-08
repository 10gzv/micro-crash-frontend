import { FC, PropsWithChildren, Children } from 'react';
import clsx from 'clsx';

import { IButtonGroupProps } from './ButtonGroup.types';

export const ButtonGroup: FC<PropsWithChildren<IButtonGroupProps>> = ({
  children,
  className,
}) => {
  return (
    <div className={clsx('Lego-ButtonGroup', className && className)}>
      {Children.map(children, el => {
        if (!el) return null;
        return <div className='Lego-ButtonGroup-Item'>{el}</div>;
      })}
    </div>
  );
};
