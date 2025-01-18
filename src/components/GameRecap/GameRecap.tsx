import { Card, Flex } from 'antd';
import { Choice } from '../../types/Image.types';
import PhotoCarousel from '../PhotoCarousel/PhotoCarousel';
import ShareButton from '../ShareButton/ShareButton';
import { useEffect, useMemo, useState } from 'react';
import { currentDay } from '../../services/Day.service';
import { generateScoreText } from '../../services/Score.service';

type GameRecapProps = {
  choices: Choice[];
};

const day = currentDay();

const GameRecap = () => {
  const choices = useChoiceKeeper();
  const score = useMemo(() => {
    return choices.filter((choice) => choice.isCorrect).length;
  }, [choices]);
  const scoreText = useMemo(() => generateScoreText(choices, day), [choices]);
  return (
    <div className='w-full h-full'>
      <Flex
        justify='center'
        align='center'
        gap={'1rem'}
        className='text-center'
        vertical
      >
        <p className='text-2xl'>
          You got {score} out of {choices.length} correct!
        </p>
        <div className='w-11/12'>
          <PhotoCarousel choices={choices} />
        </div>
        <ShareButton scoreText={scoreText} />
      </Flex>
    </div>
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
