import { JSX, ReactElement, useEffect, useRef, useState } from "react";
import { Flex, Progress } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import GameButtons from "./GameButtons/GameButtons.tsx";
import loadingGif from "../../../assets/loading.gif";
import posthog from "posthog-js";
import { Choice } from "../../../types/Image.types.ts";
import { useGameOverContext } from "../../../providers/gameOver.provider.tsx";
import { Image } from "../../../types/Image.types";

type GameProps = {
  photos: Image[] | undefined;
};

// This is a very bloated component. Flagging for future optimization.
const Game = ({ photos }: GameProps): JSX.Element => {
  const [score, setScore] = useState(0);
  const [index, setIndex] = useState(0);
  const [choiceKeeper, setChoiceKeeper] = useState<Array<Choice>>([]);
  const [disableButtons, setDisableButtons] = useState(true);
  const image = useRef<HTMLImageElement>(null);
  const parentBox = useRef<HTMLDivElement>(null);
  const [feedbackOverlay, setFeedbackOverlay] = useState<ReactElement>();
  const [isGameOver, setGameOver] = useGameOverContext();

  useEffect(() => {
    if (choiceKeeper.length) {
      localStorage.setItem("last_choice_keeper", JSON.stringify(choiceKeeper));
    }
  }, [choiceKeeper]);

  const makeChoice = (choseReal: boolean, choiceCallBack: Function) => {
    const isCorrectChoice = choseReal == photos![index].real;

    if (isCorrectChoice) {
      setScore(score + 1);
      setFeedbackOverlay(
        <div className="absolute w-full h-full content-center text-center bg-green-500">
          <CheckOutlined className="text-9xl text-green-800" />
        </div>,
      );
      setChoiceKeeper([
        ...choiceKeeper,
        { isCorrect: true, image: photos![index] },
      ]);
    } else {
      setFeedbackOverlay(
        <div className=" absolute w-full h-full content-center text-center bg-red-500">
          <CloseOutlined className="text-9xl text-red-800" />
        </div>,
      );
      setChoiceKeeper([
        ...choiceKeeper,
        { isCorrect: false, image: photos![index] },
      ]);
    }

    setTimeout(() => {
      if (index < photos!.length - 1) {
        setIndex(index + 1);
      } else {
        setGameOver(true);
      }
      setFeedbackOverlay(undefined);
      choiceCallBack();
    }, 750);

    return isCorrectChoice;
  };

  useEffect(() => {
    if (photos?.length) {
      setDisableButtons(false);
    }
  }, [photos]);

  useEffect(() => {
    if (isGameOver) {
      setDisableButtons(true);
      const today = new Date().setHours(0, 0, 0, 0);
      localStorage.setItem("day_last_played", today.toString());
      posthog.capture("completed_game", {
        score: score,
        length: photos!.length,
        grade: score / photos!.length,
        day: today,
        theme: photos![0].theme,
      });
    }
  }, [isGameOver]);

  return (
    <Flex
      align="center"
      justify="center"
      className="w-full h-full"
    >
      <div
        ref={parentBox}
        className="w-11/12 flex-1"
        style={{ maxWidth: "512px" }}
      >
        <Progress
          size={[parentBox.current?.offsetWidth ?? 0, 10]}
          percent={photos?.length
            ? disableButtons ? 100 : (index / photos.length) * 100
            : 0}
          showInfo={false}
        />
        <div
          className="relative rounded-lg overflow-hidden mb-8 w-full"
          style={{ backgroundColor: undefined }}
        >
          {photos?.length
            ? (
              <img
                ref={image}
                src={`data:image/png;base64,${photos[index].data}`}
              />
            )
            : (
              <div className="rounded-xl bg-zinc-900 aspect-square w-full">
                <Flex
                  align="center"
                  justify="center"
                  vertical
                  className="w-full h-full -mt-8"
                >
                  <img width="192px" src={loadingGif} />
                  <p className="text-center">Loading images...</p>
                </Flex>
              </div>
            )}
          <div className="opacity-75 absolute w-full h-full">
            {feedbackOverlay}
          </div>
        </div>
        <GameButtons
          makeChoice={makeChoice}
          disabled={disableButtons}
        />
      </div>
    </Flex>
  );
};

export default Game;
