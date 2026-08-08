import { FC } from 'react';
import clsx from 'clsx';

import { Spinner } from '../Spinner';

import { IButtonProps } from './Button.types';

export const Button: FC<IButtonProps> = props => {
  const {
    children,
    className,
    loading,
    active,
    disabled,
    leftIcon,
    rightIcon,
    size = 'l',
    variant = 'default',
    onClick,
    ...defaultProps
  } = props;
  return (
    <button
      type='button'
      className={clsx(
        'Lego-Button',
        `Lego-Button_${variant}`,
        `Lego-Button_${size}`,
        loading && 'Lego-Button_loading',
        active && 'Lego-Button_active',
        onClick && 'Lego-Button_interactive',
        className && className,
      )}
      {...defaultProps}
      onClick={onClick}
      disabled={disabled || loading}>
      <div className='Lego-Button-Inner'>
        {loading && <Spinner />}
        <div className='Lego-Button-Content'>
          {leftIcon && <span className='Lego-Button-LeftIcon'>{leftIcon}</span>}
          <span className='Lego-Button-Text'>{children}</span>
          {rightIcon && (
            <span className='Lego-Button-RightIcon'>{rightIcon}</span>
          )}
        </div>
      </div>
    </button>
  );
};
