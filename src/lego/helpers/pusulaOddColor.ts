/**
 * Figma coefficient colors (DrawHistory + bet list):
 * - low  < 2x   → #7B88A8  rgba(123, 136, 168, 1)
 * - mid  < 10x  → #FFAC2C  rgba(255, 172, 44, 1)
 * - high ≥ 10x  → #FF7A45  rgba(255, 122, 69, 1)
 */
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
