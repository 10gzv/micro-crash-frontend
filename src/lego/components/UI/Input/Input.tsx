import { FC } from 'react';
import clsx from 'clsx';

import { IInputProps } from './Input.types';

export const Input: FC<IInputProps> = props => {
  const {
    className,
    containerClassName,
    addonAfter,
    addonBefore,
    isDisabled,
    ...rest
  } = props;

  return (
    <div
      className={clsx(
        'Lego-InputContainer',
        containerClassName && containerClassName,
        isDisabled && 'Lego-InputContainer_Disabled',
      )}>
      {addonBefore && (
        <div className='Lego-Input-AddonBefore'>{addonBefore}</div>
      )}
      <input className={clsx('Lego-Input', className && className)} {...rest} />
      {addonAfter && <div className='Lego-Input-AddonAfter'>{addonAfter}</div>}
    </div>
  );
};
