import { FC, PropsWithChildren, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useMediaQuery } from 'react-responsive';
import { chatStore } from '@10gzv/crash-core';
import { Freebets } from '@10gzv/crash-core/freebets';

import { chatConnection, gameLiveConnection } from '@/connection';

import { LeftSection, GameSection, RightSection } from './sections';
import { Header } from './components/Header';
import { DrawHistory } from './components/DrawHistory';
import { BettingSection } from './sections/BettingSection';
import { PopupsList } from './components/UI';
import { PusulaCopyNotice } from './components/BetAcceptedNotice';
import { useSound } from './hooks/useSound';

export const GameCore: FC<PropsWithChildren> = observer(({ children }) => {
  const { isChatEnabled } = chatStore;
  const isDesktop = useMediaQuery({ query: '(min-width: 1025px)' });
  useSound();

  useEffect(() => {
    gameLiveConnection.createConnection();
    gameLiveConnection.sendToGetFreebetsList();
  }, []);

  useEffect(() => {
    if (isChatEnabled) {
      chatConnection.createConnection();
    }
  }, [isChatEnabled]);

  return (
    <>
      <div className='Lego-Core'>
        <Header />
        {isDesktop ? (
          <div className='Lego-GameContainer'>
            <LeftSection />
            <div className="Lego-GamePlay">
              <DrawHistory />
              <GameSection>{children}</GameSection>
              <BettingSection />
              {isChatEnabled && <RightSection />}
            </div>
          </div>
        ) : (
          <>
            <GameSection>{children}</GameSection>
            <DrawHistory />
            <BettingSection />
            <LeftSection />
            {isChatEnabled && <RightSection />}
          </>
        )}
      </div>
      <PopupsList />
      <Freebets />
      <PusulaCopyNotice />
    </>
  );
});
