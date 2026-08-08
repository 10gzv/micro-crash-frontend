import clsx from 'clsx';
import { FC } from 'react';

import { IRadioProps } from './Radio.types';

export const Radio: FC<IRadioProps> = props => {
  const {
    checked,
    label,
    labelPosition = 'right',
    hoverable = true,
    isDisabled,
    ...checkboxProps
  } = props;

  return (
    <label
      className={clsx(
        'Lego-Radio',
        checked && 'Lego-Radio_checked',
        isDisabled && 'Lego-Radio_Disabled',
        hoverable && 'Lego-Radio-Hover',
      )}>
      {label && (
        <span
          className={clsx(
            'Lego-Radio-Label',
            `Lego-Radio-Label_${labelPosition}`,
          )}>
          {label}
        </span>
      )}
      <span className='Lego-Radio-Box'>
        <span className='Lego-Radio-Tick' />
        <input
          className='Lego-Radio-Input'
          type='radio'
          checked={checked}
          {...checkboxProps}
        />
      </span>
    </label>
  );
};
