import { Flex } from "antd";
import { Choice } from "../../types/Image.types";
import PhotoCarousel from "../PhotoCarousel/PhotoCarousel";
import ShareButton from "../ShareButton/ShareButton";
import { useMemo } from "react";
import { currentDay } from "../../services/Day.service";
import { generateScoreText } from "../../services/Score.service";

type GameRecapProps = {
  choices: Choice[];
};

const day = currentDay();

const GameRecap = ({ choices }: GameRecapProps) => {
  const score = useMemo(() => {
    return choices.filter((choice) => choice.isCorrect).length;
  }, [choices]);
  const scoreText = useMemo(() => generateScoreText(choices, day), [choices]);
  return (
    <div className="w-full">
      <Flex
        justify="center"
        align="center"
        gap={"1rem"}
        className="text-center"
        vertical
      >
        <p className="text-2xl">
          You got {score} out of {choices.length} correct!
        </p>
        <PhotoCarousel choices={choices} />
        <ShareButton scoreText={scoreText} />
      </Flex>
    </div>
  );
};

export default GameRecap;
