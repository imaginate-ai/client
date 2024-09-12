import { JSX, useRef } from 'react';
import { PhotoQueueButtonProps } from './interfaces/PhotoQueueProps.ts';
import { Button } from 'antd';

export const PhotoQueueButtons = ({
  makeChoice,
  disabled,
}: PhotoQueueButtonProps): JSX.Element => {
  const AiButton = useRef<HTMLButtonElement>(null);
  const RealButton = useRef<HTMLButtonElement>(null);

  const clickHandler = (target: HTMLElement) => {
    let choseReal: boolean;

    if (AiButton?.current && RealButton?.current) {
      buttonsDisabled(true);
      if (target.textContent === 'A.I.') {
        choseReal = false;
      } else {
        choseReal = true;
      }
      makeChoice(choseReal, choiceCallBack);
    }
  };

  const choiceCallBack = () => {
    if (AiButton?.current && RealButton?.current) {
      buttonsDisabled(false);
    }
  };

  const buttonsDisabled = (value: boolean) => {
    if (AiButton?.current && RealButton?.current) {
      if (value) {
        AiButton.current.setAttribute('disabled', 'true');
        RealButton.current.setAttribute('disabled', 'true');
      } else {
        AiButton.current.removeAttribute('disabled');
        RealButton.current.removeAttribute('disabled');
      }
    }
  };

  if (disabled) {
    buttonsDisabled(true);
  }

  return (
    <div className='flex flex-row gap-8 h-16'>
      <Button
        ref={AiButton}
        type='primary'
        className={'choiceButton mb-2 w-full h-full text-body'}
        onClick={(event) => clickHandler(event.target as HTMLElement)}
      >
        A.I.
      </Button>
      <Button
        ref={RealButton}
        type='primary'
        className={'choiceButton mb-2 w-full h-full text-body'}
        onClick={(event) => clickHandler(event.target as HTMLElement)}
      >
        Real
      </Button>
    </div>
  );
};
