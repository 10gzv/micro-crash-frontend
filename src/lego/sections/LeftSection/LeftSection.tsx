import { FC, useEffect, useState } from "react";
import clsx from "clsx";
import { observer } from "mobx-react-lite";

import { translationStore } from "@10gzv/crash-core";

import { Tabs } from "@/lego";
import { AllBets } from "@/lego/components/AllBets";
import { History } from "@/lego/components/History";
import { TopBets } from "@/lego/components/TopBets";
import { PusulaTotalBets } from "@/lego/components/TotalBets/PusulaTotalBets";
import { gameAsset, GAME_ASSET_PATHS } from '@lego/constants/gameAssets';

import { ILeftSectionProps } from "./LeftSection.types";

const initialActiveTabIndex: number = 0;

export const LeftSection: FC<ILeftSectionProps> = observer(
  ({ tabContainers }) => {
    const headerNames = [
      translationStore.t("headerNames.user", { defaultValue: "User" }),
      translationStore.t("headerNames.bet", { defaultValue: "Bet" }),
      translationStore.t("headerNames.Multiplier", {
        defaultValue: "Multiplier",
      }),
      translationStore.t("headerNames.win", { defaultValue: "Win" }),
    ];

    const containers = tabContainers ?? [
      <AllBets key="all-bets" headerNames={headerNames} />,
      <History key="history" headerNames={headerNames} />,
      <TopBets key="top-bets" />,
    ];

    const [activeTabIndex, setActiveTabIndex] = useState<number>(
      initialActiveTabIndex
    );
    const [isTabReady, setIsTabReady] = useState(false);

    const tab = containers[activeTabIndex];

    const onTabChange = (index: number) => {
      setActiveTabIndex(index);
      setIsTabReady(false);
    };

    useEffect(() => {
      if (!isTabReady) {
        const timeoutId = setTimeout(() => setIsTabReady(true), 700);
        return () => clearTimeout(timeoutId);
      }
    }, [isTabReady, activeTabIndex]);

    return (
      <div
        className={clsx(
          "Lego-LeftSection",
          "Lego-LeftSection_pusula",
          !isTabReady && "Lego-LeftSection_tabNotReady",
        )}
      >
        <div className="Lego-LeftSection-Header">
          <Tabs
            items={[
              {
                name: translationStore.t("tabs.allBets", {
                  defaultValue: "All bets",
                }),
                visible: true,
              },
              {
                name: translationStore.t("tabs.history", {
                  defaultValue: "History",
                }),
                visible: true,
              },
              {
                name: translationStore.t("tabs.topBets", {
                  defaultValue: "Top",
                }),
                visible: true,
              },
            ]}
            activeTabIndex={activeTabIndex}
            onChange={onTabChange}
          />
          {activeTabIndex === 0 && <PusulaTotalBets />}
        </div>
        <div className="Lego-LeftSection-Body">{tab}</div>
        <div className="Pusula-PoweredBy">
          <span className="Pusula-PoweredBy-Label">
            {translationStore.t("pusula.settings.poweredBy", {
              defaultValue: "Powered by",
            })}
          </span>
          <img
            className="Pusula-PoweredBy-Logo"
            src={gameAsset(GAME_ASSET_PATHS.brand.abraLogo)}
            alt="Abra Cadabra"
            height={24}
            draggable={false}
          />
        </div>
      </div>
    );
  }
);
