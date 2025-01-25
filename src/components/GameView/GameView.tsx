import { animated, useTransition } from "@react-spring/web";
import { Flex } from "antd";
import { ReactElement, useContext, useEffect, useRef, useState } from "react";
import { GameOverContext } from "@providers/gameOver.provider";
import { getDayLastPlayed, getToday } from "@services/Day.service";
import { getLastChoiceKeeper } from "@services/Choices.service";
import { Choice } from "@local-types/Image.types";
import { generateScoreHTML } from "@services/Score.service";
import Game from "./Game/Game";
import GameRecap from "./GameRecap/GameRecap";
import { usePhotos } from "@hooks/photos.hook";

const GameView = () => {
  const [photos] = usePhotos();
  const showGame = useShowGame();
  const transitions = useGameViewTransitions(showGame);

  return (
    <>
      {transitions((style, shouldDisplayGame) => {
        return (
          <animated.div className="h-full w-11/12" style={style}>
            <Flex
              align="center"
              justify="center"
              className="h-full "
              vertical
            >
              {shouldDisplayGame !== null &&
                (shouldDisplayGame ? <Game photos={photos} /> : <GameRecap />)}
            </Flex>
          </animated.div>
        );
      })}
    </>
  );
};

const useGameViewTransitions = (trigger: boolean | null) => {
  return useTransition(trigger, {
    from: {
      opacity: 0,
      transform: `translateY(20px)`,
    },
    enter: { opacity: 1, transform: `translateY(0px)` },
    leave: { opacity: 0, transform: `translateY(20px)` },
    config: {
      duration: 200,
      easing: (t) => Math.pow(t, 3),
    },
    exitBeforeEnter: true,
  });
};

const useShowGame = () => {
  const [isGameOver, _setIsGameOver] = useContext(GameOverContext);
  const [showGame, setShowGame] = useState<null | boolean>(null);
  const scoreText = useRef<ReactElement>();

  useEffect(() => {
    if (isGameOver) {
      setShowGame(!isGameOver);
    }
  }, [isGameOver]);

  useEffect(() => {
    const today: number = getToday();
    const dayLastPlayed: number = getDayLastPlayed();
    const lastChoiceKeeper: Choice[] = getLastChoiceKeeper();

    const hasPlayedToday = lastChoiceKeeper.length > 0 &&
      dayLastPlayed === today;

    if (hasPlayedToday) {
      scoreText.current = generateScoreHTML(lastChoiceKeeper, today);
    }

    setShowGame(!hasPlayedToday);
  }, []);

  return showGame;
};

export default GameView;
