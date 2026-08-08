import { FC, useLayoutEffect, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

import { useTranslation } from '@10gzv/crash-core';
import { gameAsset, GAME_ASSET_PATHS } from '@lego/constants/gameAssets';
import { pusulaCopyNoticeStore } from '@lego/stores/pusulaCopyNoticeStore';

const STAGE_CANVAS_SELECTOR = '.PusulaStage-Canvas';
const MOBILE_MAX_WIDTH = 1024;

function readStageAnchor(): CSSProperties {
  if (typeof document === 'undefined') {
    return {};
  }

  const isMobile = window.innerWidth < MOBILE_MAX_WIDTH;
  const canvas = document.querySelector(STAGE_CANVAS_SELECTOR);

  if (!canvas) {
    if (isMobile) {
      return {
        top: 'calc(var(--header-height) + 12px)',
        left: '12px',
        right: '12px',
        maxWidth: 'none',
      };
    }

    return {
      top: 'calc(var(--header-height) + 12px)',
      right: '12px',
    };
  }

  const rect = canvas.getBoundingClientRect();

  if (isMobile) {
    return {
      top: `${rect.top + 12}px`,
      left: `${rect.left + 12}px`,
      right: `${window.innerWidth - rect.right + 12}px`,
      maxWidth: 'none',
    };
  }

  return {
    top: `${rect.top + 12}px`,
    right: `${window.innerWidth - rect.right + 12}px`,
    left: 'auto',
  };
}

/** Copy success — aligned to stage, rendered above modals (portal + z-index). */
export const PusulaCopyNotice: FC = observer(() => {
  const { t } = useTranslation();
  const visible = pusulaCopyNoticeStore.visible;
  const [anchorStyle, setAnchorStyle] = useState<CSSProperties>({});

  useLayoutEffect(() => {
    if (!visible) return;

    const update = () => {
      setAnchorStyle(readStageAnchor());
    };

    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);

    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [visible]);

  const node = (
    <div
      className={clsx('Pusula-CopyNotice', visible && 'Pusula-CopyNotice_visible')}
      style={anchorStyle}
      role="status"
      aria-live="polite"
      aria-hidden={!visible}
    >
      <span className="Pusula-CopyNotice-IconWrap" aria-hidden>
        <img
          className="Pusula-CopyNotice-Icon"
          src={gameAsset(GAME_ASSET_PATHS.icons.notice.betAccepted)}
          alt=""
          width={24}
          height={24}
          draggable={false}
        />
      </span>
      <span className="Pusula-CopyNotice-Text">
        {t('notification.dataCopied', {
          defaultValue: 'Data successfully copied!',
        })}
      </span>
    </div>
  );

  if (typeof document === 'undefined') {
    return node;
  }

  return createPortal(node, document.body);
});
