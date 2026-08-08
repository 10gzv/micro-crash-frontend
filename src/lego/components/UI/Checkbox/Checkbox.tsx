import clsx from 'clsx';
import { FC } from 'react';

import { ICheckboxProps } from './Checkbox.types';

export const Checkbox: FC<ICheckboxProps> = props => {
  const {
    checked,
    label,
    labelPosition = 'right',
    hoverable = true,
    isDisabled,
    className,
    ...checkboxProps
  } = props;

  return (
    <label
      className={clsx(
        'Lego-Checkbox',
        className && className,
        checked && 'Lego-Checkbox_checked',
        isDisabled && 'Lego-Checkbox_Disabled',
        hoverable && 'Lego-Checkbox-Hover',
      )}>
      {label && (
        <span
          className={clsx(
            'Lego-Checkbox-Label',
            `Lego-Checkbox-Label_${labelPosition}`,
          )}>
          {label}
        </span>
      )}
      <span className='Lego-Checkbox-Box'>
        <span className='Lego-Checkbox-Tick' />
        <input
          className='Lego-Checkbox-Input'
          type='checkbox'
          checked={checked}
          {...checkboxProps}
        />
      </span>
    </label>
  );
};
