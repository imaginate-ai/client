import { ReactElement, useContext, useEffect, useRef, useState } from 'react';
import './App.css';
import { ConfigProvider, Divider, Flex, theme } from 'antd';

import posthog from 'posthog-js';
import PhotoQueue from './components/PhotoQueue/PhotoQueue.tsx';
import { getImages } from './services/Image.service.ts';
import { Choice, Image } from './types/Image.types.ts';
import { currentDay } from './services/Day.service.ts';
import { generateScoreHTML } from './services/Score.service.tsx';
import NavBar from './components/NavBar/NavBar.tsx';
import GameRecap from './components/GameRecap/GameRecap.tsx';
import { GameOverContext } from './providers/gameOver.provider.tsx';
import { useTransition, animated } from '@react-spring/web';

const day = currentDay();

function App() {
  const { darkAlgorithm } = theme;
  const [showApp, setShowApp] = useState(true);
  const scoreText = useRef<ReactElement>();
  const [images, setImages] = useState<Image[]>([]);
  const [imageTheme, setImageTheme] = useState('');
  const [isGameOver, _setIsGameOver] = useContext(GameOverContext);

  useEffect(() => {
    getImages().then((response: Image[] | undefined) => {
      if (response) {
        setImages(response);
        setImageTheme(response[0].theme);
      }
    });
  }, []);

  useEffect(() => {
    const storedDayLastPlayed = Number(localStorage.getItem('day_last_played'));
    const storedLastChoiceKeeper = localStorage.getItem('last_choice_keeper');
    if (storedDayLastPlayed && storedLastChoiceKeeper) {
      const today = new Date().setHours(0, 0, 0, 0);
      const dayLastPlayed = new Date(storedDayLastPlayed).setHours(0, 0, 0, 0);
      const lastChoiceKeeper: Choice[] = JSON.parse(storedLastChoiceKeeper);
      if (dayLastPlayed === today) {
        setShowApp(false);
        scoreText.current = generateScoreHTML(lastChoiceKeeper, day);
      }
    }
  }, []);

  const showRecap = !showApp || isGameOver;

  const transitions = useTransition(showRecap, {
    from: {
      opacity: 0,
      transform: `translateY(20px)`,
    },
    enter: { opacity: 1, transform: `translateY(0px)` },
    leave: { opacity: 0, transform: `translateY(20px)` },
    config: {
      duration: 200,
      easing: (t) => Math.pow(t, 3),
    },
    exitBeforeEnter: true,
  });

  return (
    <div className='h-full max-h-svh'>
      <ConfigProvider
        theme={{
          algorithm: darkAlgorithm,
        }}
      >
        <Flex
          style={{ width: '100vw', maxWidth: '1024px' }}
          align='center'
          justify='space-between'
          className='h-full w-full '
          vertical
        >
          <NavBar theme={imageTheme} />
          <Flex
            align='center'
            justify='space-evenly'
            className='flex-auto w-full'
            vertical
          >
            {transitions((style, showRecap) => {
              return (
                <animated.div className='w-full' style={style}>
                  {showRecap ? <GameRecap /> : <PhotoQueue images={images} />}
                </animated.div>
              );
            })}
          </Flex>
          <Flex className='text-center m-8' align='center' justify='center'>
            <p>
              Made by{' '}
              <a
                href='https://faisal-fawad.github.io'
                onClick={() => posthog.capture('faisal_link_click')}
                target='_blank'
              >
                Faisal
              </a>
              ,{' '}
              <a
                href='https://nathanprobert.ca'
                onClick={() => posthog.capture('nate_link_click')}
                target='_blank'
              >
                Nate
              </a>
              , and{' '}
              <a
                href='https://zachlegesse.ca'
                onClick={() => posthog.capture('zach_link_click')}
                target='_blank'
              >
                Zach
              </a>
            </p>
            <Divider type='vertical' />
            <a
              className='text-slate-600 underline'
              href='https://pexels.com'
              target='_blank'
            >
              Pexels.com
            </a>
          </Flex>
        </Flex>
      </ConfigProvider>
    </div>
  );
}

export default App;
