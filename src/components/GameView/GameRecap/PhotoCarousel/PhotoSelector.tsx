import { Flex } from "antd";
import { Choice } from "../../../../types/Image.types";
import PhotoSelectorButton from "./PhotoSelectorButton";

type PhotoCarouselProps = {
  choices: Choice[];
  clickHandler: (index: number) => void;
  selectedIndex: number;
};

const PhotoSelector = ({
  choices,
  clickHandler,
  selectedIndex,
}: PhotoCarouselProps) => {
  return (
    <Flex
      justify="space-around"
      align="center"
      className="bg-gray-700 p-4 rounded-lg relative w-full"
      style={{ minHeight: "80px" }}
      gap={"0.5rem"}
    >
      {choices.map(({ isCorrect }, index, choices) => {
        const emoji = determineEmoji(index, choices);
        return (
          <PhotoSelectorButton
            key={index}
            clickHandler={(clicked) => {
              if (clicked) clickHandler(index);
            }}
            isCorrect={isCorrect}
            selected={index === selectedIndex}
          >
            {emoji}
          </PhotoSelectorButton>
        );
      })}
      <div className="absolute top-1/2 transform -translate-y-1/2 z-0 h-1 bg-slate-200 w-full">
      </div>
    </Flex>
  );
};

const goodEmoji = ["🙂", "😌", "😋", "🤠", "🥳"];
const badEmoji = ["🤨", "😟", "😓", "😭", "😵‍💫"];

// Determines the emoji to display based on the current index and choices
// The emoji changes based on the number of correct and incorrect choices
const determineEmoji = (index: number, choices: Choice[]) => {
  let curHappiness = 0;
  for (let i = 0; i < index; i++) {
    curHappiness += choices[i].isCorrect ? 1 : -1;
  }
  let emoji;

  if (choices[index].isCorrect) {
    const numberCorrect = (curHappiness + index) / 2;
    emoji = goodEmoji[numberCorrect];
  } else {
    const numberIncorrect = (index - curHappiness) / 2;
    emoji = badEmoji[numberIncorrect];
  }
  return emoji;
};

export default PhotoSelector;
