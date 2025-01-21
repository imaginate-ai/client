import { JSX, useEffect, useRef, useState } from "react";
import { Button } from "antd";

type GameButtonProps = {
  disabled: boolean;
  makeChoice: Function;
};

const GameButtons = ({
  makeChoice,
  disabled,
}: GameButtonProps): JSX.Element => {
  const AiButton = useRef<HTMLButtonElement>(null);
  const RealButton = useRef<HTMLButtonElement>(null);
  const [aiButtonDisabled, setAiButtonDisabled] = useState(true);
  const [realButtonDisabled, setRealButtonDisabled] = useState(true);

  const clickHandler = (target: HTMLElement) => {
    let choseReal: boolean;
    if (AiButton?.current && RealButton?.current) {
      buttonsDisabled(true);
      if (target.textContent === "A.I.") {
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
      setAiButtonDisabled(value);
      setRealButtonDisabled(value);
    }
  };

  useEffect(() => {
    buttonsDisabled(disabled);
  }, [disabled]);

  return (
    <div className="flex flex-row gap-8 h-16">
      <Button
        ref={AiButton}
        type="primary"
        className={"choiceButton mb-2 w-full h-full text-body"}
        disabled={aiButtonDisabled}
        onClick={(event) => clickHandler(event.target as HTMLElement)}
      >
        A.I.
      </Button>
      <Button
        ref={RealButton}
        type="primary"
        className={"choiceButton mb-2 w-full h-full text-body"}
        disabled={realButtonDisabled}
        onClick={(event) => clickHandler(event.target as HTMLElement)}
      >
        Real
      </Button>
    </div>
  );
};

export default GameButtons;
