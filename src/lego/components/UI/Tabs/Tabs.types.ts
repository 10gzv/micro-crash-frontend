import type { TabItem } from '@/lego/sections/LeftSection/LeftSection.types';

export interface ITabsProps {
  activeTabIndex: number;
  isDisabled?: boolean;
  onChange: (index: number) => void;
  items: TabItem[];
  className?: string;
}
