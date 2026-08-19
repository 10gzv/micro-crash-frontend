import { observer } from 'mobx-react-lite';
import { FC, lazy, Suspense } from 'react';
import { popupStore } from '@10gzv/crash-core';

import {
  PusulaAutoPlayPanel,
  PusulaGameLimitsPanel,
  PusulaGameRulesPanel,
  PusulaProvablyFairPanel,
} from '../../PusulaPopups';
import { pusulaPopupStore } from '@lego/stores/pusulaPopupStore';

const FairnessChecking = lazy(() =>
  import('../../FairnessChecking').then(m => ({ default: m.FairnessChecking })),
);
const ProvableInfo = lazy(() =>
  import('../../ProvableInfo').then(m => ({ default: m.ProvableInfo })),
);
const HowToPlay = lazy(() =>
  import('../../HowToPlay').then(m => ({ default: m.HowToPlay })),
);
const SoundConfirm = lazy(() =>
  import('../../Popups').then(m => ({ default: m.SoundConfirm })),
);

export { Popup } from './Popup';
export * from './Popup.types';

export const PopupsList: FC = observer(() => {
  const onCloseChecking = () => {
    popupStore.setCheckingProvableFairness(false);
  };

  const onCloseProvableInfo = () => {
    popupStore.setProvableInfo(false);
  };

  const onCloseHowToPlay = () => {
    popupStore.setHowToPlay(false);
  };

  const onCloseSoundConfirm = () => {
    popupStore.setSoundConfirm(false);
  };

  const onCloseAutoPlay = () => {
    popupStore.setAutoplay(null);
  };

  return (
    <Suspense fallback={null}>
      {popupStore.checkingProvableFairness && (
        <FairnessChecking onClose={onCloseChecking} />
      )}
      {popupStore.provableInfo && (
        <ProvableInfo onClose={onCloseProvableInfo} />
      )}
      {popupStore.howToPlay && <HowToPlay onClose={onCloseHowToPlay} />}
      <PusulaAutoPlayPanel
        opened={popupStore.autoplay !== null}
        betPanelIndex={popupStore.autoplay ?? 0}
        onClose={onCloseAutoPlay}
      />
      <PusulaGameLimitsPanel
        opened={pusulaPopupStore.gameLimitsOpen}
        onClose={() => pusulaPopupStore.closeGameLimits()}
      />
      <PusulaGameRulesPanel
        opened={pusulaPopupStore.gameRulesOpen}
        onClose={() => pusulaPopupStore.closeGameRules()}
      />
      <PusulaProvablyFairPanel
        opened={pusulaPopupStore.provablyFairOpen}
        onClose={() => pusulaPopupStore.closeProvablyFair()}
      />
      {popupStore.soundConfirm && (
        <SoundConfirm onClose={onCloseSoundConfirm} />
      )}
    </Suspense>
  );
});
