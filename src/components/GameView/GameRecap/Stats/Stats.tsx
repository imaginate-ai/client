import { useEffect, useMemo, useRef, useState } from 'react';
import { Flex } from 'antd';
import ScoreDistribution from './ScoreDitribution';
import StreakWidget, { getMaxStreak } from '@app/components/Streak/Streak';

const Stats = () => {
  const [data, averageScore, gamesPlayed] = useGameData();
  const scoreContainer = useRef<HTMLDivElement>(null);
  const maxStreak = useMemo(getMaxStreak, [data]);
  return (
    <Flex className='w-full h-full' justify='space-between' vertical>
      <p className='text-2xl font-bold'>Statistics</p>
      <Flex align='center' gap={'1rem'} justify='space-around' className='my-8'>
        <div>
          <p className='text-3xl '>{gamesPlayed}</p>
          <p className='text-lg '>Games Played</p>
        </div>
        <div>
          <p className='text-3xl '>{averageScore}</p>
          <p className='text-lg '>Average Score</p>
        </div>
        <div>
          <Flex justify='center' align='center' gap='1rem'>
            <StreakWidget size='xl' />
          </Flex>
          <p className='text-lg '>Current Streak</p>
        </div>
        <div>
          <p className='text-3xl '>{maxStreak}</p>
          <p className='text-lg '>Longest Streak</p>
        </div>
      </Flex>
      <p className='text-lg ' ref={scoreContainer}>
        Score Distribution
      </p>
      <div className='w-full'>
        <ScoreDistribution
          data={data}
          width={scoreContainer.current?.clientWidth}
        />
      </div>
    </Flex>
  );
};

const useGameData = () => {
  const [data, setData] = useState<number[]>([]);
  const [averageScore, setAverageScore] = useState<string | number>(0);
  const [gamesPlayed, setGamesPlayed] = useState<number>(0);

  useEffect(() => {
    const stats = JSON.parse(localStorage.getItem('stats') ?? '{}');
    if (stats.games && Array.isArray(stats.games)) {
      const scoreData = stats.games.map(
        (game: { score: number }) => game.score,
      );
      setData(scoreData);
    }
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      setAverageScore(
        (data.reduce((a, b) => a + b, 0) / data.length).toFixed(2),
      );
      setGamesPlayed(data.length);
    }
  }, [data]);

  return [data, averageScore, gamesPlayed] as const;
};

export default Stats;
