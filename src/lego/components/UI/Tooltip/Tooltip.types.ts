import type { Placement, Strategy } from '@floating-ui/react';

export interface ITooltipProps {
  placement: Placement;
  isAutoUpdate?: boolean;
  strategy?: Strategy;
}
