import { ReactNode, InputHTMLAttributes } from 'react';

export interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
  addonBefore?: ReactNode;
  addonAfter?: ReactNode;
  isDisabled?: boolean;
  containerClassName?: string;
}
