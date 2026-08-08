import { ReactNode } from 'react';

export interface IDropdownProps {
  opened: boolean;
  onClose: () => void;
  className?: string;
}

export interface IDropdownWrapperProps {
  children: ReactNode | string;
}

export interface IDropdownItem<T = string> {
  text: string;
  action: T;
  icon?: ReactNode | string;
}
