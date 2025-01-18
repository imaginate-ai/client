import { useEffect, useMemo, useState } from 'react';
import { Choice } from '../../types/Image.types';
import { recapAnimationTime } from '../../constants/GameRecapConstants';
import ConfettiExplosion from 'react-confetti-explosion';

const GameRecapText = ({ choices }: { choices: Choice[] }) => {
  const [showConfetti, setShowConfetti] = useState(false);

  const score = useMemo(() => {
    return choices.filter((choice) => choice.isCorrect).length;
  }, [choices]);

  useEffect(() => {
    setTimeout(() => {
      if (score && choices.length) {
        setShowConfetti(score === choices.length);
      }
    }, recapAnimationTime);
  }, [score, choices]);

  return (
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
  );
};

export default GameRecapText;
