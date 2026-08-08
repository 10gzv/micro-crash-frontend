import { FC } from 'react';

import { Button, SvgUse } from '../UI';

import '@styles/lego/components/ProvableInfoTrigger.scss';
import { popupStore } from '@10gzv/crash-core';

export const ProvableInfoTrigger: FC = () => {
  return (
    <div className='Lego-ProvableInfoTrigger'>
      <Button
        className='Lego-ProvableInfoTrigger-Button'
        variant='success'
        onClick={() => popupStore.setProvableInfo(true)}>
        <SvgUse id='provable' />
      </Button>
    </div>
  );
};
