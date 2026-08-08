import { FC, PropsWithChildren, RefObject, useEffect, useRef } from 'react';
import clsx from 'clsx';

import { IDropdownProps, IDropdownWrapperProps } from './Dropdown.types';

function assertIsNode(e: EventTarget | null): asserts e is Node {
  if (!e || !('nodeType' in e)) {
    throw new Error('Node expected');
  }
}

export const Dropdown: FC<PropsWithChildren<IDropdownProps>> = ({
  opened,
  children,
  onClose,
}) => {
  const refOfDropdown: RefObject<HTMLDivElement> = useRef(null);
  const localOpened = useRef(opened);

  const handleBodyClick = (event: MouseEvent) => {
    if (!localOpened.current) return;
    assertIsNode(event.target);
    if (!refOfDropdown.current?.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    localOpened.current = opened;
    if (opened)
      setTimeout(
        () => document.body.addEventListener('click', handleBodyClick),
        0,
      );
    return () => {
      document.body.removeEventListener('click', handleBodyClick);
    };
  }, [opened]);

  return (
    <div
      ref={refOfDropdown}
      className={clsx('Lego-Dropdown', opened && 'Lego-Dropdown_opened')}>
      {children}
    </div>
  );
};

export const DropdownWrapper: FC<IDropdownWrapperProps> = ({ children }) => {
  return <div className='Lego-DropdownWrapper'>{children}</div>;
};
