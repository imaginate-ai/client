import { Choice } from "@app/types/Image.types";
import { animated, useTransition } from "@react-spring/web";
import GameRecapText from "../GameRecapText";
import PhotoCarousel from "../PhotoCarousel/PhotoCarousel";
import Stats from "../Stats/Stats";
import { Flex } from "antd";

const RecapContent = ({
  choices,
  showStats,
}: {
  choices: Array<Choice>;
  showStats: boolean;
}) => {
  const viewTransition = useStatsViewTransitions(showStats);

  return (
    <>
      {viewTransition((style, shouldShowStats) => (
        <animated.div className="max-w-full max-h-full" style={style}>
          {shouldShowStats
            ? (
              <Flex className="w-full h-full" justify="center" align="center">
                <Stats />
              </Flex>
            )
            : (
              <div className="w-full h-full">
                <GameRecapText choices={choices} />
                <PhotoCarousel choices={choices} />
              </div>
            )}
        </animated.div>
      ))}
    </>
  );
};

export const useStatsViewTransitions = (trigger: boolean | null) => {
  return useTransition(trigger, {
    from: {
      opacity: 0,
      transform: `translateX(20px)`,
    },
    enter: { opacity: 1, transform: `translateX(0px)` },
    leave: { opacity: 0, transform: `translateX(-20px)` },
    config: {
      duration: 200,
      easing: (t) => Math.pow(t, 3),
    },
    exitBeforeEnter: true,
  });
};

export default RecapContent;
