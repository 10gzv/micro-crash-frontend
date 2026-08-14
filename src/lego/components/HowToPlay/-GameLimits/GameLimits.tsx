import { observer } from 'mobx-react-lite';
import { FC } from 'react';

import { userConfigsStore, userDataStore, useTranslation } from '@10gzv/crash-core';

export const GameLimits: FC = observer(() => {
  const { t } = useTranslation();
  const rtp = new URLSearchParams(window.location.search).get('rtp');

  return (
    <>
      <div className='Lego-HowToPlay-Text'>
        {t('htpPopup.limitsTab.title', {
          defaultValue:
            'The Gamer can place 2 bets simultaneously during a single round.',
        })}
      </div>
      <div className='Lego-HowToPlay-Text'>
        {t('htpPopup.limitsTab.minBet', {
          defaultValue: 'Minimum bet',
        })}{' '}
        <span className='Lego-HowToPlay-Highlight'>
          {userConfigsStore.minBet} {userDataStore.currency}
        </span>
      </div>
      <div className='Lego-HowToPlay-Text'>
        {t('htpPopup.limitsTab.maxBet', {
          defaultValue: 'Maximum bet',
        })}
        {' '}
        <span className='Lego-HowToPlay-Highlight'>
          {userConfigsStore.maxBet} {userDataStore.currency}
        </span>
      </div>
      <div className='Lego-HowToPlay-Text'>
        {t('htpPopup.limitsTab.maxWin', {
          defaultValue: 'Maximum win',
        })}
        {' '}
        <span className='Lego-HowToPlay-Highlight'>
          {userConfigsStore.maxWin} {userDataStore.currency}
        </span>
      </div>
      {rtp && (
        <div className='Lego-HowToPlay-Text'>
          {t('burgerMenu.limitsTab.rtp', {
            defaultValue: 'RTP',
            })}{' '}
        <span className='Lego-HowToPlay-Highlight'>{rtp} % </span>
      </div>
      )}
    </>
  );
});
