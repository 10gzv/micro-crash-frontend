import { observer } from "mobx-react-lite";
import { FC, useEffect, useState } from "react";

import { gameStore, useTranslation } from "@10gzv/crash-core";

const WAIT_DURATION = 7;

export const Timer: FC = observer(() => {
  const { t } = useTranslation();
  const { seconds, isOddStarted } = gameStore;
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    if (isOddStarted || !seconds) return undefined;
    setRemaining(seconds);
    const startedAt = Date.now();
    const startValue = seconds;
    const id = window.setInterval(() => {
      const next = Math.max(0, startValue - (Date.now() - startedAt) / 1000);
      setRemaining(next);
    }, 50);
    return () => window.clearInterval(id);
  }, [seconds, isOddStarted]);

  if (isOddStarted || !seconds) return null;

  const progress = Math.min(
    100,
    ((WAIT_DURATION - remaining) / WAIT_DURATION) * 100,
  );

  return (
    <div className="Pusula-Timer">
      <div className="Pusula-Timer-Seconds">{remaining.toFixed(1)}s</div>
      <div className="Pusula-Timer-Label">
        {t("gamePart.waitNextRound", {
          defaultValue: "Waiting for the next round",
        })}
      </div>
      <div className="Pusula-Timer-Bar">
        <div
          className="Pusula-Timer-BarFill"
          style={{ width: `${Math.max(progress, 2)}%` }}
        />
      </div>
    </div>
  );
});
