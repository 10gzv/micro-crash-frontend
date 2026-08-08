import { observer } from 'mobx-react-lite';
import { FC, useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

import { randomSeedGenerator } from '@/lego/helpers';
import { showPusulaCopyNotice } from '@lego/helpers/showPusulaCopyNotice';
import { gameAsset, GAME_ASSET_PATHS } from '@lego/constants/gameAssets';

import { Input } from '../UI';
import { betStore, gameStore, useTranslation } from '@10gzv/crash-core';

import { PusulaProvablyFairWhatIsAccordion } from './PusulaProvablyFairWhatIsAccordion';

const MIN_SEED_LENGTH = 5;
const MAX_SEED_LENGTH = 20;

export type PusulaProvablyFairSettingsProps = {
  whatIsTitle: string;
  whatIsBody: string;
};

export const PusulaProvablyFairSettings: FC<PusulaProvablyFairSettingsProps> = observer(
  ({ whatIsTitle, whatIsBody }) => {
  const { t } = useTranslation();

  const isGameActive = gameStore.isOddStarted && !gameStore.isRoundOver;

  const onCopy = () => {
    showPusulaCopyNotice();
  };

  const [localManualSeed, setLocalManualSeed] = useState(randomSeedGenerator());
  const [isFocused, setIsFocused] = useState(false);

  const onManualSeedChange = (value: string) => {
    if (
      !value ||
      value.length < MIN_SEED_LENGTH ||
      value.length > MAX_SEED_LENGTH
    ) {
      betStore.updateBetSeed({ seed: randomSeedGenerator() });
      return;
    }
    betStore.updateBetSeed({ seed: value });
  };

  const onManualSeedInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalManualSeed(event.target.value);
  };

  const onManualSeedInputBlur = () => {
    setIsFocused(false);
    if (isGameActive) return;
    onManualSeedChange(localManualSeed || randomSeedGenerator());
  };

  useEffect(() => {
    setLocalManualSeed(String(betStore.betSeed.seed));
  }, [betStore.betSeed.seed, isFocused]);

  const FixedCopyToClipboard =
    CopyToClipboard as unknown as React.ComponentType<{
      text: string;
      onCopy: () => void;
      children: React.ReactNode;
    }>;

  const copyIconUrl = gameAsset(GAME_ASSET_PATHS.icons.fairness.copy);

  const seedCopyButton = (text: string) => (
    <FixedCopyToClipboard onCopy={onCopy} text={text}>
      <button
        type="button"
        className="Pusula-ProvablyFairPanel-CopyBtn"
        aria-label={t('notification.dataCopied', {
          defaultValue: 'Data successfully copied!',
        })}
      >
        <img
          src={copyIconUrl}
          alt=""
          className="Pusula-ProvablyFairPanel-CopyBtnIcon"
          width={16}
          height={16}
          draggable={false}
        />
      </button>
    </FixedCopyToClipboard>
  );

  return (
    <div className="Pusula-ProvablyFairPanel-Settings">
      <PusulaProvablyFairWhatIsAccordion title={whatIsTitle} body={whatIsBody} />

      <div className="Pusula-ProvablyFairPanel-FieldGroup">
        <span className="Pusula-ProvablyFairPanel-FieldLabel">
          {t('pusula.fairness.newServerSeed', { defaultValue: 'New server seed' })}
        </span>
        <div className="Pusula-ProvablyFairPanel-SeedField">
          <Input value={gameStore.nextServerSeed} readOnly />
          {seedCopyButton(gameStore.nextServerSeed)}
        </div>
      </div>

      <div className="Pusula-ProvablyFairPanel-FieldGroup">
        <span className="Pusula-ProvablyFairPanel-FieldLabel">
          {t('htpPopup.fairnessTab.nextClientSeed', {
            defaultValue: 'Next client seed',
          })}
          {!betStore.betSeed.manual &&
            ` (${t('htpPopup.fairnessTab.random', {
              defaultValue: 'Random on every new game',
            })})`}
        </span>
        {!betStore.betSeed.manual ? (
          <div className="Pusula-ProvablyFairPanel-SeedField">
            <Input value={betStore.betSeed.seed} readOnly />
            {seedCopyButton(String(betStore.betSeed.seed))}
          </div>
        ) : (
          <div className="Pusula-ProvablyFairPanel-SeedField">
            <Input
              value={localManualSeed}
              disabled={isGameActive}
              isDisabled={isGameActive}
              onChange={onManualSeedInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={onManualSeedInputBlur}
            />
            {seedCopyButton(String(betStore.betSeed.seed))}
          </div>
        )}
      </div>

      {!betStore.betSeed.manual ? (
        <button
          type="button"
          className="Pusula-ProvablyFairPanel-ManualLink"
          disabled={isGameActive}
          onClick={() => {
            if (isGameActive) return;
            betStore.updateBetSeed({ manual: true });
          }}
        >
          {t('pusula.fairness.enterManually', {
            defaultValue: 'Enter manually',
          })}
        </button>
      ) : (
        <button
          type="button"
          className="Pusula-ProvablyFairPanel-ManualLink"
          disabled={isGameActive}
          onClick={() => {
            if (isGameActive) return;
            betStore.updateBetSeed({ manual: false });
          }}
        >
          {t('htpPopup.fairnessTab.random', {
            defaultValue: 'Random on every new game',
          })}
        </button>
      )}
    </div>
  );
},
);
