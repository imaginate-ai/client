import { Flex } from "antd";
import { Choice } from "../../../types/Image.types";
import PhotoCarousel from "./PhotoCarousel/PhotoCarousel";
import ShareButton from "../../ShareButton/ShareButton";
import { useEffect, useMemo, useState } from "react";
import { getToday } from "../../../services/Day.service";
import { generateScoreText } from "../../../services/Score.service";
import { animated, useSpring } from "@react-spring/web";
import { recapAnimationTime } from "../../../constants/GameRecapConstants";
import GameRecapText from "./GameRecapText";
import { getLastChoiceKeeper } from "../../../services/Choices.service";

const day = getToday();

const GameRecap = () => {
  const choices = useChoiceKeeper();
  const scoreText = useMemo(() => generateScoreText(choices, day), [choices]);
  const animations = useRecapAnimations();

  return (
    <animated.div style={animations} className="w-full h-full">
      <Flex
        justify="space-between"
        align="center"
        className="text-center w-full h-full"
        vertical
      >
        <GameRecapText choices={choices} />
        <PhotoCarousel choices={choices} />
        <div className="my-8">
          <ShareButton scoreText={scoreText} />
        </div>
      </Flex>
    </animated.div>
  );
};

const useChoiceKeeper = () => {
  const [choiceKeeper, setChoiceKeeper] = useState<Choice[]>([]);

  useEffect(() => {
    const savedChoices = getLastChoiceKeeper();
    if (savedChoices) {
      setChoiceKeeper(savedChoices);
    }
  }, []);

  return choiceKeeper;
};

const useRecapAnimations = () => {
  const translateAnimation = useSpring({
    from: {
      transform: `translateY(20px)`,
    },
    to: { transform: `translateY(0px)` },
    config: {
      duration: recapAnimationTime,
      easing: (t) => Math.pow(t - 1, 3) + 1,
    },
  });

  const opacityAnimation = useSpring({
    from: {
      opacity: 0,
    },
    to: { opacity: 1 },
    config: {
      duration: recapAnimationTime,
      easing: (t) => Math.pow(t, 3),
    },
  });

  return {
    ...translateAnimation,
    ...opacityAnimation,
  };
};

export default GameRecap;
