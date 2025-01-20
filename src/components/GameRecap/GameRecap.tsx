import { Flex } from 'antd';
import { Choice } from '../../types/Image.types';
import PhotoCarousel from '../PhotoCarousel/PhotoCarousel';
import ShareButton from '../ShareButton/ShareButton';
import { useEffect, useMemo, useState } from 'react';
import { getToday } from '../../services/Day.service';
import { generateScoreText } from '../../services/Score.service';
import { useSpring, animated } from '@react-spring/web';
import { recapAnimationTime } from '../../constants/GameRecapConstants';
import GameRecapText from '../GameRecapText.tsx/GameRecapText';
import { getLastChoiceKeeper } from '../../services/Choices.service';

const day = getToday();

const GameRecap = () => {
  const choices = useChoiceKeeper();
  const scoreText = useMemo(() => generateScoreText(choices, day), [choices]);
  const animations = useRecapAnimations();

  return (
    <animated.div className='w-full h-full' style={animations}>
      <Flex
        justify='center'
        align='center'
        gap={'1rem'}
        className='text-center'
        vertical
      >
        <GameRecapText choices={choices} />
        <div className='w-11/12'>
          <PhotoCarousel choices={choices} />
        </div>
        <ShareButton scoreText={scoreText} />
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
