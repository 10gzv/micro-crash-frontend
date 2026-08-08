import { observer } from "mobx-react-lite";
import { FC, useEffect, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";

import { randomSeedGenerator } from "@/lego/helpers";
import { showPusulaCopyNotice } from "@lego/helpers/showPusulaCopyNotice";

import { Input, SvgUse } from "../../UI";
import { Radio } from "../../UI/Radio";
import { betStore, gameStore, useTranslation } from "@10gzv/crash-core";

const MIN_SEED_LENGTH = 5;
const MAX_SEED_LENGTH = 20;

export const FairnessSettings: FC = observer(() => {
  const { t } = useTranslation();

  // The seed is committed to the round the moment it starts, so it must not be
  // changed while a round is running (odd climbing) — only during the
  // betting/waiting window.
  const isGameActive = gameStore.isOddStarted && !gameStore.isRoundOver;

  const onCopy = () => {
    showPusulaCopyNotice();
  };

  const [localManualSeed, setLocalManualSeed] = useState(randomSeedGenerator());
  const [isFocused, setIsFocused] = useState<boolean>(false);

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

  const onManualSeedInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    const validValue = value;
    setLocalManualSeed(validValue);
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    CopyToClipboard as unknown as React.ComponentType<any>;

  return (
    <>
      <div className="Lego-HowToPlay-Text Lego-HowToPlay-Highlight">
        {t("fairnessCheckPopup.whatIs", {
          defaultValue: "What is Provable Fairness?",
        })}{" "}
      </div>
      <div className="Lego-HowToPlay-Text">
        {t("htpPopup.fairnessTab.description", {
          defaultValue:
            "This game uses Provable Fairness technology to determine game result. This tool gives you ability to change your seed and check fairness of the game",
        })}
      </div>
      <span className="Lego-HowToPlay-Text">
        {t("htpPopup.fairnessTab.nestServerSeed", {
          defaultValue: "Next server seed",
        })}
      </span>
      <div className="Lego-HowToPlay-Input">
        <Input value={gameStore.nextServerSeed} readOnly />
        <FixedCopyToClipboard onCopy={onCopy} text={gameStore.nextServerSeed}>
          <div className="Lego-HowToPlay-Copy-Button">
            <SvgUse className="Lego-HowToPlay-Copy-Button-Svg" id="copy" />
          </div>
        </FixedCopyToClipboard>
      </div>
      <span className="Lego-HowToPlay-Text">
        {t("htpPopup.fairnessTab.nextClientSeed", {
          defaultValue: "Next client seed",
        })}
      </span>
      <div className="Lego-HowToPlay-SeedWrapper">
        <Radio
          checked={!betStore.betSeed.manual}
          readOnly
          isDisabled={isGameActive}
          label={t("htpPopup.fairnessTab.random", {
            defaultValue: "Random on every new game",
          })}
          onClick={() => {
            if (isGameActive) return;
            betStore.updateBetSeed({ manual: false });
          }}
        />
        {!betStore.betSeed.manual && (
          <div className="Lego-HowToPlay-Input">
            <Input value={betStore.betSeed.seed} readOnly />
            <FixedCopyToClipboard onCopy={onCopy} text={betStore.betSeed.seed}>
              <div className="Lego-HowToPlay-Copy-Button">
                <SvgUse className="Lego-HowToPlay-Copy-Button-Svg" id="copy" />
              </div>
            </FixedCopyToClipboard>
          </div>
        )}
      </div>
      <div className="Lego-HowToPlay-SeedWrapper">
        <Radio
          checked={betStore.betSeed.manual}
          readOnly
          isDisabled={isGameActive}
          onClick={() => {
            if (isGameActive) return;
            betStore.updateBetSeed({ manual: true });
          }}
          label={t("htpPopup.fairnessTab.manually", {
            defaultValue: "Enter manually",
          })}
        />
        {betStore.betSeed.manual && (
          <div className="Lego-HowToPlay-Input">
            <Input
              value={localManualSeed}
              disabled={isGameActive}
              isDisabled={isGameActive}
              onChange={onManualSeedInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={onManualSeedInputBlur}
            />
            <FixedCopyToClipboard onCopy={onCopy} text={betStore.betSeed.seed}>
              <div className="Lego-HowToPlay-Copy-Button">
                <SvgUse className="Lego-HowToPlay-Copy-Button-Svg" id="copy" />
              </div>
            </FixedCopyToClipboard>
          </div>
        )}
      </div>
    </>
  );
});
