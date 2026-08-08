import { FC } from 'react';

import { PusulaPersonAvatar } from './PusulaPersonAvatar';

import { IAvatarProps } from './Avatar.types';

export const Avatar: FC<IAvatarProps> = ({ tone = 'a' }) => {
  return <PusulaPersonAvatar className='Lego-Avatar' tone={tone} size={18} />;
};
