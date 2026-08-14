
import { FC, useEffect } from 'react';
import hexEncoder from 'crypto-js/enc-hex';
import sha512 from 'crypto-js/sha512';
import { observer } from 'mobx-react-lite';
import CopyToClipboard from 'react-copy-to-clipboard';
import clsx from 'clsx';

import { showPusulaCopyNotice } from '@lego/helpers/showPusulaCopyNotice';
import { useBodyScrollLock } from '@lego/hooks/useBodyScrollLock';
import {
  gameAsset,
  GAME_ASSET_PATHS,
  PUSULA_BURGER_MENU_ICONS,
  pusulaBurgerMenuIcon,
} from '@lego/constants/gameAssets';
import { pusulaPopupStore } from '@lego/stores/pusulaPopupStore';

import { IFairnessCheckingProps } from './FairnessChecking.types';
import { fairnessStore, useTranslation } from '@10gzv/crash-core';

const MAX_DECIMAL = 2 ** 52;

export const FairnessChecking: FC<IFairnessCheckingProps> = observer(({ onClose }) => {
  const { t } = useTranslation();
  const { roundFairnessResult } = fairnessStore;

  useBodyScrollLock(true);

  const combinedSha512 = sha512(
    (roundFairnessResult?.server_seed ?? '') +
      (roundFairnessResult?.seeds?.reduce(
        (acc, item) => acc + (item?.seed ?? ''),
        '',
      ) ?? ''),
  ).toString(hexEncoder);

  const hex = combinedSha512.slice(0, 13);
  const decimal = parseInt(hex, 16);
  const edgedNumber = (100 - 4) / (1 - decimal / MAX_DECIMAL);
  const crashValue = Math.max(1, Math.floor(edgedNumber) / 100).toFixed(2);

  useEffect(() => {
    return () => {
      fairnessStore.setRoundFairnessResult(null);
    };
  }, []);

  const onCopy = () => {
    showPusulaCopyNotice();
  };

  const onOpenProvablyFair = () => {
    onClose();
    pusulaPopupStore.openProvablyFair();
  };

  const FixedCopyToClipboard =
    CopyToClipboard as unknown as React.ComponentType<{
      text: string;
      onCopy: () => void;
      children: React.ReactNode;
    }>;

  const copyIconUrl = gameAsset(GAME_ASSET_PATHS.icons.fairness.copy);

  const copyButton = (text: string) => (
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

  const serverSeed = roundFairnessResult?.server_seed || '';

  return (
    <>
      <button
        type="button"
        className="Pusula-FairnessCheckPanel-Backdrop"
        aria-label={t('pusula.settings.close', { defaultValue: 'Close' })}
        onClick={onClose}
      />
      <div
        className={clsx('Pusula-FairnessCheckPanel', 'Pusula-FairnessCheckPanel_open')}
        role="dialog"
        aria-modal="true"
        aria-label={t('pusula.fairnessCheck.title', { defaultValue: 'Fairness Check' })}
      >
        <header className="Pusula-FairnessCheckPanel-Header">
          <div className="Pusula-FairnessCheckPanel-Title">
            <img
              src={pusulaBurgerMenuIcon(PUSULA_BURGER_MENU_ICONS.shieldFair)}
              alt=""
              width={24}
              height={24}
              draggable={false}
            />
            <span>
              {t('pusula.fairnessCheck.title', { defaultValue: 'Fairness Check' })}
            </span>
          </div>
          <button
            type="button"
            className="Pusula-FairnessCheckPanel-Close"
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

        <div className="Pusula-FairnessCheckPanel-Body">
          <p className="Pusula-FairnessCheckPanel-SectionLabel">
            {t('fairnessCheckPopup.serverSeed', { defaultValue: 'Server seed' })}{' '}
            <span className="Pusula-FairnessCheckPanel-SectionLabel_muted">
              {t('pusula.fairnessCheck.serverSeedHint', {
                defaultValue: '(generated on our side)',
              })}
            </span>
          </p>
          <div className="Pusula-FairnessCheckPanel-SeedRow">
            <span className="Pusula-FairnessCheckPanel-SeedValue">{serverSeed}</span>
            {!!serverSeed && copyButton(serverSeed)}
          </div>

          <p className="Pusula-FairnessCheckPanel-SectionLabel">
            {t('fairnessCheckPopup.clientSeed', { defaultValue: 'Client seed' })}{' '}
            <span className="Pusula-FairnessCheckPanel-SectionLabel_muted">
              {t('pusula.fairnessCheck.clientSeedHint', {
                defaultValue: '(generated on players side)',
              })}
            </span>
          </p>
          {Array.from({ length: 3 }).map((_, i) => {
            const gamerIndex = i + 1;
            const currentSeed = roundFairnessResult?.seeds?.[i];
            const seedText = currentSeed?.seed || '';
            const noSeedLabel = t('fairnessCheckPopup.noSeed', { defaultValue: 'No seed' });

            return (
              <div
                key={`fairness_gamer_${gamerIndex}`}
                className="Pusula-FairnessCheckPanel-GamerRow"
              >
                <span className="Pusula-FairnessCheckPanel-GamerIndex">{gamerIndex}</span>
                <span className="Pusula-FairnessCheckPanel-GamerName">
                  {t('fairnessCheckPopup.gamer', { defaultValue: 'Gamer' })}
                </span>
                {seedText ? (
                  <>
                    <span className="Pusula-FairnessCheckPanel-GamerSeed">{seedText}</span>
                    {copyButton(seedText)}
                  </>
                ) : (
                  <span className="Pusula-FairnessCheckPanel-NoSeed">{noSeedLabel}</span>
                )}
              </div>
            );
          })}

          <p className="Pusula-FairnessCheckPanel-SectionLabel">
            {t('fairnessCheckPopup.combinedSha', {
              defaultValue: 'Combined SHA512 Hash',
            })}{' '}
            <span className="Pusula-FairnessCheckPanel-SectionLabel_muted">
              {t('pusula.fairnessCheck.combinedHashHint', {
                defaultValue: '(your game result)',
              })}
            </span>
          </p>
          <div className="Pusula-FairnessCheckPanel-SeedRow">
            <span className="Pusula-FairnessCheckPanel-SeedValue">{combinedSha512}</span>
            {!!combinedSha512 && copyButton(combinedSha512)}
          </div>

          <div className="Pusula-FairnessCheckPanel-KvRow">
            <span className="Pusula-FairnessCheckPanel-KvLabel">
              {t('htpPopup.fairnessTab.hex', { defaultValue: 'Hex' })}
            </span>
            <span className="Pusula-FairnessCheckPanel-KvValue">{hex}</span>
          </div>
          <div className="Pusula-FairnessCheckPanel-KvRow">
            <span className="Pusula-FairnessCheckPanel-KvLabel">
              {t('htpPopup.fairnessTab.decimal', { defaultValue: 'Decimal' })}
            </span>
            <span className="Pusula-FairnessCheckPanel-KvValue">{decimal.toString()}</span>
          </div>
          <div className="Pusula-FairnessCheckPanel-KvRow">
            <span className="Pusula-FairnessCheckPanel-KvLabel">
              {t('htpPopup.fairnessTab.result', { defaultValue: 'Result' })}
            </span>
            <span className="Pusula-FairnessCheckPanel-KvValue Pusula-FairnessCheckPanel-KvValue_result">
              x{crashValue}
            </span>
          </div>

          <footer className="Pusula-FairnessCheckPanel-Footer">
            <p className="Pusula-FairnessCheckPanel-FooterText">
              {t('pusula.fairnessCheck.instructionsCheck', {
                defaultValue: 'For instruction check',
              })}{' '}
              <button
                type="button"
                className="Pusula-FairnessCheckPanel-FooterLink"
                onClick={onOpenProvablyFair}
              >
                {t('pusula.settings.provablyFair', { defaultValue: 'Provably fair' })}
              </button>
            </p>
          </footer>
        </div>
      </div>
    </>
  );
});
