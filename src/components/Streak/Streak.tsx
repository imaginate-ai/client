import { Flex } from 'antd';
import { FireOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { getDayLastPlayed, getToday } from '../../services/Day.service';
import { useGameOverContext } from '../../providers/gameOver.provider';

const StreakWidget = () => {
  const [streak, playedToday] = UseStreak();
  return (
    <Flex>
      {playedToday ? '🔥' : <FireOutlined className='mr-1' />}
      <p>{streak}</p>
    </Flex>
  );
};

const UseStreak = () => {
  const [streak, setStreak] = useState(0);
  const [playedToday, setPlayedToday] = useState(false);
  const [isGameOver] = useGameOverContext();
  useEffect(() => {
    if (isGameOver) {
      setStreak(streak + 1);
      localStorage.setItem('streak', String(streak + 1));
      setPlayedToday(true);
    }
  }, [isGameOver]);
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
  return [streak, playedToday];
};

export default StreakWidget;
