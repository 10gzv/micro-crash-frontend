import { observer } from 'mobx-react-lite';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Decimal from 'decimal.js';
import clsx from 'clsx';

import { checkIsValidAmount, checkIsValidOdd, getDisplayPrecision } from '@/lego/helpers';
import { AutoBetDefaultCounts } from '@/lego/enums';
import {
  BetButton,
  betStore,
  freeBetStore,
  MIN_AUTO_CASHOUT_ODD,
  servicesStore,
  useTranslation,
  userConfigsStore,
  validateAutoCashoutOdd,
} from '@10gzv/crash-core';

import { IBetPanelProps } from './BetPanel.types';
import { gameAsset, GAME_ASSET_PATHS } from '@lego/constants/gameAssets';

const BET_AMOUNT_MINUS_ICON = gameAsset(GAME_ASSET_PATHS.icons.betPanel.minus);
const BET_AMOUNT_PLUS_ICON = gameAsset(GAME_ASSET_PATHS.icons.betPanel.plus);

export const PusulabetBetPanel: FC<IBetPanelProps> = observer(
  ({ betPanelIndex }) => {
    const { t } = useTranslation();
    const {
      betPanels,
      setAmount: setAmountAction,
      setIsAutoCashoutChecked: setIsAutoCashoutCheckedAction,
      setAutoCashoutOdd: setAutoCashoutOddAction,
      setAutoBetCount,
    } = betStore;

    const {
      autoBetCount,
      betForNextData,
      betId,
      amount,
      isAutoCashoutChecked,
      autoCashoutOdd,
    } = betPanels[betPanelIndex];

    const anotherBetPanelIndex = betPanelIndex ? 0 : 1;
    const isAnotherBetPanelPlaceBetForNext =
      !!betPanels[anotherBetPanelIndex].betForNextData;

    const { defaultBetAmount, minBet, maxBet, denomination, minAutoCashoutOdd } =
      userConfigsStore;
    const { activeFreeBet } = freeBetStore;

    const isFreebetActive = !!activeFreeBet;
    const totalFreebetCount = activeFreeBet?.total_freebet_count || 0;
    const playedFreebetCount = activeFreeBet?.played_freebet_count || 0;

    const isFreebetActiveButNotRemaining =
      !betId &&
      isFreebetActive &&
      (totalFreebetCount === playedFreebetCount ||
        (totalFreebetCount - 1 === playedFreebetCount &&
          isAnotherBetPanelPlaceBetForNext));

    const isDisabled =
      Boolean(betId) ||
      Boolean(betForNextData) ||
      Boolean(autoBetCount) ||
      isFreebetActiveButNotRemaining;

    const isDisabledForFreeBet = !!activeFreeBet;
    const controlsDisabled = isDisabled || isDisabledForFreeBet;

    const setAmount = useCallback(
      (value: number) => setAmountAction(betPanelIndex, value),
      [setAmountAction, betPanelIndex],
    );

    const onAmountChange = (value: number) => {
      let amountValue = new Decimal(value)
        .toDecimalPlaces(getDisplayPrecision())
        .toNumber();
      if (
        !amountValue ||
        amountValue < minBet ||
        (activeFreeBet && amountValue < +activeFreeBet.bet_amount)
      ) {
        amountValue = activeFreeBet ? +activeFreeBet.bet_amount : minBet;
      } else if (amountValue > maxBet) {
        amountValue = maxBet;
      }
      setAmount(amountValue);
      servicesStore.postMessageService.emitStakeUpdate(+amountValue);
    };

    const [localAmount, setLocalAmount] = useState(
      new Decimal(amount).toFixed(getDisplayPrecision()),
    );
    const [isFocused, setIsFocused] = useState(false);
    const [speed, setSpeed] = useState(400);
    const [pressedButton, setPressedButton] = useState<'minus' | 'plus' | null>(
      null,
    );
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const [localOdd, setLocalOdd] = useState(
      new Decimal(autoCashoutOdd).toFixed(2),
    );
    const [oddFocused, setOddFocused] = useState(false);

    useEffect(() => {
      setLocalAmount(new Decimal(amount).toFixed(getDisplayPrecision()));
    }, [amount, isFocused]);

    useEffect(() => {
      setLocalOdd(new Decimal(autoCashoutOdd).toFixed(2));
    }, [autoCashoutOdd, oddFocused]);

    useEffect(() => {
      if (activeFreeBet?.bet_amount) {
        setAmount(+activeFreeBet.bet_amount);
      } else {
        setAmount(defaultBetAmount);
      }
    }, [defaultBetAmount, activeFreeBet]);

    useEffect(() => {
      setAutoCashoutOddAction(
        betPanelIndex,
        Math.max(minAutoCashoutOdd, MIN_AUTO_CASHOUT_ODD),
      );
    }, [minAutoCashoutOdd, betPanelIndex, setAutoCashoutOddAction]);

    useEffect(() => {
      if (!pressedButton) return undefined;
      timeoutRef.current = setTimeout(() => {
        if (pressedButton === 'minus') {
          onAmountChange(new Decimal(amount).minus(denomination).toNumber());
        } else {
          onAmountChange(new Decimal(amount).plus(denomination).toNumber());
        }
        setSpeed(speed < 25 ? 25 : speed / 1.5);
      }, speed);
      return () => clearTimeout(timeoutRef.current as NodeJS.Timeout);
    }, [pressedButton, amount, speed]);

    const onButtonLeave = () => {
      clearTimeout(timeoutRef.current as NodeJS.Timeout);
      setPressedButton(null);
      setSpeed(400);
    };

    const isAutoplayOn = autoBetCount > 0;

    const onAutoplayToggle = () => {
      if (controlsDisabled && !isAutoplayOn) return;
      if (isAutoplayOn) {
        setAutoBetCount(betPanelIndex, 0, true);
      } else {
        setAutoBetCount(betPanelIndex, AutoBetDefaultCounts[0], true);
      }
    };

    const onAutoCashoutToggle = () => {
      if (isDisabled) return;
      setIsAutoCashoutCheckedAction(betPanelIndex, !isAutoCashoutChecked);
    };

    const onOddBlur = () => {
      setOddFocused(false);
      const fixed = new Decimal(localOdd || 0).toDecimalPlaces(2).toNumber();
      const corrected = validateAutoCashoutOdd(
        fixed,
        minAutoCashoutOdd,
        activeFreeBet?.withdraw_min_coefficient,
      );
      setAutoCashoutOddAction(betPanelIndex, corrected);
    };

    const amountLabel = useMemo(
      () => new Decimal(amount).toFixed(getDisplayPrecision()),
      [amount],
    );

    return (
      <div className='Pusula-BetPanel'>
        <div className='Pusula-BetPanel-Col Pusula-BetPanel-Col_left'>
          <div className='Pusula-BetPanel-ToggleRow'>
            <button
              type='button'
              className={clsx('Pusula-BetPanel-Toggle', {
                'Pusula-BetPanel-Toggle_on': isAutoplayOn,
              })}
              disabled={controlsDisabled && !isAutoplayOn}
              onClick={onAutoplayToggle}
            >
              <span className='Pusula-BetPanel-Switch' aria-hidden>
                <span className='Pusula-BetPanel-SwitchKnob' />
              </span>
              <span className='Pusula-BetPanel-ToggleLabel'>
                {t('betPanel.autoBet', { defaultValue: 'AUTOPLAY' })}
              </span>
            </button>
          </div>

          <div className='Pusula-BetPanel-Amount'>
            <button
              type='button'
              className='Pusula-BetPanel-Step'
              disabled={controlsDisabled}
              onClick={() =>
                onAmountChange(new Decimal(amount).minus(denomination).toNumber())
              }
              onMouseUp={onButtonLeave}
              onMouseLeave={onButtonLeave}
              onTouchEnd={onButtonLeave}
              onMouseDown={() => setPressedButton('minus')}
              onTouchStart={() => setPressedButton('minus')}
              aria-label={t('betPanel.decreaseBet', {
                defaultValue: 'Decrease bet',
              })}
            >
              <img
                className='Pusula-BetPanel-StepIcon'
                src={BET_AMOUNT_MINUS_ICON}
                alt=''
                width={24}
                height={24}
                draggable={false}
              />
            </button>
            <input
              className='Pusula-BetPanel-AmountValue'
              disabled={controlsDisabled}
              value={isFocused ? localAmount : amountLabel}
              type='tel'
              onChange={e => {
                if (!checkIsValidAmount(e.target.value, getDisplayPrecision()))
                  return;
                const valid = new Decimal(e.target.value || 0).greaterThan(maxBet)
                  ? String(maxBet)
                  : e.target.value;
                setLocalAmount(valid);
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                setIsFocused(false);
                onAmountChange(new Decimal(localAmount || 0).toNumber());
              }}
            />
            <button
              type='button'
              className='Pusula-BetPanel-Step'
              disabled={controlsDisabled}
              onClick={() =>
                onAmountChange(new Decimal(amount).plus(denomination).toNumber())
              }
              onMouseUp={onButtonLeave}
              onMouseLeave={onButtonLeave}
              onTouchEnd={onButtonLeave}
              onMouseDown={() => setPressedButton('plus')}
              onTouchStart={() => setPressedButton('plus')}
              aria-label={t('betPanel.increaseBet', {
                defaultValue: 'Increase bet',
              })}
            >
              <img
                className='Pusula-BetPanel-StepIcon'
                src={BET_AMOUNT_PLUS_ICON}
                alt=''
                width={24}
                height={24}
                draggable={false}
              />
            </button>
          </div>

          <div className='Pusula-BetPanel-Quick'>
            <button
              type='button'
              className='Pusula-BetPanel-QuickBtn'
              disabled={controlsDisabled || amount === minBet}
              onClick={() =>
                onAmountChange(new Decimal(amount).div(2).toNumber())
              }
            >
              1/2
            </button>
            <span className='Pusula-BetPanel-QuickDivider' aria-hidden />
            <button
              type='button'
              className='Pusula-BetPanel-QuickBtn'
              disabled={controlsDisabled || amount === maxBet}
              onClick={() =>
                onAmountChange(new Decimal(amount).times(2).toNumber())
              }
            >
              X2
            </button>
          </div>
        </div>

        <div className='Pusula-BetPanel-Col Pusula-BetPanel-Col_right'>
          <div className='Pusula-BetPanel-CashoutRow'>
            <button
              type='button'
              className={clsx('Pusula-BetPanel-Toggle Pusula-BetPanel-Toggle_cashout', {
                'Pusula-BetPanel-Toggle_on': isAutoCashoutChecked,
              })}
              disabled={isDisabled}
              onClick={onAutoCashoutToggle}
            >
              <span className='Pusula-BetPanel-Switch' aria-hidden>
                <span className='Pusula-BetPanel-SwitchKnob' />
              </span>
              <span className='Pusula-BetPanel-ToggleLabel'>
                {t('betPanel.autoCashout', { defaultValue: 'AUTO CASHOUT' })}
              </span>
            </button>
            <div className='Pusula-BetPanel-OddWrap'>
              <span className='Pusula-BetPanel-OddPrefix'>X</span>
              <input
                className='Pusula-BetPanel-Odd'
                disabled={isDisabled || !isAutoCashoutChecked}
                value={oddFocused ? localOdd : new Decimal(autoCashoutOdd).toFixed(0)}
                type='tel'
                onChange={e => {
                  if (!checkIsValidOdd(e.target.value)) return;
                  setLocalOdd(e.target.value);
                }}
                onFocus={() => setOddFocused(true)}
                onBlur={onOddBlur}
              />
            </div>
          </div>

          <div className='Pusula-BetPanel-BetButton'>
            <BetButton betPanelIndex={betPanelIndex} />
          </div>
        </div>
      </div>
    );
  },
);
