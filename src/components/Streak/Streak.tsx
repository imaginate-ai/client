import { Flex } from 'antd';
import { FireOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { getDayLastPlayed, getToday } from '../../services/Day.service';
import { useGameOverContext } from '../../providers/gameOver.provider';

const StreakWidget = ({ size }: { size?: string }) => {
  const [streak, playedToday] = UseStreak();
  const [styling] = useState(size === 'xl' ? 'text-3xl' : '');

  // Animation: slowly rotate the fire emoji left and right
  const rotation = useFireAnimation();

  return (
    <Flex>
      {playedToday ? (
        <animated.p style={rotation} className={styling}>
          🔥
        </animated.p>
      ) : (
        <FireOutlined className='mr-1' />
      )}
      <p className={styling}>{streak}</p>
    </Flex>
  );
};

const useFireAnimation = () => {
  return useSpring({
    loop: { reverse: true },
    from: { transform: `rotate(-${8}deg)` },
    to: { transform: `rotate(${8}deg)` },
    config: { duration: 100, tension: 10000 },
  });
};

const UseStreak = () => {
  const [streak, setStreak] = useState(0);
  const [playedToday, setPlayedToday] = useState(false);
  const [isGameOver] = useGameOverContext();

  useEffect(() => {
    if (isGameOver && !playedToday) {
      setStreak((prevStreak) => {
        const newStreak = prevStreak + 1;
        localStorage.setItem('streak', String(newStreak));
        return newStreak;
      });
      setPlayedToday(true);
    }
  }, [isGameOver, playedToday]);

  useEffect(() => {
    const savedStreak = Number(localStorage.getItem('streak'));
    setStreak(savedStreak);
    const today: number = getToday();
    const dayLastPlayed: number = getDayLastPlayed();
    const dayBeforeYesterday = today - 2;
    if (today === dayLastPlayed) {
      setPlayedToday(true);
    } else if (dayBeforeYesterday >= dayLastPlayed) {
      localStorage.setItem('streak', String(0));
    }
  }, []);

  useEffect(() => {
    const maxStreak = getMaxStreak();
    if (streak > maxStreak) {
      localStorage.setItem('maxStreak', String(streak));
    }
  }, [streak]);

  return [streak, playedToday];
};

export const getMaxStreak = () => {
  return Number(localStorage.getItem('maxStreak')) || 0;
};

export default StreakWidget;
