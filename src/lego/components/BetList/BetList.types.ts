import { IBet } from '@10gzv/crash-core';
import { IBetListHeaderProps } from './-Header/BetList-Header.types';

export interface IBetListProps {
  bets: IBet[];
  headerNames?: IBetListHeaderProps['headerNames'];
  type?: 'row' | 'card';
}
