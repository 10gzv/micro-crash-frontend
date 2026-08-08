import {
  FC,
  KeyboardEvent,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import { useTranslation } from '@10gzv/crash-core';
import { useBodyScrollLock } from '@lego/hooks/useBodyScrollLock';
import {
  PUSULA_BURGER_MENU_ICONS,
  pusulaBurgerMenuIcon,
} from '@lego/constants/gameAssets';

import { PusulaProvablyFairSettings } from './PusulaProvablyFairSettings';

export type PusulaProvablyFairPanelProps = {
  opened: boolean;
  onClose: () => void;
};

type FairnessSection = {
  id: string;
  title: string;
  body: ReactNode | string;
};

type PanelTab = 'general' | 'settings';

export const PusulaProvablyFairPanel: FC<PusulaProvablyFairPanelProps> = observer(
  ({ opened, onClose }) => {
    const { t } = useTranslation();
    useBodyScrollLock(opened);

    const [activeTab, setActiveTab] = useState<PanelTab>('general');

    const whatIsTitle = t('pusula.fairness.whatIsTitle', {
      defaultValue: 'What is provably fair?',
    });
    const whatIsBody = t('pusula.fairness.whatIsBody', {
      defaultValue:
        'Crash utilizes a cryptographic system known as Provably Fair to ensure 100% fairness in game outcomes. This system prevents any external interference in the game.',
    });

    const sections = useMemo((): FairnessSection[] => {
      return [
        {
          id: 'whatIs',
          title: whatIsTitle,
          body: whatIsBody,
        },
        {
          id: 'howItWorks',
          title: t('fairnessPopup.howItWorks', {
            defaultValue: 'How it works?',
          }),
          body: t('fairnessPopup.howItWorksParagraph', {
            defaultValue:
              'Result of each round (Game’s “Fly away” coefficient ) is not generated on our servers. It’s generated with help of round players and is fully transparent. This way, it’s impossible for anyone to manipulate game output. Also, anyone can check and confirm game fairness',
          }),
        },
        {
          id: 'moreDetails',
          title: t('pusula.fairness.moreDetails', { defaultValue: 'More details' }),
          body: (
            <>
              <p className="Pusula-ProvablyFairPanel-ItemText">
                {t('fairnessPopup.moreInfoParagraph', {
                  defaultValue:
                    'Round result is generated from four independent participants of the round: game operator and first 3 betters of the round. Operator is generating server seed (random 16 symbols). Hashed version of this server seed is available publicly before round starts',
                })}
              </p>
              <p className="Pusula-ProvablyFairPanel-ItemText">
                {t('fairnessPopup.roundStartParagraph', {
                  defaultValue:
                    'When round starts, game merges server seed with three client seeds. From merged symbols is generated SHA512 hash, and from this hash - game result.',
                })}
              </p>
            </>
          ),
        },
        {
          id: 'howToVerify',
          title: t('pusula.fairness.howToVerify', { defaultValue: 'How to verify?' }),
          body: (
            <>
              <p className="Pusula-ProvablyFairPanel-ItemText">
                {t('fairnessPopup.howToCheckParagraph', {
                  defaultValue:
                    'You can check fairness of each round from game history, by clicking on green icon.',
                })}
              </p>
              <p className="Pusula-ProvablyFairPanel-ItemText">
                {t('fairnessPopup.howToCheckParagraph2', {
                  defaultValue:
                    'In opened window, you will see server seed, 3 pair of players seeds, combined hash and round result.',
                })}
              </p>
              <p className="Pusula-ProvablyFairPanel-ItemText">
                {t('fairnessPopup.howToCheckParagraph3', {
                  defaultValue:
                    'Hashed version of next rounds server seed is available publicly in settings window (In user menu, check “Provably Fair Settings” and then “Next server seed SHA256”).',
                })}
              </p>
              <p className="Pusula-ProvablyFairPanel-ItemText">
                {t('fairnessPopup.howToCheckParagraph4', {
                  defaultValue:
                    'If you want to participate in round result generation, make sure you are between first 3 players who make bet in that round.',
                })}
              </p>
            </>
          ),
        },
      ];
    }, [t, whatIsTitle, whatIsBody]);

    const [openIds, setOpenIds] = useState<Set<string>>(() => new Set(['whatIs']));

    useEffect(() => {
      if (opened) {
        setOpenIds(new Set(['whatIs']));
        setActiveTab('general');
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
            className="Pusula-ProvablyFairPanel-Backdrop"
            aria-label={t('pusula.settings.close', { defaultValue: 'Close' })}
            onClick={onClose}
          />
        )}
        <div
          className={clsx(
            'Pusula-ProvablyFairPanel',
            opened && 'Pusula-ProvablyFairPanel_open',
          )}
          role="dialog"
          aria-modal="true"
          aria-label={t('pusula.settings.provablyFair', { defaultValue: 'Provably fair' })}
        >
          <header className="Pusula-ProvablyFairPanel-Header">
            <div className="Pusula-ProvablyFairPanel-Title">
              <img
                src={pusulaBurgerMenuIcon(PUSULA_BURGER_MENU_ICONS.shieldFair)}
                alt=""
                width={24}
                height={24}
                draggable={false}
              />
              <span>{t('pusula.settings.provablyFair', { defaultValue: 'Provably fair' })}</span>
            </div>
            <button
              type="button"
              className="Pusula-ProvablyFairPanel-Close"
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

          <div
            className="Pusula-ProvablyFairPanel-Tabs"
            role="tablist"
            aria-label={t('pusula.fairness.tabs', { defaultValue: 'Provably fair sections' })}
          >
            <span
              aria-hidden
              className={clsx(
                'Pusula-ProvablyFairPanel-TabIndicator',
                activeTab === 'settings' && 'Pusula-ProvablyFairPanel-TabIndicator_right',
              )}
            />
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'general'}
              className={clsx(
                'Pusula-ProvablyFairPanel-Tab',
                activeTab === 'general' && 'Pusula-ProvablyFairPanel-Tab_active',
              )}
              onClick={() => setActiveTab('general')}
            >
              {t('pusula.fairness.tabGeneral', { defaultValue: 'General' })}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'settings'}
              className={clsx(
                'Pusula-ProvablyFairPanel-Tab',
                activeTab === 'settings' && 'Pusula-ProvablyFairPanel-Tab_active',
              )}
              onClick={() => setActiveTab('settings')}
            >
              {t('pusula.fairness.tabSettings', { defaultValue: 'Settings' })}
            </button>
          </div>

          <div className="Pusula-ProvablyFairPanel-Body">
            <div
              key={activeTab}
              className="Pusula-ProvablyFairPanel-BodyPane"
              role="tabpanel"
            >
            {activeTab === 'general' ? (
              <>
                <div className="Pusula-ProvablyFairPanel-List">
                  {sections.map((section) => {
                    const isOpen = openIds.has(section.id);
                    return (
                      <section
                        key={section.id}
                        className={clsx(
                          'Pusula-ProvablyFairPanel-Item',
                          isOpen && 'Pusula-ProvablyFairPanel-Item_open',
                        )}
                      >
                        <div className="Pusula-ProvablyFairPanel-ItemHead">
                          <h3 className="Pusula-ProvablyFairPanel-ItemTitle">{section.title}</h3>
                          <button
                            type="button"
                            className="Pusula-ProvablyFairPanel-ItemToggle"
                            aria-expanded={isOpen}
                            onClick={() => toggleSection(section.id)}
                            onKeyDown={(event) => onToggleKey(event, section.id)}
                          >
                            <img
                              className={clsx(
                                'Pusula-ProvablyFairPanel-ItemToggleIcon',
                                isOpen && 'Pusula-ProvablyFairPanel-ItemToggleIcon_up',
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
                          <div className="Pusula-ProvablyFairPanel-ItemBody">
                            {typeof section.body === 'string' ? (
                              <p className="Pusula-ProvablyFairPanel-ItemText">{section.body}</p>
                            ) : (
                              section.body
                            )}
                          </div>
                        )}
                      </section>
                    );
                  })}
                </div>
                <footer className="Pusula-ProvablyFairPanel-Footer">
                  <p className="Pusula-ProvablyFairPanel-FooterText">
                    {t('fairnessPopup.hashCheck', {
                      defaultValue:
                        'Correctness of Hash can be checked in any online calculator, for example',
                    })}
                  </p>
                  <a
                    className="Pusula-ProvablyFairPanel-FooterLink"
                    href="https://www.miniwebtool.com/sha512-hash-generator"
                    target="_blank"
                    rel="noreferrer"
                  >
                    www.miniwebtool.com/sha512-hash-generator
                  </a>
                </footer>
              </>
            ) : (
              <PusulaProvablyFairSettings whatIsTitle={whatIsTitle} whatIsBody={whatIsBody} />
            )}
            </div>
          </div>
        </div>
      </>
    );
  },
);
