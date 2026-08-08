import { FC, KeyboardEvent, useCallback, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import { userConfigsStore, userDataStore, useTranslation } from '@10gzv/crash-core';
import { useBodyScrollLock } from '@lego/hooks/useBodyScrollLock';
import {
  PUSULA_BURGER_MENU_ICONS,
  pusulaBurgerMenuIcon,
} from '@lego/constants/gameAssets';

export type PusulaGameRulesPanelProps = {
  opened: boolean;
  onClose: () => void;
};

type RulesSection = {
  id: string;
  title: string;
  body: string;
};

export const PusulaGameRulesPanel: FC<PusulaGameRulesPanelProps> = observer(
  ({ opened, onClose }) => {
    const { t } = useTranslation();
    useBodyScrollLock(opened);

    const { currency } = userDataStore;
    const { maxWin } = userConfigsStore;

    const sections = useMemo((): RulesSection[] => {
      const introTitle = t('pusula.rules.sections.intro', { defaultValue: 'Crash Original' });
      const introBody = `${t('htpPopup.rulesTab.title', {
        defaultValue:
          'Pusulabet Crash is a new game allowing Gamers to place bets easily with one click and win up to',
      })} ${maxWin} ${currency}.`;

      return [
        { id: 'intro', title: introTitle, body: introBody },
        {
          id: 'chooseBet',
          title: t('pusula.rules.sections.chooseBet', { defaultValue: '1. Choose Your Bet' }),
          body: t('pusula.rules.chooseBetBody', {
            defaultValue:
              'The round takes off, and the coefficient begins to rise in parallel. The Gamer needs to place a BET(s) before the round starts, otherwise, the placed bets during the started round will participate for the next round.',
          }),
        },
        {
          id: 'cashout',
          title: t('pusula.rules.sections.cashout', { defaultValue: '2. Cashout' }),
          body: t('pusula.rules.cashoutBody', {
            defaultValue:
              'Once the round started the Gamer should click on the Cashout button whenever wanted but before the round finishes.',
          }),
        },
        {
          id: 'auto',
          title: t('pusula.rules.sections.auto', {
            defaultValue: '3. Auto bet & Auto Cashout',
          }),
          body: t('pusula.rules.autoBody', {
            defaultValue:
              'The Gamer can use Auto Bet and/or Auto Cashout features to place the same amount bets and make the same amount cashouts automatically until switching off the auto modes.',
          }),
        },
        {
          id: 'outcome',
          title: t('pusula.rules.sections.outcome', { defaultValue: '4. Await the Outcome' }),
          body: t('pusula.rules.outcomeBody', {
            defaultValue:
              "The Gamer wins in case the Cashout is done before the chart and the coefficient stops to grow. The Gamer loses if the Cashout has not been done before the round finishes. The winning amount is calculated by multiplying the coefficient by the bet's amount. After Cashout, the won amount will be reflected on the Gamer's balance instantly.",
          }),
        },
      ];
    }, [currency, maxWin, t]);

    const [openIds, setOpenIds] = useState<Set<string>>(() => new Set(['intro']));

    useEffect(() => {
      if (opened) {
        setOpenIds(new Set(['intro']));
      }
    }, [opened]);

    const toggleSection = useCallback((id: string) => {
      setOpenIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });
    }, []);

    const onToggleKey = (event: KeyboardEvent<HTMLButtonElement>, id: string) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleSection(id);
      }
    };

    return (
      <>
        {opened && (
          <button
            type="button"
            className="Pusula-GameRulesPanel-Backdrop"
            aria-label={t('pusula.settings.close', { defaultValue: 'Close' })}
            onClick={onClose}
          />
        )}
        <div
          className={clsx('Pusula-GameRulesPanel', opened && 'Pusula-GameRulesPanel_open')}
          role="dialog"
          aria-modal="true"
          aria-label={t('pusula.settings.gameRules', { defaultValue: 'Game rules' })}
        >
          <header className="Pusula-GameRulesPanel-Header">
            <div className="Pusula-GameRulesPanel-Title">
              <img
                src={pusulaBurgerMenuIcon(PUSULA_BURGER_MENU_ICONS.document)}
                alt=""
                width={24}
                height={24}
                draggable={false}
              />
              <span>{t('pusula.settings.gameRules', { defaultValue: 'Game rules' })}</span>
            </div>
            <button
              type="button"
              className="Pusula-GameRulesPanel-Close"
              onClick={onClose}
              aria-label={t('pusula.settings.close', { defaultValue: 'Close' })}
            >
              <img
                src={pusulaBurgerMenuIcon(PUSULA_BURGER_MENU_ICONS.close)}
                alt=""
                width={14}
                height={14}
                draggable={false}
              />
            </button>
          </header>

          <div className="Pusula-GameRulesPanel-Body">
            <div className="Pusula-GameRulesPanel-List">
              {sections.map((section) => {
                const isOpen = openIds.has(section.id);
                return (
                  <section
                    key={section.id}
                    className={clsx(
                      'Pusula-GameRulesPanel-Item',
                      isOpen && 'Pusula-GameRulesPanel-Item_open',
                    )}
                  >
                    <div className="Pusula-GameRulesPanel-ItemHead">
                      <h3 className="Pusula-GameRulesPanel-ItemTitle">{section.title}</h3>
                      <button
                        type="button"
                        className="Pusula-GameRulesPanel-ItemToggle"
                        aria-expanded={isOpen}
                        aria-label={
                          isOpen
                            ? t('pusula.rules.collapse', { defaultValue: 'Collapse section' })
                            : t('pusula.rules.expand', { defaultValue: 'Expand section' })
                        }
                        onClick={() => toggleSection(section.id)}
                        onKeyDown={(event) => onToggleKey(event, section.id)}
                      >
                        <img
                          className={clsx(
                            'Pusula-GameRulesPanel-ItemToggleIcon',
                            isOpen && 'Pusula-GameRulesPanel-ItemToggleIcon_up',
                          )}
                          src={pusulaBurgerMenuIcon(PUSULA_BURGER_MENU_ICONS.chevronRight)}
                          alt=""
                          width={32}
                          height={32}
                          draggable={false}
                        />
                      </button>
                    </div>
                    {isOpen && (
                      <div className="Pusula-GameRulesPanel-ItemBody">
                        <p className="Pusula-GameRulesPanel-ItemText">{section.body}</p>
                      </div>
                    )}
                  </section>
                );
              })}
            </div>
          </div>
        </div>
      </>
    );
  },
);
