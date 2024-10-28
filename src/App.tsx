import { useState, useRef, ReactElement, useEffect } from 'react';
import './App.css';
import NavBar from './components/NavBar/NavBar.tsx';
import { ConfigProvider, theme, Flex } from 'antd';

import posthog from 'posthog-js';
import PhotoQueue from './components/PhotoQueue/PhotoQueue.tsx';
import { getImages } from './services/Image.service.ts';
import { Choice, Image } from './types/Image.types.ts';
import { calculateDay } from './services/Day.service.ts';
import { generateScoreHTML } from './services/Score.service.tsx';

const day = calculateDay();

function App() {
  const { darkAlgorithm } = theme;
  const [showApp, setShowApp] = useState(true);
  const scoreText = useRef<ReactElement>();
  const [images, setImages] = useState<Image[]>([]);
  const [imageTheme, setImageTheme] = useState('');

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

  const dailyGameReminder = (
    <div className='text-center'>
      <p className='font-semibold mb-2'>You already played today!</p>
      <p className='font-semibold mb-2'>See you again tomorrow :)</p>
      {scoreText.current}
    </div>
  );

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
            {showApp ? <PhotoQueue images={images} /> : dailyGameReminder}
          </Flex>
          <div className='text-center m-8'>
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
            <a
              className='text-slate-500'
              href='https://pexels.com'
              target='_blank'
            >
              Real photos sourced at Pexels.com
            </a>
          </div>
        </Flex>
      </ConfigProvider>
    </div>
  );
}

export default App;
