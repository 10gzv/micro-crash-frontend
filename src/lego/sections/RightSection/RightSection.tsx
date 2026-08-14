import { FC, lazy, Suspense } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { chatStore } from '@10gzv/crash-core';

import { IRightSectionProps } from './RightSection.types';

const Chat = lazy(() =>
  import('@/lego/components/Chat').then(module => ({ default: module.Chat })),
);

export const RightSection: FC<IRightSectionProps> = observer(() => {
  const { isChatEnabled, isChatOpened } = chatStore;

  return (
    <div
      className={clsx('Lego-RightSection', {
        'Lego-RightSection_open': isChatOpened,
      })}>
      {isChatEnabled && (
        <Suspense fallback={null}>
          <Chat />
        </Suspense>
      )}
    </div>
  );
});
