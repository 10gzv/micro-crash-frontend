import { ReactNode } from 'react';

export interface ILeftSectionProps {
  tabs?: TabItem[];
  tabContainers?: ReactNode[];
}

export interface TabItem {
  name: string;
  visible: boolean;
  id?: number;
  className?: string;
}
