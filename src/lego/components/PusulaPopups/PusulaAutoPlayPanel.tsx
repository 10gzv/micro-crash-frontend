import { ChangeEvent, FC, useEffect, useState } from 'react';
import clsx from 'clsx';
import Decimal from 'decimal.js';
import toast from 'react-hot-toast';
import { observer } from 'mobx-react-lite';
import {
  AutoPlayAction,
  betStore,
  IAutoPlay,
  userConfigsStore,
  userDataStore,
  useTranslation,
} from '@10gzv/crash-core';

import { checkIsValidAmount, getDisplayPrecision } from '@/lego/helpers';
import { useBodyScrollLock } from '@lego/hooks/useBodyScrollLock';
import {
  GAME_ASSET_PATHS,
  gameAsset,
  PUSULA_BURGER_MENU_ICONS,
  pusulaBurgerMenuIcon,
} from '@lego/constants/gameAssets';

const ROUND_NUMBERS = [10, 20, 50, 100];

const STOP_ACTIONS: {
  id: AutoPlayAction;
  text: string;
  defaultText: string;
}[] = [
  {
    id: 'cashDecrease',
    text: 'autoplayPopup.stopDecrease',
    defaultText: 'Stop if cash decreases by',
  },
  {
    id: 'cashIncrease',
    text: 'autoplayPopup.stopIncrease',
    defaultText: 'Stop if cash increases by',
  },
  {
    id: 'singleWin',
    text: 'autoplayPopup.stopSingleWin',
    defaultText: 'Stop if single win exceeds',
  },
];

const getDefaultStopActions = () => ({
  cashDecrease: {
    active: false,
    value: new Decimal(0).toFixed(getDisplayPrecision()),
  },
  cashIncrease: {
    active: false,
    value: new Decimal(0).toFixed(getDisplayPrecision()),
  },
  singleWin: {
    active: false,
    value: new Decimal(0).toFixed(getDisplayPrecision()),
  },
});

export type PusulaAutoPlayPanelProps = {
  opened: boolean;
  betPanelIndex: number;
  onClose: () => void;
};

