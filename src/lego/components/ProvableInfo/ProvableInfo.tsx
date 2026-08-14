

import { FC } from 'react';

import { Popup, SvgUse } from '../UI';

import { IProvableInfoProps } from './ProvableInfo.types';
import { Trans, useTranslation } from '@10gzv/crash-core';
import { resolvedTheme } from '@lego/helpers/applyTheme';

export const ProvableInfo: FC<IProvableInfoProps> = ({ onClose }) => {
  const { t } = useTranslation();

  const popupTitle = (
    <div className="Lego-ProvableInfo-Title">
      {t('fairnessPopup.whatIs', { defaultValue: 'What is' })}
      <span className="Lego-ProvableInfo-ProvableText">
        <SvgUse id="provable" className="Lego-ProvableInfo-ProvableIcon" />
        {t('fairnessPopup.provableFairness', {
          defaultValue: 'Provable Fairness?',
        })}
      </span>
    </div>
  );

  const popupFooter = (
    <div className="popup-validity__footer">
      <div className="popup-validity__footer-top">
        {t('fairnessPopup.hashCheck', {
          defaultValue:
            'Correctness of Hash can be checked in any online calculator, for example',
        })}
      </div>
      <div
        className="popup-validity__footer-bottom"
        style={{ cursor: 'pointer' }}
      >
        <a
          href="https://www.miniwebtool.com/sha512-hash-generator"
          target="_blank"
          rel="noreferrer"
        >
          www.miniwebtool.com/sha512-hash-generator
        </a>
      </div>
    </div>
  );

  return (
    <Popup onClose={onClose} title={popupTitle} footer={popupFooter}>
      <div className="popup-validity__body">
        <div className="popup-validity__body-top">
          <p className="popup-validity__body-text">
            <Trans i18nKey='fairnessPopup.startParagraph'>
              <b>Pusulabet Crash </b> is based on cryptographic technology called
              “Provable Fairness”. This technology guarantees 100% fairness of
              game result. With this technology, it’s impossible for any third
              party to interfere in game process.
            </Trans>
          </p>

          <h4 className="popup-validity__body-title">
            {t('fairnessPopup.howItWorks', {
              defaultValue: 'How it works?',
            })}
          </h4>
          <p className="popup-validity__body-text">
            {t('fairnessPopup.howItWorksParagraph', {
              defaultValue:
                'Result of each round (Game’s “Fly away” coefficient ) is not generated on our servers. It’s generated with help of round players and is fully transparent. This way, it’s impossible for anyone to manipulate game output. Also, anyone can check and confirm game fairness',
            })}
          </p>
          <h4 className='popup-validity__body-title'>
            {t('fairnessPopup.moreInfo', {
              defaultValue: 'More info',
            })}
          </h4>
          <p className="popup-validity__body-text">
            {t('fairnessPopup.moreInfoParagraph', {
              defaultValue:
              'Round result is generated from four independent participants of the round: game operator and first 3 betters of the round. Operator is generating server seed (random 16 symbols). Hashed version of this server seed is available publicly before round starts'
            })}
          </p>
          <p className="popup-validity__body-text">
            {t('fairnessPopup.roundStartParagraph', {
              defaultValue:
                'When round starts, game merges server seed with three client seeds. From merged symbols is generated SHA512 hash, and from this hash - game result.',
            })}
          </p>
        </div>
        <div className="popup-validity__body-center">
          <img
            src={resolvedTheme.groupImage}
            alt="Validity"
            className="popup-validity__body-img"
          />
        </div>
        <div className="popup-validity__check">
          <h4 className='popup-validity__body-title'>
          {t('fairnessPopup.howToCheck', {
              defaultValue: 'How to check?',
            })}
          </h4>
          <div className="popup-validity__check-top">
            <div className="popup-validity__check-left">
              {}
            </div>
            <div className="popup-validity__check-right">
              <p className="popup-validity__body-text">
                {t('fairnessPopup.howToCheckParagraph', {
                  defaultValue:
                    'You can check fairness of each round from game history, by clicking on green icon.',
                })}
              </p>
              <p className="popup-validity__body-text">
                {t('fairnessPopup.howToCheckParagraph2', {
                  defaultValue:
                    'In opened window, you will see server seed, 3 pair of players seeds, combined hash and round result.',
                })}
              </p>
            </div>
          </div>
          <div className="popup-validity__check-top">
            <div className="popup-validity__check-right">
              <div className="popup-validity__body-text">
                {t('fairnessPopup.howToCheckParagraph3', {
                  defaultValue:
                    'Hashed version of next rounds server seed is available publicly in settings window (In user menu, check “Provably Fair Settings” and then “Next server seed SHA256”).',
                })}
                <p className="popup-validity__body-text">
                  {t('fairnessPopup.howToCheckParagraph4', {
                    defaultValue:
                      'If you want to participate in round result generation, make sure you are between first 3 players who make bet in that round.',
                  })}
                </p>
              </div>
            </div>
            <div className="popup-validity__check-left">
              {}
            </div>
          </div>
        </div>
      </div>
    </Popup>
  );
};
