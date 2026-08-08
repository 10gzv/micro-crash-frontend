import { FC, KeyboardEvent, MouseEvent } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import {
  gameAsset,
  GAME_ASSET_PATHS,
  PUSULA_BURGER_MENU_ICONS,
  pusulaBurgerMenuIcon,
} from '@lego/constants/gameAssets';
import {
  HowToPlayActions,
  popupStore,
  soundStore,
  userDataStore,
  useTranslation,
} from '@10gzv/crash-core';

import { IBurgerMenuProps } from './BurgerMenu.types';
import { pusulaPopupStore } from '@lego/stores/pusulaPopupStore';
import { useBodyScrollLock } from '@lego/hooks/useBodyScrollLock';

type PusulaUserData = typeof userDataStore & {
  userName?: string;
  username?: string;
  userId?: number | string;
  id?: number | string;
};

export type PusulaBurgerMenuProps = IBurgerMenuProps & {
  opened: boolean;
  onHomeClick?: () => void;
};

const stopRowClick = (event: MouseEvent) => {
  event.stopPropagation();
};

export const PusulaBurgerMenu: FC<PusulaBurgerMenuProps> = observer(
  ({ opened, onClose, onHomeClick }) => {
    const { t } = useTranslation();
    useBodyScrollLock(opened);
    const { isMusicOn, isSoundOn, toggleMusic, toggleSound } = soundStore;
    const store = userDataStore as PusulaUserData;

    const displayName =
      store.userName ??
      store.username ??
      t('pusula.settings.defaultUser', { defaultValue: 'demo_user' });

    const rawId = store.userId ?? store.id;
    const displayId =
      rawId != null && String(rawId).length > 0
        ? String(rawId)
        : t('pusula.settings.noId', { defaultValue: '—' });

    const audioOn = isMusicOn && isSoundOn;

    const toggleAudio = () => {
      const next = !audioOn;
      if (isMusicOn !== next) toggleMusic();
      if (isSoundOn !== next) toggleSound();
    };

    const openPopup = (action: HowToPlayActions) => {
      if (action === 'game_limits') {
        pusulaPopupStore.openGameLimits();
        onClose();
        return;
      }
      if (action === 'game_rules') {
        pusulaPopupStore.openGameRules();
        onClose();
        return;
      }
      if (action === 'fairness_settings') {
        pusulaPopupStore.openProvablyFair();
        onClose();
        return;
      }
      popupStore.setHowToPlayIndex(popupStore.HOW_TO_PLAY_INDEXES[action]);
      popupStore.setHowToPlay(true);
      onClose();
    };

    const handleHome = () => {
      onHomeClick?.();
      onClose();
    };

    const onToggleKey = (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleAudio();
      }
    };

    return (
      <div
        className={clsx('Pusula-SettingsMenu', opened && 'Pusula-SettingsMenu_open')}
        role="dialog"
        aria-modal="true"
        aria-label={t('pusula.settings.title', { defaultValue: 'Settings' })}
      >
        <header className="Pusula-SettingsMenu-Header">
          <div className="Pusula-SettingsMenu-Title">
            <img
              src={pusulaBurgerMenuIcon(PUSULA_BURGER_MENU_ICONS.settingsGear)}
              alt=""
              className="Pusula-SettingsMenu-TitleIcon"
              width={24}
              height={24}
              draggable={false}
            />
            <span>{t('pusula.settings.title', { defaultValue: 'Settings' })}</span>
          </div>
          <button
            type="button"
            className="Pusula-SettingsMenu-Close"
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

        <div className="Pusula-SettingsMenu-UserRow">
          <div className="Pusula-SettingsMenu-UserLeft">
            <img
              src={pusulaBurgerMenuIcon(PUSULA_BURGER_MENU_ICONS.user)}
              alt=""
              className="Pusula-SettingsMenu-UserAvatar"
              width={24}
              height={24}
              draggable={false}
            />
            <span className="Pusula-SettingsMenu-UserName">{displayName}</span>
          </div>
          <span className="Pusula-SettingsMenu-UserId">
            {t('shared.id', { defaultValue: 'ID' })}: {displayId}
          </span>
        </div>

        <div className="Pusula-SettingsMenu-Body">
          <div
            className="Pusula-SettingsMenu-Row Pusula-SettingsMenu-Row_toggle"
            role="presentation"
            onClick={toggleAudio}
          >
            <img
              src={pusulaBurgerMenuIcon(PUSULA_BURGER_MENU_ICONS.sound)}
              alt=""
              className="Pusula-SettingsMenu-RowIcon"
              width={24}
              height={24}
              draggable={false}
            />
            <span className="Pusula-SettingsMenu-RowLabel">
              {t('pusula.settings.musicSound', { defaultValue: 'Music & Sound' })}
            </span>
            <button
              type="button"
              className={clsx(
                'Pusula-SettingsMenu-Toggle',
                audioOn && 'Pusula-SettingsMenu-Toggle_on',
              )}
              aria-pressed={audioOn}
              onClick={(event) => {
                stopRowClick(event);
                toggleAudio();
              }}
              onKeyDown={onToggleKey}
            >
              <span className="Pusula-SettingsMenu-Toggle-Knob">
                <span className="Pusula-SettingsMenu-Toggle-KnobCore" aria-hidden />
              </span>
            </button>
          </div>

          <button
            type="button"
            className="Pusula-SettingsMenu-Row"
            onClick={() => openPopup('fairness_settings')}
          >
            <img
              src={pusulaBurgerMenuIcon(PUSULA_BURGER_MENU_ICONS.shieldFair)}
              alt=""
              className="Pusula-SettingsMenu-RowIcon"
              width={24}
              height={24}
              draggable={false}
            />
            <span className="Pusula-SettingsMenu-RowLabel">
              {t('pusula.settings.provablyFair', { defaultValue: 'Provably fair' })}
            </span>
            <img
              src={pusulaBurgerMenuIcon(PUSULA_BURGER_MENU_ICONS.chevronRight)}
              alt=""
              className="Pusula-SettingsMenu-Chevron"
              width={32}
              height={32}
              draggable={false}
            />
          </button>

          <button
            type="button"
            className="Pusula-SettingsMenu-Row"
            onClick={() => openPopup('game_rules')}
          >
            <img
              src={pusulaBurgerMenuIcon(PUSULA_BURGER_MENU_ICONS.document)}
              alt=""
              className="Pusula-SettingsMenu-RowIcon"
              width={24}
              height={24}
              draggable={false}
            />
            <span className="Pusula-SettingsMenu-RowLabel">
              {t('pusula.settings.gameRules', { defaultValue: 'Game rules' })}
            </span>
            <img
              src={pusulaBurgerMenuIcon(PUSULA_BURGER_MENU_ICONS.chevronRight)}
              alt=""
              className="Pusula-SettingsMenu-Chevron"
              width={32}
              height={32}
              draggable={false}
            />
          </button>

          <button
            type="button"
            className="Pusula-SettingsMenu-Row"
            onClick={() => openPopup('game_limits')}
          >
            <img
              src={pusulaBurgerMenuIcon(PUSULA_BURGER_MENU_ICONS.gameLimits)}
              alt=""
              className="Pusula-SettingsMenu-RowIcon"
              width={24}
              height={24}
              draggable={false}
            />
            <span className="Pusula-SettingsMenu-RowLabel">
              {t('pusula.settings.gameLimits', { defaultValue: 'Game limits' })}
            </span>
            <img
              src={pusulaBurgerMenuIcon(PUSULA_BURGER_MENU_ICONS.chevronRight)}
              alt=""
              className="Pusula-SettingsMenu-Chevron"
              width={32}
              height={32}
              draggable={false}
            />
          </button>
        </div>

        <footer className="Pusula-SettingsMenu-Footer">
          <div className="Pusula-SettingsMenu-Powered">
            <img
              src={pusulaBurgerMenuIcon(PUSULA_BURGER_MENU_ICONS.poweredBadge)}
              alt=""
              className="Pusula-SettingsMenu-PoweredBadge"
              width={26}
              height={26}
              draggable={false}
            />
            <span className="Pusula-SettingsMenu-PoweredLabel">
              {t('pusula.settings.poweredBy', { defaultValue: 'Powered by' })}
            </span>
            <img
              src={gameAsset(GAME_ASSET_PATHS.brand.abraText)}
              alt="AbraCadabra"
              className="Pusula-SettingsMenu-PoweredBrand"
              height={12}
              draggable={false}
            />
          </div>
          <button type="button" className="Pusula-SettingsMenu-HomeLink" onClick={handleHome}>
            {t('pusula.settings.backToHome', { defaultValue: 'Back to Home' })}
          </button>
        </footer>
      </div>
    );
  },
);
