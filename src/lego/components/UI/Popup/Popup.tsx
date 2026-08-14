

import { FC, PropsWithChildren, useEffect } from 'react';
import { createPortal } from 'react-dom';

import { IPopupProps } from './Popup.types';
import clsx from 'clsx';

export const Popup: FC<PropsWithChildren<IPopupProps>> = ({
  onClose,
  children,
  title,
  footer,
  className,
  dismissable = true,
}) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.removeProperty('overflow');
    };
  }, []);
  return createPortal(
    <div  className={clsx('Lego-Popup', className)}
    onClick={() => dismissable && onClose()}>
      <div className='Lego-Popup-Container' onClick={e => e.stopPropagation()}>
        <div className='Lego-Popup-Content'>
          <div className='Lego-Popup-Header'>
            <h3 className='Lego-Popup-Title'>{title}</h3>
            {dismissable && (
              <button
                type='button'
                className='Lego-Popup-Close'
                onClick={onClose}>
                X
              </button>
            )}
          </div>
          <div className='Lego-Popup-Body'>{children}</div>
          {footer && <div className='Lego-Popup-Footer'>{footer}</div>}
        </div>
      </div>
    </div>,
    document.body,
  );
};
