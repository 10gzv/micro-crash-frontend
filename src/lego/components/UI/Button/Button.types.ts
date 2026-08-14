import { ButtonHTMLAttributes } from 'react';

export interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  active?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: 'm' | 'l';

  variant?: 'default' | 'primary' | 'success' | 'failure';
}
