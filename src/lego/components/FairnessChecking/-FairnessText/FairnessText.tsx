import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import CopyToClipboard from 'react-copy-to-clipboard';
import clsx from 'clsx';

import { Button, SvgUse } from '../../UI';

import { IFairnessTextProps } from './FairnessText.types';

export const FairnessText: FC<IFairnessTextProps> = observer(
  ({ caption, horizontal = false, copiable = false, text, onCopy }) => {
    const FixedCopyToClipboard =

    CopyToClipboard as unknown as React.ComponentType<any>;
    const copyComp = copiable ? (
      <div className='Lego-FairnessText-Copy'>
        <FixedCopyToClipboard onCopy={onCopy} text={text}>
          <Button className='Lego-FairnessText-Copy-Button' variant='primary'>
            <SvgUse className='Lego-FairnessText-Copy-Button-Svg' id='copy' />
          </Button>
        </FixedCopyToClipboard>
      </div>
    ) : (
      <></>
    );

    const captionComp =
      !horizontal && caption ? (
        <div className='Lego-FairnessText-Caption'>{caption}</div>
      ) : (
        <></>
      );

    const titleComp =
      horizontal && caption ? (
        <div className='Lego-FairnessText-Title'>{caption}</div>
      ) : (
        <></>
      );

    return (
      <div
        className={clsx(
          'Lego-FairnessText',
          horizontal && 'Lego-FairnessText_horizontal',
        )}>
        {titleComp}
        <div
          className={clsx(
            'Lego-FairnessText',
            horizontal && 'Lego-FairnessText_horizontal',
          )}>
          {captionComp}
          <div className='Lego-FairnessText-Text'>{text}</div>
          {copyComp}
        </div>
      </div>
    );
  },
);
