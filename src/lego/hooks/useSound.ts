import useLibSound from "use-sound";
import { useEffect, useState } from "react";

import { SOUNDS } from "@/assets/sounds";
import { SOUND_IDS, soundStore } from "@10gzv/crash-core";
import { resolvedTheme } from "@lego/helpers/applyTheme";

export const useSound = () => {
  const { isMusicOn, isSoundOn, activeSoundId, setActiveSoundId } = soundStore;
  const [isUserClicked, setIsUserClicked] = useState(false);
  const [loadedSoundCount, setLoadedSoundCount] = useState<number>(0);

  const [background, backgroundOptions] = useLibSound(SOUNDS.background, {
    loop: true,
    volume: resolvedTheme.bgmVolume,
  });

  const [bet] = useLibSound(SOUNDS.bet, {
    onload: () => {
      setLoadedSoundCount(prev => prev + 1);
    },
  });
  const [crash] = useLibSound(SOUNDS.crash, {
    volume: 0.7,
    onload: () => {
      setLoadedSoundCount(prev => prev + 1);
    },
  });
  const [win] = useLibSound(SOUNDS.win, {
    onload: () => {
      setLoadedSoundCount(prev => prev + 1);
    },
  });

  useEffect(() => {
    const clickHandler = () => {
      setIsUserClicked(true);
      window.removeEventListener("click", clickHandler);
    };
    window.addEventListener("click", clickHandler, true);
    return () => document.body.removeEventListener("click", clickHandler);
  }, []);

  useEffect(() => {
    if (isMusicOn && isUserClicked) {
      backgroundOptions.stop();
      background();
    } else {
      backgroundOptions.stop();
    }
  }, [isMusicOn, isUserClicked]);

  const allSounds: Partial<
    Record<(typeof SOUND_IDS)[keyof typeof SOUND_IDS], typeof bet>
  > = {
    [SOUND_IDS.BET]: bet,
    [SOUND_IDS.CRASH]: crash,
    [SOUND_IDS.WIN]: win,
  };

  useEffect(() => {
    if (
      activeSoundId &&
      isSoundOn &&
      Object.prototype.hasOwnProperty.call(allSounds, activeSoundId)
    ) {
      allSounds[activeSoundId]?.();
    }
    setActiveSoundId(null);
  }, [activeSoundId, isSoundOn]);

  return Object.keys(allSounds).length === loadedSoundCount;
};
