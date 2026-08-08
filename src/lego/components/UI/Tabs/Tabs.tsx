import { FC, CSSProperties } from 'react';
import clsx from 'clsx';

import { ITabsProps } from './Tabs.types';

export const Tabs: FC<ITabsProps> = ({
  activeTabIndex,
  isDisabled,
  items,
  onChange,
  className,
}) => {
  function onKeyDown(e: React.KeyboardEvent, tabIndex: number) {
    if (e.code === 'Enter' || e.code === 'Space') {
      onChange(tabIndex);
    }
  }

  const visibleCount = items.filter(({ visible }) => visible).length;

  const tabsStyle = {
    '--tabs-active-index': activeTabIndex,
    '--tabs-count': visibleCount,
  } as CSSProperties;

  return (
    <ul
      className={clsx(
        'Lego-Tabs',
        className && className,
        isDisabled && 'Lego-Tabs_Disabled',
      )}
      style={tabsStyle}>
      {items.map(({ name, visible, id, className: itemClassName }, index) =>
        visible ? (
          <li
            key={name}
            className={clsx(
              'Lego-Tab',
              (activeTabIndex === index || activeTabIndex === id) &&
                'Lego-Tab_active',
              itemClassName && itemClassName,
            )}
            onClick={() => onChange(id || index)}
            onKeyDown={e => onKeyDown(e, index)}
            role='tab'
            tabIndex={0}>
            {name}
          </li>
        ) : null,
      )}
      <li aria-hidden className='Lego-Tabs-Highlight' />
    </ul>
  );
};
