import { FC, KeyboardEvent, useState } from 'react';
import clsx from 'clsx';

import {
  PUSULA_BURGER_MENU_ICONS,
  pusulaBurgerMenuIcon,
} from '@lego/constants/gameAssets';
import { useTranslation } from '@10gzv/crash-core';

export type PusulaProvablyFairWhatIsAccordionProps = {
  title: string;
  body: string;
  defaultOpen?: boolean;
};

export const PusulaProvablyFairWhatIsAccordion: FC<PusulaProvablyFairWhatIsAccordionProps> = ({
  title,
  body,
  defaultOpen = true,
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(defaultOpen);

  const onToggleKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setOpen((prev) => !prev);
    }
  };

  return (
    <section
      className={clsx(
        'Pusula-ProvablyFairPanel-Item',
        open && 'Pusula-ProvablyFairPanel-Item_open',
      )}
    >
      <div className="Pusula-ProvablyFairPanel-ItemHead">
        <h3 className="Pusula-ProvablyFairPanel-ItemTitle">{title}</h3>
        <button
          type="button"
          className="Pusula-ProvablyFairPanel-ItemToggle"
          aria-expanded={open}
          aria-label={
            open
              ? t('pusula.rules.collapse', { defaultValue: 'Collapse section' })
              : t('pusula.rules.expand', { defaultValue: 'Expand section' })
          }
          onClick={() => setOpen((prev) => !prev)}
          onKeyDown={onToggleKey}
        >
          <img
            className={clsx(
              'Pusula-ProvablyFairPanel-ItemToggleIcon',
              open && 'Pusula-ProvablyFairPanel-ItemToggleIcon_up',
            )}
            src={pusulaBurgerMenuIcon(PUSULA_BURGER_MENU_ICONS.chevronRight)}
            alt=""
            width={32}
            height={32}
            draggable={false}
          />
        </button>
      </div>
      {open && (
        <div className="Pusula-ProvablyFairPanel-ItemBody">
          <p className="Pusula-ProvablyFairPanel-ItemText">{body}</p>
        </div>
      )}
    </section>
  );
};
