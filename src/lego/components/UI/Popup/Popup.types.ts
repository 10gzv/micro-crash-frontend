import { ReactNode } from 'react';

export interface IPopupProps {
  onClose: () => void;
  title?: string | ReactNode;
  footer?: string | ReactNode;
  dismissable?: boolean;
  className?: string;
}
