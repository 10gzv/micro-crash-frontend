import { FC, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import { HowToPlayActionsEnum, popupStore, servicesStore, useTranslation } from '@10gzv/crash-core';

import { Popup, Tabs } from '../UI';

import { IHowToPlayProps } from './HowToPlay.types';
import { GameLimits } from './-GameLimits/GameLimits';
import { GameRules } from './-GameRules/GameRules';

export const HowToPlay: FC<IHowToPlayProps> = observer(({ onClose }) => {
  const { t } = useTranslation();

  const title = (
    <div className='Lego-HowToPlay-Title'>
      <div>{t('htpPopup.gameSettings', { defaultValue: 'Game settings' })}</div>
    </div>
  );

  const tabs: Record<number, React.ReactNode> = {
    [popupStore.HOW_TO_PLAY_INDEXES.game_rules]: <GameRules />,
    [popupStore.HOW_TO_PLAY_INDEXES.game_limits]: <GameLimits />,
  };

  const tabItems = [
    {
      name: t('htpPopup.rules', { defaultValue: 'Rules' }),
      index: popupStore.HOW_TO_PLAY_INDEXES.game_rules,
      visible: true,
    },
    {
      name: t('htpPopup.limits', { defaultValue: 'Limits' }),
      index: popupStore.HOW_TO_PLAY_INDEXES.game_limits,
      visible: true,
    },
  ];

  const activeUiIndex = tabItems.findIndex(
    item => item.index === popupStore.howToPlayIndex,
  );

  useEffect(() => {
    if (
      popupStore.howToPlay &&
      popupStore.howToPlayIndex === popupStore.HOW_TO_PLAY_INDEXES.fairness_settings
    ) {
      popupStore.setHowToPlayIndex(popupStore.HOW_TO_PLAY_INDEXES.game_rules);
    }
  }, []);

  useEffect(() => {
    servicesStore.postMessageService.emitOnToggleGameRules(
      popupStore.howToPlayIndex === HowToPlayActionsEnum.GameRules,
    );
  }, [popupStore.howToPlayIndex]);

  return (
    <Popup onClose={onClose} title={title}>
      <div className='Lego-HowToPlay'>
        <Tabs
          className='Lego-HowToPlay-Tabs'
          activeTabIndex={activeUiIndex >= 0 ? activeUiIndex : 0}
          items={tabItems.map(({ name, visible }) => ({ name, visible }))}
          onChange={uiIndex => {
            const target = tabItems[uiIndex];
            if (target) popupStore.setHowToPlayIndex(target.index);
          }}
        />
        <br />
        {tabs[popupStore.howToPlayIndex] ?? tabs[popupStore.HOW_TO_PLAY_INDEXES.game_rules]}
      </div>
    </Popup>
  );
});
