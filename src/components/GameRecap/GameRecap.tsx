import { Flex } from 'antd';
import { Choice } from '../../types/Image.types';
import PhotoCarousel from '../PhotoCarousel/PhotoCarousel';
import ShareButton from '../ShareButton/ShareButton';
import { useEffect, useMemo, useState } from 'react';
import { currentDay } from '../../services/Day.service';
import { generateScoreText } from '../../services/Score.service';
import { useSpring, animated } from '@react-spring/web';
import ConfettiExplosion from 'react-confetti-explosion';

const day = currentDay();
const animationTime = 500;

const GameRecap = () => {
  const choices = useChoiceKeeper();
  const score = useMemo(() => {
    return choices.filter((choice) => choice.isCorrect).length;
  }, [choices]);
  const scoreText = useMemo(() => generateScoreText(choices, day), [choices]);
  const [showConfetti, setShowConfetti] = useState(false);

  const translateAnimation = useSpring({
    from: {
      transform: `translateY(20px)`,
    },
    to: { transform: `translateY(0px)` },
    config: {
      duration: animationTime,
      easing: (t) => Math.pow(t - 1, 3) + 1,
    },
  });

  const opacityAnimation = useSpring({
    from: {
      opacity: 0,
    },
    to: { opacity: 1 },
    config: {
      duration: animationTime,
      easing: (t) => Math.pow(t, 3),
    },
  });

  const animations = {
    ...translateAnimation,
    ...opacityAnimation,
  };

  useEffect(() => {
    setTimeout(() => {
      setShowConfetti(score === choices.length);
    }, animationTime);
  }, [score, choices]);

  return (
    <animated.div className='w-full h-full' style={animations}>
      <Flex
        justify='center'
        align='center'
        gap={'1rem'}
        className='text-center'
        vertical
      >
        <div className='relative'>
          {showConfetti && (
            <div className='absolute top-0 left-1/2 transform -translate-x-1/2 z-50'>
              <ConfettiExplosion
                force={0.6}
                duration={3000}
                particleCount={160}
                width={1000}
              />
            </div>
          )}
          <p className='text-2xl'>
            You got {score} out of {choices.length} correct!
          </p>
        </div>
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
    const savedChoices = localStorage.getItem('last_choice_keeper');
    if (savedChoices) {
      setChoiceKeeper(JSON.parse(savedChoices));
    }
  }, []);

  return choiceKeeper;
};

export default GameRecap;
