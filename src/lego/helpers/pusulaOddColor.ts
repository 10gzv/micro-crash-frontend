
export type PusulaOddTier = 'low' | 'mid' | 'high';

export const PUSULA_ODD_COLORS = {
  low: '#7B88A8',
  mid: '#FFAC2C',
  high: '#FF7A45',
} as const;

export function getPusulaOddTier(rate: number | string | undefined | null): PusulaOddTier {
  const n = Number(rate);
  if (!Number.isFinite(n) || n < 2) return 'low';
  if (n < 10) return 'mid';
  return 'high';
}
