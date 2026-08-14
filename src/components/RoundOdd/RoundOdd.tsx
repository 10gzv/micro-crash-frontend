

import { observer } from "mobx-react-lite";
import { FC } from "react";
import clsx from "clsx";

import { gameStore, oddDataStore, useTranslation } from "@10gzv/crash-core";

export const RoundOdd: FC = observer(() => {
  const { t } = useTranslation();
  const { odd } = oddDataStore;
  const { isRoundOver } = gameStore;

  if (!odd) return null;

  return (
    <div
      className={clsx("Lego-RoundOdd", "Lego-RoundOdd_pusula", {
        "Lego-RoundOdd_crashed": isRoundOver,
      })}
    >
      <div className="Lego-RoundOdd-Text">
        <div className={clsx("Lego-RoundOdd-Text-Inner")}>
          x{Number(odd)?.toFixed(2)}
        </div>
        {isRoundOver && (
          <div className="Lego-RoundOdd-Crashed">
            {t("gamePart.crashed", { defaultValue: "Crashed" })}
          </div>
        )}
      </div>
    </div>
  );
});
