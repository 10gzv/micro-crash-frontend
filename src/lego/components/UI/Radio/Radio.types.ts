import { InputHTMLAttributes } from 'react';

export interface IRadioProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  isDisabled?: boolean;
  hoverable?: boolean;
  labelPosition?: 'left' | 'right';
}
