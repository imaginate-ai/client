import { useState, useRef, ReactElement, useEffect } from 'react';
import './App.css';
import Navbar from './navigation/Navbar';
import { ConfigProvider, theme, Flex } from 'antd';

import posthog from 'posthog-js';
import Cookies from 'universal-cookie';
import { PhotoQueue } from './photoQueue/photoQueue.tsx';
import { getImages } from './services/imageBackend.ts';
import { Image } from './photoQueue/interfaces/ImageInterface.ts';

const cookies = new Cookies();

function App() {
  const { darkAlgorithm } = theme;
  const [showApp, setShowApp] = useState(true);
  const savedScoreString = useRef<ReactElement>();
  const [images, setImages] = useState<Image[]>([])
  const [imageTheme, setImageTheme] = useState('')

  useEffect(() => {
    getImages().then((response: Image[]) => {
      if (response) {
        setImages(response);
        setImageTheme(response[0].theme)
      }
    });
  }, []);

  posthog.init('phc_TrQqpxDjEZAOLzSUBk8DKJF8UzhBj4sbkhe6YOSxYxe', {
    api_host: 'https://us.i.posthog.com',
    person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users as well
  });

  const splitNewlinesToParagraphTags = (input: string) => {
    return input.split('\n').map((text) => <p>{text}</p>);
  };

  useEffect(() => {
    const dayLastPlayed = new Date(cookies.get('day_last_played'));
    const completeScoreText: string = cookies.get('last_complete_score_text');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (
      dayLastPlayed.toTimeString() === today.toTimeString() &&
      completeScoreText
    ) {
      setShowApp(false);
      savedScoreString.current = (
        <div>{splitNewlinesToParagraphTags(completeScoreText)}</div>
      );
    }
  }, []);

  const dailyGameReminder = (
    <div className='text-center'>
      <p className='font-semibold mb-2'>
        You already played today! See you again tomorrow :)
      </p>
      {savedScoreString.current}
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
          <Navbar theme={imageTheme} />
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
              <a href='https://faisal-fawad.github.io' target='_blank'>
                Faisal
              </a>
              ,{' '}
              <a href='https://nathanprobert.ca' target='_blank'>
                Nate
              </a>
              , and{' '}
              <a href='https://zachlegesse.ca' target='_blank'>
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
