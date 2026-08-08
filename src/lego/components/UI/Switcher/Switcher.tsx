import { FC } from 'react';

import { ISwitcherProps } from './Switcher.types';

export const Switcher: FC<ISwitcherProps> = props => {
  return (
    <label className='Lego-Switcher'>
      <input type='checkbox' {...props} />
      <span className='Lego-Switcher-Slider' />
    </label>
  );
};
