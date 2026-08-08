import { FC } from 'react';
import clsx from 'clsx';

import { ISvgUseProps } from './SvgUse.types';

export const SvgUse: FC<ISvgUseProps> = ({ className, id, onClick }) => {
  return (
    <svg className={clsx('Lego-Svg', className && className)} onClick={onClick}>
      <use xlinkHref={`#${id}`} />
    </svg>
  );
};
