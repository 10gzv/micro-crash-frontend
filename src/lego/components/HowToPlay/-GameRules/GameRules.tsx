/** @format */

import { observer } from 'mobx-react-lite';
import { FC } from 'react';

import { Trans, userConfigsStore, userDataStore, useTranslation } from '@10gzv/crash-core';

export const GameRules: FC = observer(() => {
    const { t } = useTranslation();
  return (
    <>
      <div className="Lego-HowToPlay-Text">
        {t('htpPopup.rulesTab.title', {
          defaultValue:
            'Pusulabet Crash is a new game allowing Gamers to place bets easily with one click and win up to',
        })}{' '}
        <span className="Lego-HowToPlay-Highlight">
          {userConfigsStore.maxWin} {userDataStore.currency}
        </span>
        .
      </div>
      <div className="Lego-HowToPlay-Caption">
        {t('htpPopup.rulesTab.htp', { defaultValue: 'How to play?' })}
      </div>
      <div className="Lego-HowToPlay-Text">
        <Trans i18nKey='htpPopup.rulesTab.paragraph1'>
          Chart start to grow and the coefficient begins to grow in parallel․
          The Gamer needs to place a BET(s) before the round starts, otherwise,
          the placed bets during the started round will participate for the next
          round.
          Once the round started the Gamer should click on the
          whenever wanted but before the round finishes.
        </Trans>

      </div>
      <div className="Lego-HowToPlay-Text">
        <Trans i18nKey='htpPopup.rulesTab.paragraph2'>
          The Gamer can use Auto Bet and/or Auto Cashout features
          to place the same amount bets and make the same amount cashouts
          automatically until switching off the auto modes. The Gamer wins in case
          the Cashout is done before the chart and the coefficient stops to grow.
          The Gamer loses if the Cashout has not been done before the round
          finishes. The winning amount is calculated by multiplying the
          coefficient by the bet's amount. After Cashout, the won amount will be
          reflected on the Gamer's balance instantly.
        </Trans>

      </div>
    </>
  );
});
