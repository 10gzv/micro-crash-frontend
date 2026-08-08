import { InputHTMLAttributes } from 'react';

export interface ICheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  isDisabled?: boolean;
  hoverable?: boolean;
  labelPosition?: 'left' | 'right';
}
