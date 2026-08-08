import { FC, useState } from "react";

import { Button, Checkbox, IPopupProps, Popup, SvgUse } from "@/lego";
import { soundStore, useTranslation } from "@10gzv/crash-core";

export const SoundConfirm: FC<IPopupProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const [dontAskMeAgain, setDontAskMeAgain] = useState(false);

  const { confirmPopupSubmit } = soundStore;

  const onNoClick = () => {
    confirmPopupSubmit({
      isMusicOn: false,
      isSoundOn: false,
      dontAskChecked: dontAskMeAgain,
    });
    onClose();
  };

  const onYesClick = () => {
    confirmPopupSubmit({
      isMusicOn: true,
      isSoundOn: true,
      dontAskChecked: dontAskMeAgain,
    });
    onClose();
  };

  return (
    <Popup onClose={onClose}>
      <div className="Lego-SoundConfirm">
        <div className="Lego-SoundConfirm-Icons">
          <div className="Lego-SoundConfirm-Icon Music">
            <SvgUse id="music" />
          </div>
          <div className="Lego-SoundConfirm-Icon Sound">
            <SvgUse id="sound" />
          </div>
        </div>
        <div className="Lego-SoundConfirm-Text">
          {t("soundPopup.enableSound", { defaultValue: "Enable sound?" })}
        </div>{" "}
        <div className="Lego-SoundConfirm-DontAsk">
          <Checkbox
            label={t("soundPopup.dontAskMeAgain", {
              defaultValue: "Don't ask me again",
            })}
            checked={dontAskMeAgain}
            onChange={(e) => setDontAskMeAgain(e.target.checked)}
          />
        </div>
        <div className="Lego-SoundConfirm-Actions">
          <Button onClick={onYesClick}>
            {t("shared.yes", { defaultValue: "Yes" })}
          </Button>
          <Button onClick={onNoClick}>
            {t("shared.no", { defaultValue: "No" })}
          </Button>
        </div>
      </div>
    </Popup>
  );
};