export const PusulaAutoPlayPanel: FC<PusulaAutoPlayPanelProps> = observer(
  ({ opened, betPanelIndex, onClose }) => {
    const { t } = useTranslation();
    useBodyScrollLock(opened);

    const { currency, userBalance } = userDataStore;
    const { denomination } = userConfigsStore;
    const [activeRoundNumber, setActiveRoundNumber] = useState<number | null>(
      null,
    );
    const [stopActions, setStopActions] = useState(getDefaultStopActions);

    useEffect(() => {
      if (!opened) return;
      setStopActions(getDefaultStopActions());
      setActiveRoundNumber(null);
    }, [opened, betPanelIndex]);

    const onSwitcherToggle = (id: AutoPlayAction) => {
      setStopActions(prev => ({
        ...prev,
        [id]: {
          value: new Decimal(0).toFixed(getDisplayPrecision()),
          active: !prev[id].active,
        },
      }));
    };

    const onInputChange = (
      event: ChangeEvent<HTMLInputElement>,
      id: AutoPlayAction,
    ) => {
      const { value } = event.target;
      if (!checkIsValidAmount(value, getDisplayPrecision())) return;
      setStopActions(prev => ({
        ...prev,
        [id]: { ...prev[id], value },
      }));
    };

    const onInputBlur = (id: AutoPlayAction) => {
      setStopActions(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          value: new Decimal(prev[id].value || 0).toFixed(getDisplayPrecision()),
        },
      }));
    };

    const onPlusClick = (id: AutoPlayAction) => {
      setStopActions(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          value: new Decimal(prev[id].value)
            .plus(denomination)
            .toFixed(getDisplayPrecision()),
        },
      }));
    };

    const onMinusClick = (id: AutoPlayAction) => {
      setStopActions(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          value: Decimal.max(new Decimal(prev[id].value).minus(denomination), 0)
            .toFixed(getDisplayPrecision()),
        },
      }));
    };

    const onReset = () => {
      setStopActions(getDefaultStopActions());
      setActiveRoundNumber(null);
    };

    const onStartClick = () => {
      if (!activeRoundNumber) {
        toast.error(
          t('notification.setNumberOfRounds', {
            defaultValue: 'Please, set number of rounds',
          }),
        );
        return;
      }

      const data: IAutoPlay = {
        count: activeRoundNumber,
        stopActions: {
          cashDecrease: null,
          cashIncrease: null,
          singleWin: null,
        },
      };

      if (stopActions.cashDecrease.active) {
        if (!Number(stopActions.cashDecrease.value)) {
          toast.error(
            t('notification.cantSetZero', {
              defaultValue: "Can't set 0.00 as stop point",
            }),
          );
          return;
        }

        data.stopActions.cashDecrease =
          +(userBalance || 0) - Number(stopActions.cashDecrease.value);
      }

      if (stopActions.cashIncrease.active) {
        if (!Number(stopActions.cashIncrease.value)) {
          toast.error(
            t('notification.cantSetZero', {
              defaultValue: "Can't set 0.00 as stop point",
            }),
          );
          return;
        }

        data.stopActions.cashIncrease = Math.max(
          +(userBalance || 0) + Number(stopActions.cashIncrease.value),
          0,
        );
      }

      if (stopActions.singleWin.active) {
        if (!Number(stopActions.singleWin.value)) {
          toast.error(
            t('notification.cantSetZero', {
              defaultValue: "Can't set 0.00 as stop point",
            }),
          );
          return;
        }

        data.stopActions.singleWin = Number(stopActions.singleWin.value);
      }

      betStore.setAutoPlay(betPanelIndex, data);
      onClose();
    };

    return (
      <>
        {opened && (
          <button
            type='button'
            className='Pusula-AutoPlayPanel-Backdrop'
            aria-label={t('pusula.settings.close', { defaultValue: 'Close' })}
            onClick={onClose}
          />
        )}
        <div
          className={clsx(
            'Pusula-AutoPlayPanel',
            opened && 'Pusula-AutoPlayPanel_open',
          )}
          role='dialog'
          aria-modal='true'
          aria-hidden={!opened}
          aria-label={t('autoplayPopup.title', { defaultValue: 'Auto play' })}
        >
          <header className='Pusula-AutoPlayPanel-Header'>
            <h3 className='Pusula-AutoPlayPanel-Title'>
              {t('autoplayPopup.title', { defaultValue: 'Auto play' })}
            </h3>
            <button
              type='button'
              className='Pusula-AutoPlayPanel-Close'
              onClick={onClose}
              aria-label={t('pusula.settings.close', { defaultValue: 'Close' })}
            >
              <img
                src={pusulaBurgerMenuIcon(PUSULA_BURGER_MENU_ICONS.close)}
                alt=''
                width={14}
                height={14}
                draggable={false}
              />
            </button>
          </header>

          <div className='Pusula-AutoPlayPanel-Body'>
            <div className='Pusula-AutoPlayPanel-Section Pusula-AutoPlayPanel-Section_rounds'>
              <div className='Pusula-AutoPlayPanel-RoundsTitle'>
                {t('autoplayPopup.numberOfRounds', {
                  defaultValue: 'Number of Rounds',
                })}
                :
              </div>
              <div className='Pusula-AutoPlayPanel-Rounds'>
                {ROUND_NUMBERS.map(number => (
                  <button
                    key={number}
                    type='button'
                    className={clsx('Pusula-AutoPlayPanel-RoundButton', {
                      'Pusula-AutoPlayPanel-RoundButton_active':
                        number === activeRoundNumber,
                    })}
                    onClick={() => setActiveRoundNumber(number)}
                  >
                    {number}
                  </button>
                ))}
              </div>
            </div>

            {STOP_ACTIONS.map(({ id, text, defaultText }) => {
              const action = stopActions[id];
              return (
                <div className='Pusula-AutoPlayPanel-Section' key={id}>
                  <button
                    type='button'
                    className={clsx('Pusula-AutoPlayPanel-Switch', {
                      'Pusula-AutoPlayPanel-Switch_on': action.active,
                    })}
                    aria-pressed={action.active}
                    onClick={() => onSwitcherToggle(id)}
                  >
                    <span className='Pusula-AutoPlayPanel-SwitchKnob' />
                  </button>
                  <span
                    className={clsx('Pusula-AutoPlayPanel-SectionTitle', {
                      'Pusula-AutoPlayPanel-SectionTitle_disabled':
                        !action.active,
                    })}
                  >
                    {t(text, { defaultValue: defaultText })}
                  </span>
                  <div className='Pusula-AutoPlayPanel-Amount'>
                    <button
                      type='button'
                      className='Pusula-AutoPlayPanel-Step'
                      disabled={!action.active}
                      onClick={() => onMinusClick(id)}
                      aria-label={t('betPanel.decreaseBet', {
                        defaultValue: 'Decrease',
                      })}
                    >
                      <img
                        src={gameAsset(GAME_ASSET_PATHS.icons.betPanel.minus)}
                        alt=''
                        width={20}
                        height={20}
                        draggable={false}
                      />
                    </button>
                    <input
                      className='Pusula-AutoPlayPanel-AmountValue'
                      type='tel'
                      inputMode='decimal'
                      disabled={!action.active}
                      value={action.value}
                      onChange={event => onInputChange(event, id)}
                      onBlur={() => onInputBlur(id)}
                    />
                    <button
                      type='button'
                      className='Pusula-AutoPlayPanel-Step'
                      disabled={!action.active}
                      onClick={() => onPlusClick(id)}
                      aria-label={t('betPanel.increaseBet', {
                        defaultValue: 'Increase',
                      })}
                    >
                      <img
                        src={gameAsset(GAME_ASSET_PATHS.icons.betPanel.plus)}
                        alt=''
                        width={20}
                        height={20}
                        draggable={false}
                      />
                    </button>
                  </div>
                  <span
                    className={clsx('Pusula-AutoPlayPanel-Currency', {
                      'Pusula-AutoPlayPanel-Currency_disabled': !action.active,
                    })}
                  >
                    {currency}
                  </span>
                </div>
              );
            })}
          </div>

          <div className='Pusula-AutoPlayPanel-Footer'>
            <button
              type='button'
              className='Pusula-AutoPlayPanel-Reset'
              onClick={onReset}
            >
              {t('autoplayPopup.reset', { defaultValue: 'Reset' })}
            </button>
            <button
              type='button'
              className='Pusula-AutoPlayPanel-Start'
              onClick={onStartClick}
            >
              {t('autoplayPopup.start', { defaultValue: 'Start' })}
            </button>
          </div>
        </div>
      </>
    );
  },
);
