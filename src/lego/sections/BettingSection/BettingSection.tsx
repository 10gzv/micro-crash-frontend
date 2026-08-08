import { FC } from 'react';

import { BetPanel } from '@/lego/components/BetPanel';

export const BettingSection: FC = () => {
  return (
    <div className='Lego-BettingSection'>
      <BetPanel betPanelIndex={0} />
      <BetPanel betPanelIndex={1} />
    </div>
  );
};
