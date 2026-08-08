import { observer } from "mobx-react-lite";
import { FC, useEffect, useState } from "react";
import Decimal from "decimal.js";
import { useMediaQuery } from "react-responsive";

import { DropdownWrapper } from "../Dropdown";
import { PusulaBurgerMenu } from "../BurgerMenu";

import { IHeaderProps } from "./Header.types";
import { chatStore, freeBetStore, getDisplayPrecision, servicesStore, userDataStore, useTranslation } from "@10gzv/crash-core";
import { MagicAlert } from "@10gzv/crash-core/chat";
import { resolvedTheme } from "@lego/helpers/applyTheme";
import { gameAsset, GAME_ASSET_PATHS } from "@lego/constants/gameAssets";
import { SvgUse } from "../UI";


const AlertBadge = ({ alertsCount }: { alertsCount: number }) => {
  if (!alertsCount) return <></>;

  return <div className="AlertBadge">{alertsCount}</div>;
};

export const Header: FC<IHeaderProps> = observer(() => {
  const { t } = useTranslation();

  const isDesktop = useMediaQuery({ query: "(min-width: 1025px)" });

  const { userBalance, currency } = userDataStore;
  const { isChatEnabled, isChatOpened } = chatStore;
  const [burgerDropdownOpened, setBurgerDropdownOpened] = useState(false);

  const exit_url = new URLSearchParams(window.location.search).get('exit_url');

  const onHomeClick = () => {
    servicesStore.postMessageService.emitOnGameExit();
  };

  useEffect(() => {
    servicesStore.postMessageService.emitOnToggleMenu(burgerDropdownOpened);
  }, [burgerDropdownOpened])

  const balanceAmount = new Decimal(userBalance ?? 0).toFixed(getDisplayPrecision());
  const chatIconUrl = gameAsset(GAME_ASSET_PATHS.icons.header.chat);
  const listIconUrl = gameAsset(GAME_ASSET_PATHS.icons.header.menu);

  return (
    <div className="Lego-Header">
      <div className="Lego-Header-Left">
        <div className="Lego-Header-Logo">
          <img src={resolvedTheme.logo} className="Lego-Header-LogoImage" alt="" />
        </div>
      </div>

      <div className="Lego-Header-Right">
        {!isDesktop && !!exit_url && (
          <button
            type="button"
            className="Lego-Header-IconBtn"
            onClick={onHomeClick}
            aria-label={t('header.home', { defaultValue: 'Home' })}
          >
            <SvgUse id="home" />
          </button>
        )}

        <div
          className="Lego-Header-Balance"
          aria-label={t('header.balance', { defaultValue: 'Balance' })}
        >
          <span className="Lego-Header-BalanceAmount">{balanceAmount}</span>
          <span className="Lego-Header-BalanceCurrency">{currency}</span>
        </div>

        <div className="Lego-Header-Actions">
          <div className="Lego-Header-ChatAnchor">
            {isChatEnabled && !isChatOpened && <MagicAlert />}
            <button
              type="button"
              className="Lego-Header-IconBtn"
              onClick={() => {
                if (isChatEnabled) chatStore.setIsChatOpened(!isChatOpened);
              }}
              aria-label={t('header.chat', { defaultValue: 'Chat' })}
            >
              <img src={chatIconUrl} alt="" className="Lego-Header-IconImg" draggable={false} />
            </button>
          </div>

          <DropdownWrapper>
            <button
              type="button"
              className="Lego-Header-IconBtn"
              onClick={() => setBurgerDropdownOpened(prev => !prev)}
              aria-label={t('header.menu', { defaultValue: 'Menu' })}
              aria-expanded={burgerDropdownOpened}
            >
              <img src={listIconUrl} alt="" className="Lego-Header-IconImg Lego-Header-IconImg_list" draggable={false} />
              <AlertBadge alertsCount={freeBetStore.freebets?.length || 0} />
            </button>
          </DropdownWrapper>
        </div>
      </div>
      {burgerDropdownOpened && (
        <>
          <button
            type="button"
            className="Pusula-SettingsMenu-Backdrop"
            aria-label={t('pusula.settings.close', { defaultValue: 'Close' })}
            onClick={() => setBurgerDropdownOpened(false)}
          />
          <PusulaBurgerMenu
            opened={burgerDropdownOpened}
            onClose={() => setBurgerDropdownOpened(false)}
            onHomeClick={onHomeClick}
          />
        </>
      )}
    </div>
  );
});
