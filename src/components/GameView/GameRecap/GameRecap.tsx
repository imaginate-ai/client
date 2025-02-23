import { Button, Flex } from 'antd';
import { Choice } from 'src/types/Image.types';
import ShareButton from '@components/ShareButton/ShareButton';
import { useEffect, useMemo, useState } from 'react';
import { getToday } from '@services/Day.service';
import { generateScoreText } from '@services/Score.service';
import { animated, useSpring } from '@react-spring/web';
import { recapAnimationTime } from '@app/constants/GameRecapConstants';
import { getLastChoiceKeeper } from '@services/Choices.service';
import { BarChartOutlined, CameraOutlined } from '@ant-design/icons';
import RecapContent from './RecapContent/RecapContent';

const day = getToday();

const GameRecap = () => {
  const choices = useChoiceKeeper();
  const scoreText = useMemo(() => generateScoreText(choices, day), [choices]);
  const animations = useRecapAnimations();

  const [showStats, setShowStats] = useState(false);

  const secondaryButton = showStats ? (
    <Button
      className='p-8 text-xl rounded-full'
      type='default'
      key='shareButton'
      onClick={() => setShowStats(false)}
    >
      <CameraOutlined />
      View Photos
    </Button>
  ) : (
    <Button
      className='p-8 text-xl rounded-full'
      type='default'
      key='shareButton'
      onClick={() => setShowStats(true)}
    >
      <BarChartOutlined />
      View Stats
    </Button>
  );

  return (
    <animated.div style={animations} className='w-full h-full'>
      <Flex
        justify='center'
        align='center'
        className='text-center w-full h-full'
        vertical
      >
        <RecapContent choices={choices} showStats={showStats} />
        <Flex
          align='center'
          justify='center'
          gap={'16px'}
          className='mt-8 mb-16 w-full'
        >
          <ShareButton scoreText={scoreText} />
          {secondaryButton}
        </Flex>
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
    from: { transform: `translateY(20px)` },
    to: { transform: `translateY(0px)` },
    config: {
      duration: recapAnimationTime,
      easing: (t) => Math.pow(t - 1, 3) + 1,
    },
  });

  const opacityAnimation = useSpring({
    from: { opacity: 0 },
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
