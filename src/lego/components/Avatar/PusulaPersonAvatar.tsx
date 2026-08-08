import { FC } from 'react';
import clsx from 'clsx';

import { gameAsset, GAME_ASSET_PATHS } from '@lego/constants/gameAssets';

const PERSON_URL = gameAsset(GAME_ASSET_PATHS.icons.avatars.person);

/** a/b/c = decorative stack; low/mid/high = Figma coefficient tiers */
export type PusulaPersonTone = 'a' | 'b' | 'c' | 'd' | 'low' | 'mid' | 'high' | 'pending';

type PusulaPersonAvatarProps = {
  tone?: PusulaPersonTone;
  className?: string;
  size?: number;
};

/**
 * Figma person avatar — colored circle + person.svg silhouette.
 * Used in stage players pill, total bets, and bet list (pusulabet only).
 */
export const PusulaPersonAvatar: FC<PusulaPersonAvatarProps> = ({
  tone = 'a',
  className,
  size,
}) => {
  return (
    <span
      className={clsx(
        'Pusula-PersonAvatar',
        `Pusula-PersonAvatar_${tone}`,
        className,
      )}
      style={
        size
          ? { width: size, height: size, minWidth: size, minHeight: size }
          : undefined
      }
      aria-hidden
    >
      <img src={PERSON_URL} alt='' className='Pusula-PersonAvatar-Icon' draggable={false} />
    </span>
  );
};
