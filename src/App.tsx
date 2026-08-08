import { FC, Suspense } from 'react';
import { GameCore as BaseGameCore } from '@10gzv/crash-core';
import { GameCore } from "./lego";
import { CLARITY_ID } from './constants';

export const App: FC = () => {
  return (
  <Suspense fallback=''>
      <BaseGameCore clarityId={CLARITY_ID}>
        <GameCore />
      </BaseGameCore>
    </Suspense>
  )
};

export default App;
