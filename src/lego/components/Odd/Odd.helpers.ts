import { EBadgeColor } from '../UI';
import { getPusulaOddTier } from '@lego/helpers/pusulaOddColor';

/** Pusulabet Figma tiers — mapped to badge enums, painted in Odd.scss. */
export const getOddColor = (rate: number): EBadgeColor => {
  const rateNumber = Number(rate);
  const tier = getPusulaOddTier(rateNumber);
  if (tier === 'low') return EBadgeColor.BLUE;
  if (tier === 'mid') return EBadgeColor.YELLOW;
  return EBadgeColor.RED;
};
