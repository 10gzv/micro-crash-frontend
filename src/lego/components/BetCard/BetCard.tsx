import { FC, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

import { chatConnection } from '@/connection';

import { Avatar } from '../Avatar';
import { Odd } from '../Odd';
import { SvgUse, Tooltip, TooltipContent, TooltipTrigger } from '../UI';

import { IBetCardProps } from './BetCard.types';
import { fairnessStore, getExchangeAmount, useTranslation } from '@10gzv/crash-core';

export const BetCard: FC<IBetCardProps> = ({
  withActions,
  amount,
  cashout_amount,
  cashout_odd,
  currency,
  nickname,
  round_id,
  id,
  tag,
}) => {
  const { t } = useTranslation();
  const TagName = tag || 'div';

  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const isDesktop = useMediaQuery({ query: '(min-width: 1025px)' });

  const onFairnessClick = () => {
    fairnessStore.sendGetRoundFairness(round_id);
  };

  const onShareClick = () => {
    chatConnection.shareBet(id, round_id);
    setIsTooltipOpen(true);
    setTimeout(() => {
      setIsTooltipOpen(false);
    }, 2000);
  };

  return (
    <Tooltip placement={isDesktop ? 'right' : 'top'} open={isTooltipOpen}>
      <TooltipTrigger asChild>
        <TagName className='Lego-BetCard'>
          <div className='Lego-BetCard-User'>
            <Avatar />
            <div className='Lego-BetCard-User-Name'>{nickname}</div>
          </div>
          <div className='Lego-BetCard-Info'>
            <div className='Lego-BetCard-Info-Item bet'>
              <div className='Lego-BetCard-Info-Item-Label'>
                {t('shared.bet', { defaultValue: 'Bet' })}:
              </div>
              <div className='Lego-BetCard-Info-Item-Value'>
                {getExchangeAmount(amount, currency)}
              </div>
            </div>
            <div className='Lego-BetCard-Info-Item win'>
              <div className='Lego-BetCard-Info-Item-Label'>
                {t('betCard.winning', { defaultValue: 'Winning' })}:
              </div>
              <div className='Lego-BetCard-Info-Item-Value'>
                {cashout_amount
                  ? getExchangeAmount(cashout_amount, currency)
                  : '-'}
              </div>
            </div>
            <div className='Lego-BetCard-Info-Item Odd'>
              <div className='Lego-BetCard-Info-Item-Label'>
                {t('betCard.odd', { defaultValue: 'Odd' })}:
              </div>
              <div className='Lego-BetCard-Info-Item-Value'>
                {cashout_odd && (
                  <Odd crashValue={cashout_odd} roundId={round_id} />
                )}
              </div>
            </div>
          </div>
          {withActions && (
            <div className='Lego-BetCard-Actions'>
              <SvgUse
                id='provable'
                className='Lego-Svg-Provable'
                onClick={onFairnessClick}
              />
              <SvgUse
                id='share'
                className='Lego-Svg-Share'
                onClick={onShareClick}
              />
            </div>
          )}
        </TagName>
      </TooltipTrigger>
      <TooltipContent>
        {t('notification.shared', { defaultValue: 'Shared' })}!
      </TooltipContent>
    </Tooltip>
  );
};
